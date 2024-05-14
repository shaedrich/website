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
  - ember
---

This is a quick reference guide for getting started with gjs/gts aka `<template>`.

The RFC that concluded the research in to this new file format is
[RFC#779 First-Class Component Templates](https://github.com/emberjs/rfcs/pull/779)

## For all projects

1. For syntax highlighting:
    - in neovim and VSCode, see [here](https://github.com/ember-template-imports/ember-template-imports/#editor-integrations)
    - on the web,
        - `highlight.js` via [highlightjs-glimmer](https://github.com/NullVoxPopuli/highlightjs-glimmer/)
        - [`shiki` ](https://github.com/shikijs/shiki/tree/main) has gjs support built in

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
    <br>
    Note that in Glint projects, you'll want to disable `tsserver`, so you don't have double-reported errors.
3. For linting, there are two paths:
    - Quickest:<br>
      use `configs.ember()` from [`@nullvoxpopuli/eslint-configs`](https://github.com/NullVoxPopuli/eslint-configs) 
    - Modifying you're existing lint command:<br>
      ```bash 
      eslint . --ext js,ts,gjs,gts
      ```
      if you otherwise don't specify extensions, having a sufficiently  new enough [lint config from the app blueprint](https://github.com/ember-cli/ember-new-output/blob/v5.1.0/.eslintrc.js#L19) should "just work"
    - make sure you have at least `eslint-plugin-ember@12.0.2`
    - use the ember eslint parser in your eslint config, (mentioned in the [eslint-plugin-ember README](https://github.com/ember-cli/eslint-plugin-ember?tab=readme-ov-file#gtsgjs))

       ```js
       module.exports = {
          // ...
          overrides: [
            // ...
            {
              files: ['**/*.gts'],
              plugins: ['ember'],
              parser: 'ember-eslint-parser',
            },
            {
              files: ['**/*.gjs'],
              plugins: ['ember'],
              parser: 'ember-eslint-parser',
            },
          ],
       };
       ```

    To get linting working in VSCode, you'll need to modify your settings (and be sure to include the defaults as well for both of these settings):
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
    // ...
    "prettier.documentSelectors": ["**/*.gjs", "**/*.gts"],
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
    neovim has support for `typescript.glimmer` and `javascript.glimmer` built in. [`vim-polyglot`](https://github.com/sheerun/vim-polyglot) breaks neovim's built-in syntax resolving, so uninstall that if you have it (neovim ships with treesitter which has very extensive language support).

4. For prettier/formatting, you'll need [`prettier-plugin-ember-template-tag`](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/)
  And for the best experience / workflow, run eslint and prettier separately (without the popular eslint-plugin-prettier)

## In an App

1. Install [`ember-template-imports`](https://github.com/ember-template-imports/ember-template-imports/).
2. If you use TypeScript,
  1. update your [babel config](https://github.com/emberjs/ember-cli-babel?tab=readme-ov-file#options) to have:
  
    ```js
      "plugins": [
        [
          "@babel/plugin-transform-typescript",
          { "allExtensions": true, "onlyRemoveTypeImports": true, "allowDeclareFields": true }
        ],
        // ...
    ```

  3. update your tsconfig.json to have (in `compilerOptions`)
  
    ```js
    "verbatimModuleSyntax": true,
    ```


## In a v1 Addon

1. Install [`ember-template-imports`](https://github.com/ember-template-imports/ember-template-imports/).
2. If you use TypeScript,
  1. update your [babel config](https://github.com/emberjs/ember-cli-babel?tab=readme-ov-file#options) to have:

    ```js
      "plugins": [
        [
          "@babel/plugin-transform-typescript",
          { "allExtensions": true, "onlyRemoveTypeImports": true, "allowDeclareFields": true }
        ],
        // ...
    ```

  2. update your tsconfig.json to have (in `compilerOptions`)

    ```js
    "verbatimModuleSyntax": true,
    "allowImportingTsExtensions": true,
    ```



## In a v2 Addon

1. `@embroider/addon-dev` provides a `addon.gjs()` plugin.

## Usage and Patterns

See the interactive glimmer tutorial: [https://tutorial.glimdown.com](https://tutorial.glimdown.com)

## Notes

`ember-template-imports` easily provides a prototype of the features described by `RFC#779`, but `embber-template-imports` is not the final form of the `<template>` feature -- it as an easy way to set up the support today, but future techniques for enabling `<template>` will be easier. When reviewing the README for `ember-template-imports`, ignore everything about `hbs`, it will not be supported.   

## Example Projects using gjs/gts

Each of these projects is setup with linting, typechecking, etc

Hopefully they can be a reference for when issues are encountered upon setup

- [The Limber Project (REPL and Tutorial)](https://github.com/NullVoxPopuli/limber)
- [ember-resources](https://github.com/NullVoxPopuli/ember-resources/)
- [ember-primitives](https://github.com/universal-ember/ember-primitives/)
- [ember-headless-form](https://github.com/CrowdStrike/ember-headless-form/)
- [ember-headless-table](https://github.com/CrowdStrike/ember-headless-table/)

  ## See also
  
  - [Glint and &lt;template&gt;](https://mfeckie.dev/glint-and-ember-template-imports/)
