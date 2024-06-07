---
title: Effects in Ember
image: /images/daniels-joffe-PhQ4CpXLEX4-unsplash.jpg
imageMeta:
  attribution: Ethan Hoover 
  attributionLink: https://unsplash.com/photos/person-holding-fire-works-KkI9YpmO-mc 
featured: true
authors:
  - nullvoxpopuli
date: Wed Dec 20 2023 14:00:38 GMT-0500 (Eastern Standard Time)
tags:
  - ember
  - javascript
---



Originally from [How to make an effect in Ember?](https://discuss.emberjs.com/t/how-to-make-an-effect-in-ember/20520?u=nullvoxpopuli)

@trusktr asks:

> What’s the equivalent of Solid.js `createEffect()` (or React `useEffect()`, Meteor `Tracker.autorun()`, MobX `autorun()`, Vue `watchEffect()`, Svelte `$effect()`, Angular `effect()`) in Ember.js?


This is certainly shocking to folks new to ember, but ember deliberately doesn't have an any effect by default.

Now, as a _framework_ author, the concept does  _sort of_ exist (at a high level) -- but I'll circle back around to this in a smidge.

In your Solid demo, if you want to log function calls, you'd do:

```js
const a = () => 1;
const b = () => 2;
const c = () => 3;

<template>
  {{log (a) (b) (c)}}
</template>
```
Some notes on function invocation syntax, if needed
- [Glimmer Tutorial: Transforming Data](https://tutorial.glimdown.com/1-introduction/3-transforming-data)
- https://cheatsheet.glimmer.nullvoxpopuli.com/docs/templates#template__notation

We use templates as the sole entrypoint to reactivity, whereas solid's reactivity is more general purpose.  With templates, and being DOM focused ([for now](https://github.com/emberjs/ember.js/issues/20648)), we can ask ourselves:

> "If the user can't see the data rendered, does the data need to exist?"

Now, you're demo (with logging) is definitely effect-y. And if you _had no other way_ (like the situation was somehow impossible to model in a derived data way), you can do this:
```js
function myLog() {
  console.log(a(), b(), c());
}

<template>
  {{ (myLog) }}
</template>
```
This would auto-track, so as the consumed tracked data accessed from each of `a`, `b`, and `c` changed, `myLog` would get to re-run. 
However, this has a caveat: data may not be _set_ within `myLog`, else an infinite render loop would occur.

This is covered here
- [Glimmer Tutorial: _synchronizing state_](https://tutorial.glimdown.com/2-reactivity/10-synchronizing-external-state) (to the console in this  case)


There is a way around the above caveat, not being able to set during render, by making `myLog` invoke an async-IIFE, and waiting a tiny bit (i.e.: setting slightly after render):
```js
// now we're passing in the args directly so that they
// are tracked (all args are auto-tracked in all
// function / helper / component / modifier execution
// coming from the template)
function myLog(...args) {
  async function run() {
    await 0;
    // causes a change in a's data
    // and because we awaited, we don't infinite loop 
    setA(); 
    // prints a pre-setA, because a was passed in
    console.log(...args);
  }
 // return nothing, render nothing 
 // (we have no result to show the user)
}

<template>
  {{myLog (a) (b) (c)}}
</template>
```

This is nuanced, and is why I made this tiny abstraction a whole thing over here https://reactive.nullvoxpopuli.com/functions/sync.sync.html
it's 95% documentation, 5% code :sweat_smile: 

------

So coming back to:

> "We deliberately don't have effects"

Because of a couple current facts about our ecosystem:
- we want derived data to be preferred, because it is the most efficient way to have your render state settle
- calling a function from a template can only happen after the template is rendered, so doing so causes a _second render_ (I believe this is true in React as well) 
- there _is_ a need to synchronize external state, and that has been part of the exploration of _Resources_, and `Sync`
    - [Starbeam Docs on `Sync`](https://newdocs-rho.vercel.app/docs/universal/fundamentals/sync.html)
    - [Starbeam Docs on `Resource`s](https://www.starbeamjs.com/guides/fundamentals/resources.html)
    - Current ember implementation does not have `sync` capabilities: [ember-resources](https://github.com/NullVoxPopuli/ember-resources/tree/main/docs) (due to limitations of the private APIs implementing reactivity (ember-resources is public-API only))
    - [Tutorial Chapters on Resources](https://tutorial.glimdown.com/2-reactivity/5-resources) 
- we think that effects are _overused_ and a huge footgun (for app devs), so by documenting a story more around synchronizing external state, we can continue to guide devs in to a pit of success.

Note: Starbeam is where we're extracting our reactivity primitives, and are planning to swap to Starbeam entirely at some point once we work out some composition ergonomics for serial Resources (the coloring problem).


Hope this helps! 
If anything is unclear or if you have more questions, let me know!
