# website

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Installation

* `git clone <repository-url>` this repository
* `cd website`
* `pnpm install`
* `cd node_modules/sharp && pnpm run install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `pnpm lint:hbs`
* `pnpm lint:js`
* `pnpm lint:js --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)


## Image Hacks

Rotate image the correct way (some programs just add metadat instead of actually modifying the image)
```bash
file=emberconf-stage.jpg
exiftool -Orientation= $file
convert $file -rotate 180 $file
```
