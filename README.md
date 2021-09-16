# figma-utils
Various utilities for working with figma, for exporting icons, styles, etc.
## Figma Project for examples

https://www.figma.com/file/3SigPKK9cQhANSRQOOgQgO/

## figma token and cli
You need to write figma token in environmental vars. Put the value in `.env` file 
(use `.env.example` for example)

## Load Minified Schema from Figma

### Loading from code:

`
loadMinifiedSchema(config, figmaToken);
`

### loading from cli

`
yarn cli schema --config '{"figmaProjectID":"3SigPKK9cQhANSRQOOgQgO", "page":"Colored Icons", "frameName":"Common"}'
`
## Loading image from Figma

if you need cache files for loading use CACHE_DIR var in `.env` file.
### loading from code

`loadImage(config, figmaToken)`

### loading from cli
`
yarn cli load-image --src-config '{"figmaProjectID":"3SigPKK9cQhANSRQOOgQgO", "frameID":"1:153"}' --dst 3.svg
`