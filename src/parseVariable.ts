/**
 * Pattern for parsing variable import.
 */
const VARIABLE_PATTERN = /^([\w-]+)(?:\s+as\s+([\w-]+))?(?:\s+prefix\s+([\w-]+))?$/;

/**
 * Variable to import.
 */
export interface ParsedVariable
{
	/** Name of the variable in JSON */
	name: string;
	/** Name of the variable in CSS */
	asName: string;
	/** Prefix for name in CSS */
	prefix?: string;
}

/**
 * Parse variable import string.
 * 
 * @param value Parsed string.
 */
function parseVariable( value: string ): ParsedVariable
{
	const matches = VARIABLE_PATTERN.exec( value );
	
	if ( !matches )
	{
		throw new SyntaxError( `Incorrect variable import "${value}".` );
	}
	
	const variable: ParsedVariable = {
		name: matches[1],
		asName: ( matches[2] || matches[1] ),
	};
	
	if ( matches[3] )
	{
		variable.prefix = matches[3];
	}
	
	return variable;
}

/**
 * Module.
 */
export {
	parseVariable as default,
};
