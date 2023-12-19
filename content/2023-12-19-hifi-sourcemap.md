---
title: hifi sourcemaps
image: /images/kevin-woblick-uY6JPPzjoi0-unsplash.jpg
imageMeta:
  attribution: "Kevin Woblick"
  attributionLink: https://unsplash.com/photos/black-and-silver-speaker-on-white-ceramic-tiles-uY6JPPzjoi0
featured: false
authors:
  - nullvoxpopuli
date: Tue Dec 19 2023 11:56:17 GMT-0500 (Eastern Standard Time)
tags:
  - ember
---

If you're using [webpack](https://webpack.js.org/) with Ember, you may want to configure the [`devtool`](https://webpack.js.org/configuration/devtool/) option to have higher fidelity sourcemaps. Note though that on bigger projects (and I mean more than a few dozens of MB of JS), enabling the `source-map` option can increase build time by up to 40% (from at least what I've seen).


If you're using:
_ember-auto-import_:

```js
// ember-cli-build.js
let app = new EmberApp(defaults, {
  autoImport: {
    webpack: {
      devtool: 'source-map',
    }
  }
  /* ... */
});
```

_embroider_:
```js
// ember-cli-build.js
return require('@embroider/compat').compatBuild(app, Webpack, {
  /* ... */
  packagerOptions: {
    webpackConfig: {
      devtool: 'source-map',
      /* ... */
    },
  },
});
```

## A simple component

### with the defaults

![default devtool option](/images/sourcemaps/to-eval.png)

<details><summary>The code from the screenshot</summary>

```ts
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Header: () => (/* binding */ Header)
/* harmony export */ });
/* harmony import */ var _header_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./header.css */ "./components/header.css");
/* harmony import */ var ember_primitives__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ember-primitives */ "../../.pnpm/ember-primitives@0.10.1_@babel+core@7.23.3_@ember+test-helpers@3.2.1_@glimmer+component@1.1.2_2udfmchmj4htznuxtzf4ynvf4y/node_modules/ember-primitives/dist/components/external-link.js");
/* harmony import */ var _icons_fa_external_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./icons/fa/external-link */ "./components/icons/fa/external-link.ts");
/* harmony import */ var _universal_ember_preem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @universal-ember/preem */ "../../.pnpm/@universal-ember+preem@0.1.7_@babel+core@7.23.3_@ember+test-helpers@3.2.1_@glimmer+component@_orczibosv232nhi52ufgg3bjky/node_modules/@universal-ember/preem/dist/index.js");
/* harmony import */ var _ember_template_factory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ember/template-factory */ "../rewritten-packages/ember-source.848c2a54/node_modules/ember-source/@ember/template-factory/index.js");
/* harmony import */ var _ember_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ember/component */ "../rewritten-packages/ember-source.848c2a54/node_modules/ember-source/@ember/component/index.js");
/* harmony import */ var _ember_component_template_only__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ember/component/template-only */ "../rewritten-packages/ember-source.848c2a54/node_modules/ember-source/@ember/component/template-only.js");







const Header = (0,_ember_component__WEBPACK_IMPORTED_MODULE_4__.setComponentTemplate)((0,_ember_template_factory__WEBPACK_IMPORTED_MODULE_3__.createTemplateFactory)(
/*
  
  <header>
    <div>
      <ExternalLink class="github" href="https://github.com/NullVoxPopuli/package-majors">
        <img alt="" src="/images/github-logo.png" />
        GitHub
        <Arrow />
      </ExternalLink>
    </div>

    <div>
      <ThemeToggle />
    </div>
  </header>

*/
{
  "id": "YMACeO+O",
  "block": "[[[1,\"\\n  \"],[10,\"header\"],[12],[1,\"\\n    \"],[10,0],[12],[1,\"\\n      \"],[8,[32,0],[[24,0,\"github\"],[24,6,\"https://github.com/NullVoxPopuli/package-majors\"]],null,[[\"default\"],[[[[1,\"\\n        \"],[10,\"img\"],[14,\"alt\",\"\"],[14,\"src\",\"/images/github-logo.png\"],[12],[13],[1,\"\\n        GitHub\\n        \"],[8,[32,1],null,null,null],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"],[13],[1,\"\\n\\n    \"],[10,0],[12],[1,\"\\n      \"],[8,[32,2],null,null,null],[1,\"\\n    \"],[13],[1,\"\\n  \"],[13],[1,\"\\n\"]],[],false,[]]",
  "moduleName": "/home/nvp/Development/NullVoxPopuli/package-majors/node_modules/.embroider/rewritten-app/components/header.ts",
  "scope": () => [ember_primitives__WEBPACK_IMPORTED_MODULE_6__.ExternalLink, _icons_fa_external_link__WEBPACK_IMPORTED_MODULE_1__.Arrow, _universal_ember_preem__WEBPACK_IMPORTED_MODULE_2__.ThemeToggle],
  "isStrictMode": true
}), (0,_ember_component_template_only__WEBPACK_IMPORTED_MODULE_5__["default"])());

//# sourceURL=webpack://package-majors/./components/header.ts?
```

