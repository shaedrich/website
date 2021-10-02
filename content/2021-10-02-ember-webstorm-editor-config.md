---
title: Ember + WebStorm Editor Config
image: /images/zsofia-szalay-QZW5syZqQSw-unsplash.jpg
imageMeta:
  attribution: Zsofia Szalay
  attributionLink: https://unsplash.com/photos/QZW5syZqQSw
featured: true
authors:
  - nullvoxpopuli
date: Sat Oct 02 2021 12:09:38 GMT-0400 (Eastern Daylight Time)
tags:
  - ember
  - editor
---

# Ember + WebStorm

I don't use WebStorm, but common feedback I get from people who use WebStorm is that they don't have all the features and niceties that you'd get with neovim or VSCode even.

The main features missing from WebStorm (by default) are:
  - `hbs` tagged template literal highlighting in JavaScript and TypeScript. This is useful for tests, single-file components, as well as multi-component files.
  - [Ember Language Server](https://github.com/lifeart/ember-language-server) support. This provides a bunch of hints, go-to-definition from templates, and a bunch of nice features.
  - Integration with [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint). This is normally provided by the language server... but without the language server, there are no lint hints.
  - Correct template parsing. WebStorm uses `handlebars` parsing, which isn't correct for ember and glimmer projects as the language of templates used is only handlebars-esque and is actually much richer than handlebars while also eliminating many features of handlebars that people don't like (like implicit context scoping). It also seems that components and named blocks are incorrectly identified as custom html tags, giving you a yellow squiggly under them.
    ![screenshot of WebStorm incorrectly identifying components, and yielded values](/images/webstorm/menu-component.png)

## `hbs` template string higlighting

  So far, I've been able to solve the `hbs` tagged template literal highlighting in JavaScript and Typescript, and here is how you can set that up yourself,

In WebStorm 2021.2.2,

1. Open the File Menu > Settings
2. Search for "Injection"
3. Click on "Language Injections"
4. Click on "HTML in JS strings"
5. Click the "Duplicate" button
6. Double Click on your duplicated "HTML in JS strings"
7. Change the settings to look like this

    - Name: `HBS in JS strings`
    - ID: `Handlebars`
    - Places Patterns: `+ taggedString("hbs")`

    ![picture of above-mentioned settings](/images/webstorm/hbs-injection-settings.png)

4. End Result gets you `hbs` tagged template literal highlighting in both tests and non-test code:
  ![proof of hbs highlighting in typescript](/images/webstorm/hbs-highlighting.png)

## Other editor experiences

There are two plugins at the moment for working with Ember in IntelliJ editors:
 - [Ember.JS](https://plugins.jetbrains.com/plugin/8049-ember-js)
 - and [Ember Experimental.JS](https://plugins.jetbrains.com/plugin/15499-ember-experimental-js)

  According to the author, this adds (in addition to the previous plugin):
    - Handlebars references for tags/mustache paths and tag attributes
    - Handlebars autocompletion for tags and mustache paths
    - Handlebars parameter hints for helpers/modifiers and components
    - Handlebars renaming for mustache ids and html tags


  For all the other problems, I'll be periodically checking in with the folks who work on the Ember plugins for the IntelliJ family of editors, and see if it's feasible to get things moving sooner or later (scale of timeline unknown, obvs).


_Note that at the time of writing, I only have these plugins installed_

![Downloaded Plugins, listed below](/images/webstorm/downloaded-plugins.png)

- [Ember.JS](https://plugins.jetbrains.com/plugin/8049-ember-js)
- [One Dark theme](https://plugins.jetbrains.com/plugin/11938-one-dark-theme)
- [Rider UI Theme Pack](https://plugins.jetbrains.com/plugin/13883-rider-ui-theme-pack)
