---
title: "<template> quickstart"
image: /images/rene-bohmer-YeUVDKZWSZ4-unsplash.jpg
imageMeta:
  attribution: "Rene Böhmer"
  attributionLink: https://unsplash.com/photos/YeUVDKZWSZ4
featured: true
authors:
  - nullvoxpopuli
date: Sun Jun 04 2023 08:39:26 GMT-0400 (Eastern Daylight Time)
tags:
---

This is a quick reference guide for getting started with gjs/gts aka `<template>`.

The RFC that concluded the research in to this new file format is
[RFC#779 First-Class Component Templates](https://github.com/emberjs/rfcs/pull/779)

## For all projects

1. For syntax highlighting:
    - in neovim and VSCode, see [here](https://github.com/ember-template-imports/ember-template-imports/#editor-integrations)
    - on the web, use `highlight.js` via [highlightjs-glimmer](https://github.com/NullVoxPopuli/highlightjs-glimmer/)

2. For type checking `gts`, you'll use [`glint`](https://github.com/typed-ember/glint) instead of `tsc`.
  Ember Glint documentation is here [on the Glint docs site](https://typed-ember.gitbook.io/glint/environments/ember).
  <br>
  Ensure that your tsconfig.json has 

    ```json 
    {
      "compilerOptions": { /* ... */ },
      "glint": {
        "environment": [
          "ember-loose",
          "ember-template-imports"
        ]
      }
    }
    ```
3. For linting, there are two paths:
    - Quickest:<br>
      use `configs.ember()` from [`@nullvoxpopuli/eslint-configs`](https://github.com/NullVoxPopuli/eslint-configs) 
    - Modifying you're existing lint command:<br>
      ```bash 
      eslint . --ext js,ts,gjs,gts
    ```

    To get linting working in VSCode, you'll need to modify your settings:
    ```json 
    "eslint.probe": [
     // ...
     "glimmer-js", 
     "glimmer-ts"
    ],
    "eslint.validate": [
      // ...
      "glimmer-js",
      "glimmer-ts"
    ],
    ```

    For neovim,
    ```lua 
    local lsp = require('lspconfig')
      
    -- ✂️ 

    local eslint = lsp['eslint']
      
    eslint.setup({
      filetypes = { 
        "javascript", "typescript", 
        "typescript.glimmer", "javascript.glimmer", 
        "json", 
        "markdown" 
      },
      on_attach = function(client, bufnr)
        vim.api.nvim_create_autocmd("BufWritePre", {
          buffer = bufnr,
          command = "EslintFixAll",
        })
      end,
    })
    ```

4. For prettier/formatting, you'll need [`prettier-plugin-ember-template-tag`](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/)
  And for the best experience / workflow, run eslint and prettier separately (without the popular eslint-plugin-prettier)

## In an App

1. Install [`ember-template-imports`](https://github.com/ember-template-imports/ember-template-imports/).
  Ignore everything about `hbs`, and only use `<template>`

## In a v1 Addon

1. Install [`ember-template-imports`](https://github.com/ember-template-imports/ember-template-imports/).
  Ignore everything about `hbs`, and only use `<template>`

## In a v2 Addon

1. Follow instructions on the README for this rollup plugin:
[rollup-plugin-glimmer-template-tag](https://github.com/NullVoxPopuli/rollup-plugin-glimmer-template-tag)

## Usage and Patterns

See the interactive glimmer tutorial: [https://tutorial.glimdown.com](https://tutorial.glimdown.com)

## Notes

`ember-template-imports` easily provides a prototype of the features described by `RFC#779`, but `embber-template-imports` is not the final form of the `<template>` feature -- it as an easy way to set up the support today, but future techniques for enabling `<template>` will be easier. When reviewing the README for `ember-template-imports`, ignore everything about `hbs`, it will not be supported.   

## Example Projects using gjs/gts

Each of these projects is setup with linting, typechecking, etc

Hopefully they can be a reference for when issues are encountered upon setup

- https://github.com/NullVoxPopuli/limber
- https://github.com/NullVoxPopuli/ember-resources/
- https://github.com/universal-ember/ember-primitives/
- https://github.com/CrowdStrike/ember-headless-form/
- https://github.com/CrowdStrike/ember-headless-table/
