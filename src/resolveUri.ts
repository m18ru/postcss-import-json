import {resolve} from 'path';
import {PluginOptions} from './index';

/**
 * Path resolver.
 * 
 * @param uri URI from import rule.
 * @param basedir Base directory for current import.
 * @param options Import options.
 */
function resolveUri(
	uri: string, basedir: string, options: PluginOptions,
): Promise<string>
{
	return Promise.resolve(
		resolve(
			basedir,
			(
				options.resolve
				? options.resolve( uri, basedir, options )
				: uri
			),
		),
	);
}

/**
 * Module.
 */
export {
	resolveUri as default,
};
