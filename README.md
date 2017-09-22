[![NPM][npm]][npm-url]
[![Dependencies][deps]][deps-url]
[![DevDependencies][deps-dev]][deps-dev-url]
[![Tests][build]][build-url]

# postcss-import-json

[PostCSS] plugin to import variables from JSON file.

To import variables you should specify names to get from JSON. This allows you
to better control the origin of variables.

In import rule variable can be renamed with `as NEW_NAME` syntax. You can also
specify individual variable prefix, instead of global, using `prefix PREFIX`.
Both directives are optional.

## Syntax

```
@import-json <string> (<variable-declaration>#);

where
<variable-declaration> = <json-name> [ as <css-name> ] [ prefix <css-prefix> ]

where
<json-name>, <css-name>, <css-prefix> is identifiers and should not be a string.
```

## Example

```css
div
{
	@import-json "./imports/colors.json" (fg as text prefix --, bg);
}
```

Output:

```css
div
{
	--text: black;
	$bg: white;
}
```

You can find more examples in [tests](test/).

## Install

```
npm install --save-dev postcss-import-json
```

## Usage

It’s asynchronous plugin, so use should youse promises or async/await.

Source file path is required to resolve relative paths. If this path is not
specified, `root` option is used (`process.cwd()` by default).

In this example used custom resolver to process paths, started from `~/`, as
relative to `__dirname`.

```js
const postcss = require( 'postcss' );
const importJson = require( 'postcss-import-json' ).default;

const css = '@import-json "~/fixtures/imports/colors.json" (fg, bg);';
const options = {
	resolve: ( path ) => (
		/^~\//.test( path )
		? resolve( __dirname, path.substr( 2 ) )
		: path
	),
};

postcss( [globalVars( options )] )
	.process(
		css,
		{from: '/tmp/test.css'},
	)
	.then(
		( result ) =>
		{
			console.log( result.css ); // => '$fg: black;\n$bg: white;'
		},
	);
```

## Options

### `prefix`

Type: `string`  
Default: `'$'`

Default variable prefix. Used when variable has no individual prefix.

### `root`

Type: `string`
Default: `process.cwd()`

The root directory where to resolve path. Used to resolve relative paths when
path of source file is not specified.

### `resolve`

Type: `( uri: string, basedir: string, options: PluginOptions ): string | Promise<string>`
Default: `undefined`

Custom path resolver. Relative path can be returned to continue processing with
default resolver.

Function arguments:

* `uri` — URI from import rule (original path).
* `basedir` — Base directory for current import.
* `options` — Plugin options.

## Change Log

[View changelog](CHANGELOG.md).

## License

[MIT](LICENSE).

[npm]: https://img.shields.io/npm/v/postcss-import-json.svg
[npm-url]: https://npmjs.com/package/postcss-import-json

[deps]: https://img.shields.io/david/m18ru/postcss-import-json.svg
[deps-url]: https://david-dm.org/m18ru/postcss-import-json

[deps-dev]: https://img.shields.io/david/dev/m18ru/postcss-import-json.svg
[deps-dev-url]: https://david-dm.org/m18ru/postcss-import-json?type=dev

[build]: https://img.shields.io/travis/m18ru/postcss-import-json.svg
[build-url]: https://travis-ci.org/m18ru/postcss-import-json

[PostCSS]: https://github.com/postcss/postcss
