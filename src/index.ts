import {resolve} from 'path';
import {AtRule, plugin, Plugin, Root, Transformer} from 'postcss';
import getCssBaseDir from './getCssBaseDir';
import injectVariables from './injectVariables';
import parseParams, {ParsedParams} from './parseParams';
import readJson, {JsonContent} from './readJson';
import resolveUri from './resolveUri';

/**
 * Name of this plugin.
 */
const PLUGIN_NAME = 'postcss-import-json';
/**
 * Name of the plugin At-Rule.
 */
const RULE_NAME = 'import-json';

/**
 * Default plugin options.
 */
const DEFAULT_OPTIONS: Readonly<PluginOptions> = {
	prefix: '$',
	root: process.cwd(),
};

/**
 * Plugin options.
 */
export interface PluginOptions
{
	/**
	 * Default variable prefix.
	 */
	prefix: string;
	/**
	 * The root directory where to resolve path.
	 */
	root: string;
	/**
	 * Custom path resolver.
	 * 
	 * @param uri URI from import rule.
	 * @param basedir Base directory for current import.
	 * @param options Import options.
	 */
	resolve?( uri: string, basedir: string, options: PluginOptions ):
		string | Promise<string>;
}

/**
 * PostCSS plugin to import variables from JSON file.
 * 
 * @param userOptions Plugin options.
 */
function main( userOptions: Partial<PluginOptions> ): Transformer
{
	const options: PluginOptions = {...DEFAULT_OPTIONS, ...userOptions};
	
	options.root = resolve( options.root );
	
	const resultPromises: Array<Promise<void>> = [];
	
	const onAtRule = ( rule: AtRule ): void =>
	{
		let params: ParsedParams;
		
		try
		{
			params = parseParams( rule.params );
		}
		catch ( error )
		{
			throw rule.error( error.message, {plugin: PLUGIN_NAME} );
		}
		
		const onError = ( error: Error ) =>
		{
			throw rule.error( error.message, {plugin: PLUGIN_NAME} );
		};
		
		const onContent = ( content: JsonContent ): void =>
		{
			injectVariables(
				rule,
				params,
				content,
				options,
			);
			rule.remove();
		};
		
		const promise = resolveUri(
			params.uri,
			getCssBaseDir( rule ) || options.root,
			options,
		)
			.then( readJson )
			.then( onContent )
			.catch( onError );
		
		resultPromises.push( promise );
	};
	
	return ( root: Root ): Promise<void[]> =>
	{
		root.walkAtRules( RULE_NAME, onAtRule );
		
		return Promise.all( resultPromises );
	};
}

/**
 * PostCSS plugin.
 */
const postImportJsonPlugin: Plugin<Partial<PluginOptions>> = plugin(
	PLUGIN_NAME,
	main,
);

/**
 * Module.
 */
export {
	postImportJsonPlugin as default,
};
