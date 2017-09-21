import parseVariable, {ParsedVariable} from './parseVariable';

/**
 * Pattern for parsing rule parameters.
 */
const PARAMS_PATTERN = /^\s*('[^\\']*(?:\\.[^\\']*)*'|"[^\\"]*(?:\\.[^\\"]*)*")\s+\(([^)]+)\)\s*$/;

/**
 * Rule parameters.
 */
export interface ParsedParams
{
	/** Path to JSON file. */
	uri: string;
	/** Variables to import from JSON file. */
	variables: ParsedVariable[];
}

/**
 * Parse rule parameters.
 * 
 * @param params Parameters string.
 */
function parseParams( params: string ): ParsedParams
{
	const matches = PARAMS_PATTERN.exec( params );
	
	if ( !matches )
	{
		throw new SyntaxError( `Incorrect parameters "${params}".` );
	}
	
	const uri = matches[1].slice( 1, -1 ).replace( /\\(['"])/, '$1' );
	
	if ( !uri )
	{
		throw new URIError( 'Empty import path.' );
	}
	
	const variables = matches[2].trim().split( /\s*,\s*/ ).map( parseVariable );
	
	if ( variables.length === 0 )
	{
		throw new SyntaxError( 'Rule has no variables to import.' );
	}
	
	return {
		uri,
		variables,
	};
}

/**
 * Module.
 */
export {
	parseParams as default,
};
