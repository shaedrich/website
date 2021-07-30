---
title: Avoiding Lifecycle in Components
image: /images/jeremy-perkins-UgNjyPkphtU-unsplash.jpg
imageMeta:
  attribution: "Jeremy Perkins"
  attributionLink: https://unsplash.comje/photos/UgNjyPkphtU
featured: true
authors:
  - nullvoxpopuli
date: Fri Jul 30 2021 08:22:45 GMT-0400 (Eastern Daylight Time)
tags:
  - new
  - ember
  - architecture
---

# Avoiding Lifecycle in Components

This is mostly going to be about `did-insert`, `did-update`, etc, aka, the
[`@ember/render-modifiers`](https://github.com/emberjs/ember-render-modifiers).


_If you know of a pattern that you use the render-modifiers for and it feels awkward and is
not covered here, let me know_

I'm writing about this, because I don't think there has been any guidance published
on what to do. A long time ago
([10 months ago](https://github.com/emberjs/ember-render-modifiers/commit/c836f83901a9068e6e3897f54cf4b7b9aa69ede5#diff-b335630551682c19a781afebcf4d07bf978fb1f8ac04c6bf87428ed5106870f5)),
a warning was added to the top of the `@ember/render-modifiers` README explaining:

> The modifiers provided in this package are ideal for quickly migrating away from classic Ember components to Glimmer components, because they largely allow you to use the same lifecycle hook methods you've already written while attaching them to these modifiers. For example, a didInsertElement hook could be called by {{did-insert this.didInsertElement}} to ease your migration process.


> However, we strongly encourage you to take this opportunity to rethink your functionality rather than use these modifiers as a crutch. In many cases, classic lifecycle hooks like didInsertElement can be rewritten as custom modifiers that internalize functionality manipulating or generating state from a DOM element. Other times, you may find that a modifier is not the right fit for that logic at all, in which case it's worth revisiting the design to find a better pattern.


> Either way, we recommend using these modifiers with caution. They are very useful for quickly bridging the gap between classic components and Glimmer components, but they are still generally an anti-pattern. We recommend considering a custom modifier in most use-cases where you might want to reach for this package.


So yeah, there is kind of a lot to unpack there. _Especially_ since we haven't really had an
alternative to the data-side / non-dom-related-side of things for a long while. Throughout this post, there will be
bulleted lists showing the benefits of each alternative -- because I usually skim long posts with code,
and I'm sure others do as well -- bulleted lists stad out ;)

## Using a custom modifier

A custom modifier is good solution for when your behavior is tied to a particular DOM node
or DOM tree. It encapsulates the lifecycle of rendering in to one co-located space so that
it's easy to understand what code is responsible for what.

❌ Bad - setup and teardown are not grouped together
```hbs
<div
  {{did-insert this.setupResize}}
  {{did-update this.updateResize}}
  {{will-destroy this.teardownResize}}></div>
```
In addition, this pattern also encourages components that have multiple responsibilities.
The component that contains this setup/update/down for resize may also have other responsibilities,
like maybe it's also managing a form, or a table, or something.

✔️  Good - behavior is grouped
```hbs
<div {{resizable}}></div>
```
This pattern collects all the related behavior in to a semantically standalone thing, a _custom modifier_.
There are built in modifiers, and you may be familiar with them, as they're the only two modifiers
in ember right now (3.27 latest at the time of writing): `{{on}}` and `{{action}}`.

How would the JavaScript side of this look? In the first example, the code in a component may look something
like this:
```js
// app/components/my-component.js
export default class MyComponent extends Component {
  // ... component stuff ...

  @action setupResize() { /* ... */ }

  @action updateResize() {/* ... */}

  @action teardownResize() { /* ... */ }

  // ... component stuff ...
}
```

which looks fine in isolation, and if this were _all_ a component did, it would not be cause for too much alarm.
But as components grow, and folks add features to existing components, those 3 functions get crowded. Extracting
them to a custom modifier is a great way to focus on a component's core responsibilities.
That extracted JavaScript may look like this:

```js
// app/modifiers/resizable.js
import Modifier from 'ember-modifier';

export default class Resizable extends Modifier {
  didInstall() { /* original setup code */ }
  didUpdateArguments() { /* original update code */ }
  willDestroy() { /* original teardown code */ }
}
```

Benefits of the custom modifier
 - all element tied to a behavior is encapsulated in a single class
 - easier to keep track of cleanup
 - can be render-tested outside of the component where it is used
 - shareable among other elements
 - reads better when parsing the template with your eyes

## Using a local modifier

Sometimes you are not sure if your modifier needs to be globally accessible or you want to keep it to yourself
while you work out the kinks before shareing it with your team. Since Ember 3.25, you can assign modifiers,
helpers, and components to class properties on components to reference locally in your component.

For example, say you decided that the above `resizable` modifier wasn't ready to be shared with folks,
you could rearrange your files like so:
```diff
-app/components/my-component.hbs
-app/components/my-component.js
+app/components/my-component/index.hbs
+app/components/my-component/index.js
-app/modifiers/resizable.js
+app/components/my-component/resizable.js
```
Also note: we moved `my-component.{js,hbs}` to `my-component/index.{js,hbs}`, not because we had to, but because
it (to me) feels nicer to have a folder contain our "private-to-the-component" stuff.

In the `my-component/index.js`, you'll need to import and assign the modifier
```js
// app/components/my-component/index.js

import Resizable from './resizable';

export default class MyComponent extends Component {
  resizable = Resizable;

  // ... component stuff ...
}
```
```hbs
<div {{this.resizable}}></div>
```
It'll work the exact same is the previously globally available version.

Benefits of a local modifier
 - most of the benefits of a custom modifier
 - additionally, modifiers that are "specific to a thing", can be kept private~ish (as private as JS allows anyway)
 - allows for easier prototyping without interfering with the global pool of modifiers

## More information on modifiers

Modifier abstractions aren't yet adopted into the framework, but you can learn more here

- [ember-modifier](https://github.com/ember-modifier/ember-modifier)
  Lots of information in here about the philosophy and thought process about when to use a modifier.
- [RFC #757: Default Modifier Manager](https://github.com/emberjs/rfcs/pull/757)
  For using plain vanilla JavaScript functions as modifiers when used in the modifier position in template syntax.
- [RFC #416: Render Element Modifiers](https://github.com/emberjs/rfcs/pull/415)
  Original RFC detailing a transition path from old ember component lifecycle hooks

## Fetching data

❌ Bad - Modifier has nothing to do with the element.
```hbs
<div {{did-insert this.fetchData}} {{did-update this.fetchData @someArg}}></div>
```
This also requires that your component have a template -- provider components, for example, do not need a template.
Additionally, this means that data is eagerly fetched, so even if your component doesn't need the data right away,
that data-fetching slows down your time-to-settled.

✔️  Good - Data is reactively and lazyily fetched as it is needed via a Resource.
```js
import { useFunction } from 'ember-resources';
export default class MyComponent extends Component {
  data = useFunction(this, async (_, someArg) => {
    let response = await fetch(`url/${someArg}`);
    let json = await response.json();

    return json;
  }, () => [this.args.someArg]);
}
```
```hbs
{{!-- when ready for use --}}
{{this.data.value}} will be the fetch's json
```
With this approach, no modifier is used and no element is needed. `data` will call your function when the `.value`
property is accessed, and it will "eventually" resolve to the returned `json` in the inner function.

There are a number of utilities in `ember-resources` for dealing with "Reactive async~ish" data a little nicer.
See the [README](https://github.com/nullVoxPopuli/ember-resources) over there for more details.

Benefits of using a Resource:
 - lazy, only runs when accessed
 - reactive, changes to tracked data will re-invoke the resource
 - everything is encapsulated, no need to worry about template <-> javascript communication
 - easily unit testable
 - can be used in vanilla JavaScript classes

## Handling destruction

For this example, assume we have a  class constructor that we've bound some events to the window.
Maybe `beforeunload` (to protect against accidental refreshes while editing a form).

❌ Bad - Modifier has nothing to do with the element.
```hbs
<div {{will-destroy this.removeWindowListeners}}></div>
```
This sometimes has caused folks to add an invisible element _just so that they can use the modifier hook_.
We should not add more DOM than we absolutely need, and behavior setup in JS should be torn down in JS.



✔️  Good -- behavior is grouped
```hbs
<div {{resizable}}></div>
```

```js
import { registerDestructor } from '@ember/destroyable';

class MyComponent extends Component {
  constructor(owner, args) {
    super(owner, args);

    this.setupWindowListener();
    this.setupScrollListener();
  }

  @action setupWindowListener() {
    /* setup */
    window.addEventListener('beforeunload', this.handleUnload)

    registerDestructor(this, () => {
      /* teardown */
      window.removeEventListener('beforeunload', this.handleUnload)
    });
  }

  @action setupScrollListener() {
    /* setup */

    registerDestructor(this, () => { /* teardown */ });
  }
}
```

For `@glimmer/component`, there is also the [willDestroy](https://api.emberjs.com/ember/release/modules/@glimmer%2Fcomponent#willdestroy) hook,
but I'd argue that co-locating setup and teardown is better long-term, because in each setup-teardown pair,
you know exactly what conditions are needed to safely teardown. Keeping that grouped together can make maintenance
easier if or when you need several teardown steps for various things (maybe you setup a few listeners, a Mutation
Observer, other stuff).

Benefits of `@ember/destroyable`
 - co-locates setup+teardown
 - can be used anywhere, not just in ember constructs
 - eliminates the need for "willDestroy" hooks provided by a framework
 - can easily share combined sets of setup+teardown functions

Docs on [`@ember/destroyable`](https://api.emberjs.com/ember/release/modules/@ember%2Fdestroyable)

Related, if you find the registerDestructor setup/teardown dance a bit tiring, there is a utility library,
[ember-lifecycle-utils](https://github.com/NullVoxPopuli/ember-lifecycle-utils) which provides a utility to
allow you to eventually create concise apis like:
```js
class Hello {
  constructor() {
    useWindowEvent(this, 'click', this.handleClick);
    useWindowEvent(this, 'mouseenter', this.handleClick);
  }
}
```

## More info on Resources

- [Introducing @use](https://www.pzuraq.com/introducing-use/) by [pzuraq](https://www.pzuraq.com/)
- [ember-could-get-used-to-this](https://github.com/pzuraq/ember-could-get-used-to-this)
- [ember-resources](https://github.com/NullVoxPopuli/ember-resources)
  - note that ember-resources is inspired by pzuraq's work, and solves some of the common challenges
    that the ember-could-get-used-to-this' implementation faces:
    - Typescript support without wrapper no-op methods
      - No need for decorator (typescript can't augment types with decorators)
    - Custom Resources no longer need a magic 'value' property
    - Built in support for (async) functions and concurrency tasks

    Much thanks to pzuraq, because without ember-could-get-used-to-this, ember-resources would not have existed.

- [RFC 567: `@use` and Resources](https://github.com/emberjs/rfcs/pull/567)
  - Discussion that lead to a bunch of smaller RFCs and the implementation of ember-could-get-used-to-this


## Why even change how I write code at all?

You don't have to, that's up to you. One of the primary reasons `@ember/render-modifiers` was made as an
addon was so that it _didn't_ have to be part of the framework, and that individual projects and teams
could decide if it was the right fit for them. It's a very small package, so if it's only used in a few places,
bundle size isn't that much of a concern for the average app.