</details>

### with `devtool: 'source-map'`

![setting devtool to 'source-map' shows nearly original source](/images/sourcemaps/to-source-map.png)

<details><summary>The code from the screenshot</summary>

```ts
import { template } from "@ember/template-compiler";
import './header.css';
import { ThemeToggle } from '@universal-ember/preem';
import { ExternalLink } from 'ember-primitives';
import { Arrow } from './icons/fa/external-link';
export const Header = template(`
  <header>
    <div>
      <ExternalLink class="github" href="https://github.com/NullVoxPopuli/package-majors">
        <img alt="" src="/images/github-logo.png" />
        GitHub
        <Arrow />
      </ExternalLink>
    </div>

    <div>
      <ThemeToggle />
    </div>
  </header>
`, {
    eval () {
        return eval(arguments[0]);
    }
});
```

</details>

## Debugging

Using `devtool: 'source-map'` also enables in-browser breakpoints that more closely match the code in the source. With gjs/gts it's not _original_ source, as browsers don't know what gjs/gts is, but it's "pretty close".

### with the defaults

With the default, a bunch of paths end up emitted in the source.

![example with devtool set to the default paused on line 66, showing a bunch of paths exposed in the code](/images/sourcemaps/class-eval.png)

<details><summary>The code from the screenshot</summary>


```ts
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Search: () => (/* binding */ Search)
/* harmony export */ });
/* harmony import */ var _glimmer_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @glimmer/component */ "../rewritten-packages/@glimmer/component.dac0f4a2/node_modules/@glimmer/component/index.js");
/* harmony import */ var _ember_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ember/service */ "../rewritten-packages/ember-source.848c2a54/node_modules/ember-source/@ember/service/index.js");
/* harmony import */ var ember_primitives__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ember-primitives */ "../../.pnpm/ember-primitives@0.10.1_@babel+core@7.23.3_@ember+test-helpers@3.2.1_@glimmer+component@1.1.2_2udfmchmj4htznuxtzf4ynvf4y/node_modules/ember-primitives/dist/components/form.js");
/* harmony import */ var _ember_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ember/helper */ "../rewritten-packages/ember-source.848c2a54/node_modules/ember-source/@ember/helper/index.js");
/* harmony import */ var _name_input__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./name-input */ "./components/name-input.ts");
/* harmony import */ var _show_minors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./show-minors */ "./components/show-minors.ts");
/* harmony import */ var _show_old__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./show-old */ "./components/show-old.ts");
/* harmony import */ var _ember_template_factory__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ember/template-factory */ "../rewritten-packages/ember-source.848c2a54/node_modules/ember-source/@ember/template-factory/index.js");
/* harmony import */ var _ember_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ember/component */ "../rewritten-packages/ember-source.848c2a54/node_modules/ember-source/@ember/component/index.js");
/* harmony import */ var _home_nvp_Development_NullVoxPopuli_package_majors_node_modules_pnpm_decorator_transforms_1_0_1_babel_core_7_23_3_node_modules_decorator_transforms_dist_runtime_cjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../.pnpm/decorator-transforms@1.0.1_@babel+core@7.23.3/node_modules/decorator-transforms/dist/runtime.cjs */ "../../.pnpm/decorator-transforms@1.0.1_@babel+core@7.23.3/node_modules/decorator-transforms/dist/runtime.cjs");
/* harmony import */ var _home_nvp_Development_NullVoxPopuli_package_majors_node_modules_pnpm_decorator_transforms_1_0_1_babel_core_7_23_3_node_modules_decorator_transforms_dist_runtime_cjs__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_home_nvp_Development_NullVoxPopuli_package_majors_node_modules_pnpm_decorator_transforms_1_0_1_babel_core_7_23_3_node_modules_decorator_transforms_dist_runtime_cjs__WEBPACK_IMPORTED_MODULE_8__);










/**
 * This is triggered on every value change,
 * which we don't need for this app.
 * The early return makes it a normal submit,
 * so the <Form> abstraction is basically just doing the
 * `FormData` conversion for us.
 */
function handleSubmit(onChange1, data1, eventType1) {
  if (eventType1 !== 'submit') return;
  onChange1(data1);
}
class Search extends _glimmer_component__WEBPACK_IMPORTED_MODULE_0__["default"] {
  static {
    (0,_ember_component__WEBPACK_IMPORTED_MODULE_7__.setComponentTemplate)((0,_ember_template_factory__WEBPACK_IMPORTED_MODULE_6__.createTemplateFactory)(
    /*
      
        <Form @onChange={{fn handleSubmit this.updateSearch}}>
          <NameInput @value={{this.last.packages}} />
    
          <ShowMinors checked={{this.last.minors}} />
          <ShowOld checked={{this.last.old}} />
        </Form>
      
    */
    {
      "id": "q4ddJ3hO",
      "block": "[[[1,\"\\n    \"],[8,[32,0],null,[[\"@onChange\"],[[28,[32,1],[[32,2],[30,0,[\"updateSearch\"]]],null]]],[[\"default\"],[[[[1,\"\\n      \"],[8,[32,3],null,[[\"@value\"],[[30,0,[\"last\",\"packages\"]]]],null],[1,\"\\n\\n      \"],[8,[32,4],[[16,\"checked\",[30,0,[\"last\",\"minors\"]]]],null,null],[1,\"\\n      \"],[8,[32,5],[[16,\"checked\",[30,0,[\"last\",\"old\"]]]],null,null],[1,\"\\n    \"]],[]]]]],[1,\"\\n  \"]],[],false,[]]",
      "moduleName": "/home/nvp/Development/NullVoxPopuli/package-majors/node_modules/.embroider/rewritten-app/components/search.ts",
      "scope": () => [ember_primitives__WEBPACK_IMPORTED_MODULE_9__.Form, _ember_helper__WEBPACK_IMPORTED_MODULE_2__.fn, handleSubmit, _name_input__WEBPACK_IMPORTED_MODULE_3__.NameInput, _show_minors__WEBPACK_IMPORTED_MODULE_4__.ShowMinors, _show_old__WEBPACK_IMPORTED_MODULE_5__.ShowOld],
      "isStrictMode": true
    }), this);
  }
  static {
    (0,_home_nvp_Development_NullVoxPopuli_package_majors_node_modules_pnpm_decorator_transforms_1_0_1_babel_core_7_23_3_node_modules_decorator_transforms_dist_runtime_cjs__WEBPACK_IMPORTED_MODULE_8__.f)(this, "router", [_ember_service__WEBPACK_IMPORTED_MODULE_1__.service]);
  }
  #router = ((0,_home_nvp_Development_NullVoxPopuli_package_majors_node_modules_pnpm_decorator_transforms_1_0_1_babel_core_7_23_3_node_modules_decorator_transforms_dist_runtime_cjs__WEBPACK_IMPORTED_MODULE_8__.i)(this, "router"), void 0);
  get last() {
    let qps1 = this.router.currentRoute?.queryParams;
    let minors1 = qps1?.['minors'];
    let packages1 = qps1?.['packages'];
    let old1 = qps1?.['old'];
    return {
      packages: packages1 ? `${packages1}` : '',
      minors: minors1 ? `${minors1}` : undefined,
      old: old1 ? `${old1}` : undefined
    };
  }
  updateSearch = data1 => {
    let {
      packageName: packages1,
      showMinors: minors1,
      showOld: old1
    } = data1;
    this.router.transitionTo('query', {
      queryParams: {
        packages: packages1,
        minors: minors1,
        old: old1
      }
    });
  };
}

//# sourceURL=webpack://package-majors/./components/search.ts?
```

