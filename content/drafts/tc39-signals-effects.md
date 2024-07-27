
### effects

Since the proposal's submission to TC39, one of the most commonly requested features is an "effect" primitive. There are a few different reasons that folks cite for needing effects, but we'll get to that in a bit -- first, we need to understand why effects were left out of the proposal.  

> _How much could we share?_

The initial implementation of the Signals proposal includes a [`Watcher`](https://github.com/tc39/proposal-signals?tab=readme-ov-file#implementing-effects) API, which allows framework authors to choose their own timing semantincs, batching, or phase, to run all the effects. In situations where rendering is how effects are used, rendering can be expensive (imagine updating 10,000 or more DOM nodes), and you may want to some sort of [scheduler](https://github.com/emberjs/rfcs/pull/957/) that optimizes how the rendering happens or gives the reactive graph a chance to settle to reduce rendering attempts (i.e.: it's wasteful to render faster than a monitor's refresh rate but also, if the reactive graph hasn't stabilized, you don't want to render glitches -- there is a correlation to video games here where games can have adaptive refresh rates to reduce jitter and screen tearing that result in smoother visuals, rather than trying to force a new image every frame of the monitor's default frame rate). 

How this exactly happens is slightly different between each framework ecosystem, so effects can't be implemented as a core feature (for all frameworks to use) because frameworks have different semantics for when the effect actually runs.

Additionally, the `Watcher` implementation requires "unsubscribing", like you would with a [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) or [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) or [`add/remove eventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener). And in order to safely unsubscribe, you either need an ownership implementation (e.g.: when a parent "container" is destroyed, you would also also destroy / clean up / unsubscribe from all child things). 

_But_, after some discussions with early reviewers of the proposal, some folks are perfectly fine with managing cleanup themselves -- it's something that developers would be used to if they aren't using a framework which reduces the need to think about cleanup altogether. After all, UI _frameworks_ are not the only audience for the Signals proposal, and there are a lot of cool projects brewing out there using reactive programming outside of UI frameworks. 

**There are many kinds of effects**. The different kinds of effects depend on timing, semantics, and batching. Here is a table of the types of effects as I can remember them at the moment:

| | Synchronizing External State | Synchronizing Internal State | Immediate-Read |
| --- | ---------- | ----------- | ------------- |
| Synchronous Effects |   |  ✅  | ✅ |
| Scheduled Effects | ✅ | | | 
| Lifecycle Effects | ✅ | 😬 | |

There are three categories here:
- Synchronizing External State: Updating state outside of your program, such as the URL, another library, a storage, etc -- state that is not usually reactive.
- Synchronizing Internal State: Updating state within your program, this state would already be reactive. 
- Immediate-Read: See the example below under `_Synchronous Effect_`


As a bit of an aside, I think we need more names for these sorts of things. Between the overloaded functionality/semantics here, with effects, and the vastly different audiences that will be interacting with Signals, and the proposal in general, I think more specific names (or multi-word names?) would help a ton in terms of clarity and communicating intent.

**What's a Scheduled or Lifecycle Effect?**

These are most of the types of effects that folks have used in their daily life. Not all, but most frameworks have timing semantics to their effects which integrate nicely with some rendering scheduler to help batch changes to flush to a UI. For example, React has 3 kinds of userland effects: [useEffect](https://react.dev/reference/react/useEffect), [useLayoutEffect](https://react.dev/reference/react/useLayoutEffect), and [useInsertionEffect](https://react.dev/reference/react/useInsertionEffect).

**What's a _Synchronous Effect_?**

These were new to me, as I began exploring how different ecosystems think about reactivity -- here is the gist as code:
```js
const a = new Signal.State(0);
const b = new Signal.State(0);

syncEffect(() => a.set(b.get()));

a.get(); // 0;
b.set(1);
a.get(); // 1
```

In contrast with Scheduled or Lifecycle Effects, the following behavior would be observed -- values are not immediately available:
```js
const a = new Signal.State(0);
const b = new Signal.State(0);

createEffect(() => a.set(b.get()));

a.get(); // 0;
b.set(1);
a.get(); // 0
await /* a tiny bit of time, microtask, animation frame, etc */ 
a.get(); // 1
```

As with all effects, we risk introduce ["spooky action at a distance"](https://en.wikipedia.org/wiki/Action_at_a_distance_(computer_programming)), but the gist is that this type of (synchronous) effect maintains Glitch-free behavior by running immediatly after consumed signals within the effect are written to. 

In a more real use case, they can be used to implement the `localCopy` pattern for forking state locally until the remote value updates, at which point the "local copy" is re-set back to the value of the remote. Here are examples using effects in [Preact (using useRef, useEffect, effect)](https://preactjs.com/repl?code=aW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAncHJlYWN0JzsKaW1wb3J0IHsgdXNlUmVmLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnOwppbXBvcnQgeyBzaWduYWwsIGVmZmVjdCwgdXNlU2lnbmFsIH0gZnJvbSAnQHByZWFjdC9zaWduYWxzJzsKaW1wb3J0IHsgaHRtbCB9IGZyb20gJ2h0bS9wcmVhY3QnOwoKZnVuY3Rpb24gdXNlTG9jYWxDb3B5KHJlbW90ZSkgewoJY29uc3QgbG9jYWwgPSB1c2VSZWYoKTsKCWlmICghbG9jYWwuY3VycmVudCkgewoJCWxvY2FsLmN1cnJlbnQgPSBzaWduYWwocmVtb3RlLnBlZWsoKSk7Cgl9CgoJdXNlRWZmZWN0KCgpID0%2BIHsKCSAgLy8gU3luY2hyb25vdXNseSB1cGRhdGUgdGhlIGxvY2FsIGNvcHkgd2hlbiByZW1vdGUgY2hhbmdlcy4KCSAgLy8gQ29yZSBlZmZlY3RzIGFyZSBqdXN0IGEgd2F5IHRvIGhhdmUgc3luY2hyb25vdXMgY2FsbGJhY2tzCgkgIC8vIHJlYWN0IHRvIHNpZ25hbCBjaGFuZ2VzIGluIGEgcHJldHR5IGVmZmljaWVudCB3YXkuCgkJcmV0dXJuIGVmZmVjdCgoKSA9PiB7CgkJCWxvY2FsLmN1cnJlbnQudmFsdWUgPSByZW1vdGUudmFsdWU7CgkJfSk7Cgl9LCBbcmVtb3RlXSk7CgoJcmV0dXJuIGxvY2FsLmN1cnJlbnQ7Cn0KCmZ1bmN0aW9uIERlbW8oeyBuYW1lLCBvblN1Ym1pdCB9KSB7CgkJY29uc3QgbG9jYWxOYW1lID0gdXNlTG9jYWxDb3B5KG5hbWUpOwoKICAgIGNvbnN0IHVwZGF0ZUxvY2FsTmFtZSA9IChpbnB1dEV2ZW50KSA9PiBsb2NhbE5hbWUudmFsdWUgPSBpbnB1dEV2ZW50LnRhcmdldC52YWx1ZTsKCiAgICBjb25zdCBoYW5kbGVTdWJtaXQgPSAoc3VibWl0RXZlbnQpID0%2BIHsKICAgICAgICBzdWJtaXRFdmVudC5wcmV2ZW50RGVmYXVsdCgpOwogICAgICAgIG9uU3VibWl0KHsgdmFsdWU6IGxvY2FsTmFtZS52YWx1ZSB9KTsKICAgIH0KCiAgICByZXR1cm4gaHRtbGAKICAgICAgICA8Zm9ybSBvblN1Ym1pdD0ke2hhbmRsZVN1Ym1pdH0%2BCiAgICAgICAgICAgIDxsYWJlbD4KICAgICAgICAgICAgICAgIEVkaXQgTmFtZTogICAKICAgICAgICAgICAgICAgIDxpbnB1dCB2YWx1ZT0ke2xvY2FsTmFtZS52YWx1ZX0gb25JbnB1dD0ke3VwZGF0ZUxvY2FsTmFtZX0gLz4KICAgICAgICAgICAgPC9sYWJlbD4KCiAgICAgICAgICAgIDxidXR0b24%2BU3VibWl0PC9idXR0b24%2BCiAgICAgICAgPC9mb3JtPgoKICAgICAgICA8cHJlPmxvY2FsVmFsdWU6ICR7bG9jYWxOYW1lfTxiciAvPnBhcmVudCB2YWx1ZTogJHtuYW1lfTwvcHJlPmA7Cn0KCmV4cG9ydCBmdW5jdGlvbiBBcHAoKSB7CiAgICBjb25zdCBuYW1lID0gdXNlU2lnbmFsKCdNYWNlIFdpbmR1Jyk7CiAgICBjb25zdCBkYXRhID0gdXNlU2lnbmFsKCcnKTsKCiAgICBjb25zdCBoYW5kbGVTdWJtaXQgPSAoZCkgPT4gZGF0YS52YWx1ZSA9IGQ7CiAgICBjb25zdCBjaGFuZ2VOYW1lID0gKCkgPT4gbmFtZS52YWx1ZSArPSAnISc7CgogICAgcmV0dXJuIGh0bWxgCiAgICAgICAgPCR7RGVtb30gbmFtZT0ke25hbWV9IG9uU3VibWl0PSR7aGFuZGxlU3VibWl0fSAvPgoKICAgICAgICA8aHIgLz4KCiAgICAgICAgQ2F1c2UgZXh0ZXJuYWwgY2hhbmdlIChtYXliZSBzaW11bGF0aW5nIGEgcmVmcmVzaCBvZiByZW1vdGUgZGF0YSk6CiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPSR7Y2hhbmdlTmFtZX0%2BQ2F1c2UgRXh0ZXJuYWwgQ2hhbmdlPC9idXR0b24%2BCgogICAgICAgIDxociAvPgogICAgICAgIExhc3QgU3VibWl0dGVkOjxiciAvPgogICAgICAgIDxwcmU%2BJHtKU09OLnN0cmluZ2lmeShkYXRhLnZhbHVlLCBudWxsLCAzKX08L3ByZT5gOwp9CgpyZW5kZXIoPEFwcCAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpKTsK) and [Solid (using createMemo + untrack)](https://playground.solidjs.com/anonymous/0cf7972e-f55d-4483-909d-6c172c80d5ac).
But what's interesting about this specific use case is that _you don't need an effect_ to achieve the same behavior. In Ember, where there is no effect primitive at all, this can be [implemented here](https://limber.glimdown.com/edit?c=MQAgYg9gTg1glgOwOYgMoBcCG6CmIDuc6AFiAEo4C2EuIAqgA4Am2OAzgFAfHroNsAuAPRD0hXjigA6AMYRKQgPpQ2M4lDht0cTAiFbsAVzZCAjAHZzABgAcNgGwP7ATgDMAVlfnXzgCw2uAANgpAArNhAAGzgANxwOOEoGaHQQAGF5ZIQcBFSAMyh5EAByAAEkaMpKSSE5JIhs3OKAbgT6qFSAbxB0KEwZGBwmEABfEAKisorE6qhRPoHEJBa25I6QbobR8cLKEtKqACMa6iY4PLhJFcS1rpAkHFSxib2yo5qIQ9CcGXQVjhkkUwbAiAFlHpgNhwQCAGFAcDEKNRcK0YQwcDgYKiQKVev1BsMYphIoYcK0Rlw8oYEL84FsHugAPJQNLw1jgrAACkQBhpOAANCBqlg2ILEEQdNEAF6SACUUJhkUeQohIAAvCqRVIGdyELyZDhZa1oSBziBOcLIWrrSBqUwcBdskx5Z0TTDLeqQNl8CAOZhOUa3ZrgVI2I9dfqBcHA0HLVIiSS8Bq4%2BjMeqgzD0ABPdEQPKmhAS4lwGVQdU24pUmnaBrFDMwkAAfgLRelklkxMiEawfNl9ZhAhb2mLpexFJN8PQhigCGD5K4HCrtK2kQgMmJGQYWYtVAgYsLw7bUBdJqVqUtEQ13pAAHUcJgYKDMAwA8aYZPp7POUIAFSwwroDQOZRoMWaCvaqggD%2BQjymqAB8CoNmeKrUGAs4apynyhLBCE6lhgrVNQMYNiAH4zohJE6ieJEkchHoagyzKsveuB%2BpyJCaAREKikOkolnK2I0VEyrdHCCJIjQeBjMmEJvkJwmpIgdRLAAasSpKeoREBoexxCcf%2B4m7rgxHyWanJiYiRl4AAhDaSnyKp6mGhR8kiCAACS%2BYkHg9mUEsIAJhpmhejQPTEHgbCYNUIDAmFeAWXSxgFspyABU5-L9g2bmGMwrBxVEa7EmliY9BAQrYGo%2BXXr5-mBVGujDDlLC4JlMJud5BkxIlEQ1aldVSK1wbxk5mkQlIFkSbQGq9UgamJoJNHjvJpGPJ%2BQ11QtMIjBl9ZhugnJ1dRpn5py1kXlIxDArpmiykdy10aqDGPExbKsRC108Re%2B6tvxx6bTRKbwpZyJJih2kIB9gbLe6Y11Z6G2DWRCD-VtXDLYxLKvTgbEcZ93HfYev2ysNJUagjQnbUGIxjvOXCAsCEQACK7iAOAAB64AgTARBk9SNF0JqlKu66RJu27FJgUBIGwJOksU8rC8Sc2knJTWsAAMoVkTK6DQa6gwhjoAAonEuQ4WFmhSIr2sjdNCAG8bpvoFIWBS48stkmjICXVzSqoIYhx%2BakGp62wAdBybOToObrpCWHgdEJHuTjUDUfM3kmCGJE%2B1QzRuNSJL0tSA0-sJ-t3R1YO%2BfWzroy56jJpuQAgiAci5IUkRKsMiAOyaAA8uBJECuBwUGfd5NAeydJ0WzFPHQfFBbMs%2B0wfvh0QIwjKPQl90CxyRNv8lG2cqQAHJRTgg4wplfc94bxWkmq0-V1rOubxsM%2BzsUd9-EvUhq7gTWIs35jCEIfEifchB7xwAfL2EDDiG0AggOCpcg6QIQbwBo4CQCQInlASgo8x5iTgjXJyV9obPz0jLUhiZN590OFAOC8IQY4krh-UodU6FCGIXAnBWgsxKmwTCH%2BGwQCHGgPaKAg5TAMDZiANgEBohMGaKMMe%2BhsyCP7qIKgDBh44FHuOdmtwQD2gzlnVI9MQQgCbgwBgrMOY5G5ukTIDQo6IVxAsAkD9QYACInwGlvIgJghgfHYg8fiIYJjsCYDkt7Bqa8y6ek5M1TA5t84pM9CkwSahdAPHPtFDCaSqEexAAAag1MUay-wYQDx0Xo7BfdmbUFYU5J%2BnR86cLGKUEu690BtPzivBJQd35gN4X3dQhCSJpEzmGexuAZxFRycgPAFpMBZmOPIxIWdsD%2BUhPCAo7BSB5hWiwlJsoBBjwwUgj%2Bs9ARwAGIvfOSy8kX03nBaZxg8BGwcQsyI6QfYPHQYgrBYyJlBnVsCVIqCiC4CYAIehjCiHwjgtPAAUqgRkp9Qy9CWOcLMf8MkICzn81wXCeE1O0UPVgBiODBECBwIAA&format=glimdown) using a "Meta" pattern, which provides extra user-land defined behaviors that would otherwise be considerd dangerous (glitch / bug prone) to be widely available. And this is what is used in the [signal-utils implementation of localCopy](https://github.com/proposal-signals/signal-utils/blob/main/src/local-copy.ts).

-------

_It is human nature to think in terms of cause and effect_, but in programming, we often benefit from not thinking like humans. 

----

I know a lot of folks are used to thinking in effects in programming, so the fact that the signals proposal doesn't have effects as a primitive has been quite jarring, and frustrating for many. 
In general, though, (and I went through this journey myself, going from React for many years into the Ember ecosystem), I'd like to encourage folks to try, even if just for mental exercise or experimentation, to not use effects.

For example, back in my React days, I'd see a lot of running async functions using effects (I even did this when I was first learning hooks!) -- but it's not needed. We can use an "impure" computed, which invokes an async function gives us a reactive state back to inspect the lifecycle states of the returned Promise. In [signal-utils' `signalFunction`](https://github.com/proposal-signals/signal-utils/blob/main/src/async-function.ts),
```ts
export function signalFunction<Return>(fn: () => Return): State<Return> {
  const state = new State(fn);
  const computed = new Signal.Computed(() => {
    state.retry();

    return state;
  });

  /**
   * We have to use a proxy here so that we re-get on each property acess.
   * this allows the consumers of this signalFunction to not have to bother with
   * signal APIs, and just worry about dealing with our `State` API.
   *
   * If any signal data is consumed in the passed `fn` before the first await, 
   * (before the first microtask queue schedule)
   * changes to that signal data will cause `state.retry()` to get called again,
   * giving us a new request with new pending / error status, etc.
   */
  return new Proxy(state, {
    get(_, property, receiver) {
      computed.get();
      return Reflect.get(state, property, receiver);
    },
  });
}
```

This call to `state.retry()` is a side-effect, (and further, why we need more names for these behaviors), but it is consistently re-invoked any time signals in `fn` change.

A userland example of usage of the above utility:
```js
const idSignal = new Signal.State(1);

const asyncState = signalFunction(async () => {
  let id = idSignal.get();

  // anything beyond here is not entangled with the `asyncState`
  await // ...
});
```

Some folks may want automatic cleanup, such as via [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController), but automatic integration of that requires implementing an ownership and lifetime system.

#### scheduling

One thing I'd like to see explored, for UI frameworks (be that the in a browser, or in a terminal), is a [Render-Aware Scheduler][rfc-render-aware] (by [@runspired][runspired]).

![Frame overview](/svg/rfc-0957-frame-overview.svg)

I don't know if this design (there is [sample code in the RFC][rfc-render-aware]) has enough granularity and flexibility for all frameworks to use, but it would, imo, be the next step in figuring out what can be shared across frameworks.
Once there is a scheduler, we could have a consistent effect (or set of effects) with consistent timing semantics.
_And then_, we could maybe start exploring a shared ownership model! Which could mean that destruction and _most_ code across all frameworks that wasn't product or framework-api-specific could be shared. 

If / when that happens, then there would no longer be a need for [Starbeam](https://github.com/starbeamjs/starbeam)[^starbeam-note] (or similar projects) -- assuming that the reactive primitives we have at that point between frameworks agree with each other -- one of Starbeam's goals is to provide the same timing semantics across all frameworks and unify the behavior of higher-level reactive primitives -- it provides predictable behavior with Externally syncing state (`Sync`), functions with lifetime and cleanup (`Resource`), element modifiers, services, etc. 


[rfc-render-aware]: https://github.com/emberjs/rfcs/pull/957/
[runspired]: https://twitter.com/still_runspired


---------------------------------------

All this isn't to say I don't think effects should ever be in the proposal -- but it will be _difficult_. [signal-utils][signal-utils] provides an effect that you have to unwatch yourself, and that has proven useful for my own [JSBin demos][jsbin-signal].

In summary, outside of application development, here are places where effects are _needed_ 
- DOM rendering (frameworks implement these)
- WebGL / Canvas / Game rendering 
-  

