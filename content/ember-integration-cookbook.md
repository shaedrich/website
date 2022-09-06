---
title: Ember Integration Cookbook
image:
imageMeta:
  attribution:
  attributionLink:
featured: true
authors:
  - nullvoxpopuli
date: Mon Sep 05 2022 20:35:22 GMT-0400 (Eastern Daylight Time)
tags:
---

Gonna try to keep this list up to date best I can

MSW
 - [Using MSW for tests only](https://github.com/NullVoxPopuli/ember-data-resources/blob/main/tests/unit/find-all-test.ts#L16)
 - [Using MSW for development](https://github.com/NullVoxPopuli/ember-msw-development/commits/main)

 CSS / Styles
 - [tailwind, postcss, embroider](https://discuss.emberjs.com/t/ember-modern-css/19614)

Component/Template Demos / Concepts
 - [In this other post](https://discuss.emberjs.com/t/collection-of-strict-mode-template-demos-of-various-concepts/19637)
    - Effects
    - Loading Remote Data
    - Forms / Inputs
    - `Resources`
- Modifiers via the [ember-modifier](https://github.com/ember-modifier/ember-modifier) README -- probably the most comprehensive introduction to modifiers atm.

Patterns / Concepts
 - ["Keep it Local"](https://www.youtube.com/watch?app=desktop&v=Mt7v-VbFjxk&feature=emb_title) by @chriskrycho / EmberConf 2021 (Video)
 - re-thinking lifecycles
   - [avoiding `@ember/render-modifiers`](https://nullvoxpopuli.com/avoiding-lifecycle)


Starter Repos / Apps (needs READMEs / instructions for tooling setup)
 - [Polaris](https://github.com/NullVoxPopuli/polaris-starter)
 - [Polaris + Toucan](https://github.com/NullVoxPopuli/polaris-toucan-starter) (Polaris + tailwind, using the Toucan design system tailwind preset)


Custom Blueprints
 - [vitest](https://github.com/NullVoxPopuli/vitest-blueprint) - since vitest only runs in node, this is only useful for testing non-browser things
 - [complex blueprint](https://github.com/embroider-build/addon-blueprint) - the v2 addon blueprint -- lots of flags / behaviors, generates multiple packages/projects


Example Apps
 - [Octane: TodoMVC](https://github.com/NullVoxPopuli/ember-todomvc-tutorial) - deployed [here](https://nullvoxpopuli.github.io/ember-todomvc-tutorial/) - guide [on MDN](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Ember_getting_started)
