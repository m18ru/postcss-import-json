import {resolve} from 'path';
import {readFile, stat, Stats} from 'ts-fs';

/**
 * Content of JSON file.
 */
export interface JsonContent
{
	[key: string]: string | number;
}

/**
 * Item in files cache.
 */
interface CacheItem
{
	mtime: Date;
	content: JsonContent;
}

/**
 * Cached file contents.
 */
const cache = new Map<string, CacheItem>();

/**
 * Read content from JSON file.
 * 
 * @param path Path to JSON file.
 */
function readJson( path: string ): Promise<JsonContent>
{
	const absolutePath = resolve( path );
	
	const onStat = ( stats: Stats ) =>
	{
		const item = cache.get( absolutePath );
		
		if (
			item
			&& ( item.mtime.getTime() === stats.mtime.getTime() )
		)
		{
			return item.content;
		}
		
		return readFile( absolutePath, 'utf8' )
			.then( ( value ) => onFile( stats, value ) );
	};
	
	const onFile = ( {mtime}: Stats, value: string ) =>
	{
		const content: JsonContent = JSON.parse( value );
		
		for ( const key of Object.keys( content ) )
		{
			const item = content[key];
			
			if (
				( typeof item !== 'string' )
				&& ( typeof item !== 'number' )
			)
			{
				throw new TypeError(
					`Incorrect variable type "${key}: ${typeof item}" in "${absolutePath}".`,
				);
			}
		}
		
		cache.set( absolutePath, {mtime, content} );
		
		return content;
	};
	
	const onError = ( error: Error ) =>
	{
		cache.delete( absolutePath );
		throw error;
	};
	
	return stat( absolutePath )
		.then( onStat )
		.catch( onError );
}

/**
 * Module.
 */
export {
	readJson as default,
};
