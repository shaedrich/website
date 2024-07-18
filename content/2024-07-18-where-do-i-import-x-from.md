---
title: Where Do I Import X From
image: /images/photo-1517327236079-512484a512d7.avif
imageMeta:
  attribution: Tom Morel
  attributionLink: https://unsplash.com/photos/pathway-in-forest-8Q3Umbnr8DU
featured: true
authors:
  - nullvoxpopuli
date: Thu Jul 18 2024 11:14:31 GMT-0400 (Eastern Daylight Time)
tags:
  - ember 
  - javascript
---

# Where do I import the thing?


Ember has historically allowed access to everything in a global scope, like web-components. This provide confusing for developers, and Ember has moved to a more explicit, import-what-you-need approach, called "template-tag" -- more information on that here: https://guides.emberjs.com/release/components/template-tag-format/

A common thing I hear from folks is that they don't know where to import a component/modifier/helper from a particular addon, or maybe assume that because something isn't documented, they can't import the component/modifier/helper.

Good news:
_if it works in loose mode (the globals way)_, **the import is public API**.


Here is how you find them:

1. _open `node_modules/${libraryName}`_
    - if it doesn't exist, install `libraryName` / add to _your_ `package.json` 
2.  open the `package.json` of `libraryName`
    - does it have `exports`?
        - This _could_ look like this for types-providing projects:

            ```js 
            "exports": {
              ".": {
                "types": "./declarations/index.d.ts",
                "default": "./dist/index.js"
              },
              "./*": {
                "types": "./declarations/*.d.ts",
                "default": "./dist/*.js"
              },
              "./addon-main.js": "./addon-main.cjs"
            },
            ```
        - or it could look like this for non-types-providing projects 

            ```js 
            "exports": {
              ".": "./dist/index.js",
              "./*": "./dist/*.js",
              "./addon-main.js": "./addon-main.cjs"
            },
            ```

        Exports say if you import x from `library-name/${sub path specifier}`, the `exports` map will match to a file on disk. So you can look through the dist directory if `./*` is specified and see what all you can import. See [the docs](https://nodejs.org/api/packages.html#subpath-exports) for details.  
        For example, if you see a file in dist/components/foo.js (and given the above exports), you can import it at `library-name/components/foo`.  

        ----------------

        There is an intermediary step which _may_ or may not ever be relevant, due to how strongly folks follow conventions in with the library blueprints, but if there is an `ember-addon.app-js` key in the package.json -- this is the mapping of what is dumped in to the globals resolver, and is what is exposed to you pre-gjs/gts/template-tag. This config will looks something like this:  
        ```js
        "ember-addon": {
          "version": 2,
          "type": "addon",
          "main": "addon-main.cjs",
          "app-js": {
            "./components/foo.js": "./dist/some-other-folder/foo.js"
          }
        },
        ```
        In this scenario, instead of importing from `libraryName/components/foo`, you'd import from `libraryName/some-other-folder/foo`.  

        Once you find the file in `dist`, you're done.

  3. If the package.json you're looking at does not have an `exports` config, _and_ the library is an ember-addon (has `ember-addon` listed in `keywords`), this likely the older "v1 addon" format, which was convention-based, and didn't follow broader standards (as they didn't exist yet). _By convention_, you'll need to check the `app` folder for your components/modifiers/helpers, and see what those files define or re-export. You can then import what those files use.
    For example, if you find `app/components/foo.js` contains `export { default } from 'libraryName/some-other-folder/foo`, you can import from that same location.