</details>

### with `devtool: 'source-map'`

All the TypeScript that was authored is _very_ close to original source, with the main differences being minor line breaks and spacing changes.

![example with devtool set to 'source-map' paused on line 52, showing original source for the getter](/images/sourcemaps/class-source-map.png)

<details><summary>The code from the screenshot</summary>

```ts
import { template } from "@ember/template-compiler";
import Component from '@glimmer/component';
import { fn } from '@ember/helper';
import { service } from '@ember/service';
import { Form } from 'ember-primitives';
import { NameInput } from './name-input';
import { ShowMinors } from './show-minors';
import { ShowOld } from './show-old';
import type RouterService from '@ember/routing/router-service';
import type { DownloadsResponse } from 'package-majors/types';
/**
 * This is triggered on every value change,
 * which we don't need for this app.
 * The early return makes it a normal submit,
 * so the <Form> abstraction is basically just doing the
 * `FormData` conversion for us.
 */ function handleSubmit(onChange1: (data: SearchFormData) => void, data1: unknown, eventType1: string) {
    if (eventType1 !== 'submit') return;
    onChange1(data1 as SearchFormData);
}
interface SearchFormData {
    packageName: string;
    showMinors?: 'on';
    showOld?: 'on';
}
export class Search extends Component<{
    Blocks: {
        default: [data: DownloadsResponse];
    };
}> {
    static{
        template(`
    <Form @onChange={{fn handleSubmit this.updateSearch}}>
      <NameInput @value={{this.last.packages}} />

      <ShowMinors checked={{this.last.minors}} />
      <ShowOld checked={{this.last.old}} />
    </Form>
  `, {
            component: this,
            eval () {
                return eval(arguments[0]);
            }
        });
    }
    @service
    router: RouterService;
    get last() {
        let qps1 = this.router.currentRoute?.queryParams;
        let minors1 = qps1?.['minors'];
        let packages1 = qps1?.['packages'];
        let old1 = qps1?.['old'];
        return {
            packages: packages1 ? `${packages1}` : '',
            minors: minors1 ? `${minors1}` : undefined,
            old: old1 ? `${old1}` : undefined
        };
    }
    updateSearch = (data1: SearchFormData)=>{
        let { packageName: packages1, showMinors: minors1, showOld: old1 } = data1;
        this.router.transitionTo('query', {
            queryParams: {
                packages: packages1,
                minors: minors1,
                old: old1
            }
        });
    };
}
```


</details>
