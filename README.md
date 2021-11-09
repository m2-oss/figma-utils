# figma-utils
Various utilities for working with figma, for exporting icons, styles, etc.
## Figma Project for examples

https://www.figma.com/file/3SigPKK9cQhANSRQOOgQgO/

## figma token and cli
You need to write figma token in environmental vars. Put the value in `.env` file 
(use `.env.example` for example)

## Load Minified LoadSchema from Figma

This function load the simplified model from Figma Project. It find pa

### Loading from code:

`
loadMinifiedSchema(config, figmaToken);
`

### loading from cli

`
yarn cli load-schema --config '{"figmaProjectID":"3SigPKK9cQhANSRQOOgQgO", "page":"Colored Icons", "frameName":"Common"}'
`

`
yarn cli load-schema --config './cli/configs/load-schema.json'
`
## Loading image from Figma

if you need cache files for loading use CACHE_DIR var in `.env` file.
### loading from code

`loadImage(config, figmaToken)`

### loading from cli
`
yarn cli load-image --config '{"figmaProjectID":"3SigPKK9cQhANSRQOOgQgO", "frameID":"1:153"}' "3.svg"
`

`
yarn cli load-image --config './cli/configs/load-image.json' "3.svg"
`

## Sync Image Package with Figma

### loading from code

`syncImagePack(config, process.env.X_FIGMA_TOKEN, this.targetDir);`

### loading from cli

`
yarn cli sync-image-pack --config './cli/configs/image-pack.json' --target-dir './target-dir'
`
