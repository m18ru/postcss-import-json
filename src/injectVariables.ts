import {AtRule, decl} from 'postcss';
import {PluginOptions} from './index';
import {ParsedParams} from './parseParams';
import {ParsedVariable} from './parseVariable';
import {JsonContent} from './readJson';

/**
 * Inject imported variables to AST.
 * 
 * @param rule Import rule.
 * @param params Import rule parameters.
 * @param content JSON file content.
 * @param options Plugin options.
 */
function injectVariables(
	rule: AtRule,
	{uri, variables}: ParsedParams,
	content: JsonContent,
	options: PluginOptions,
): void
{
	for ( const variable of variables )
	{
		if ( !content.hasOwnProperty( variable.name ) )
		{
			throw new ReferenceError(
				`Can’t find variable "${variable.name}" in "${uri}".`,
			);
		}
		
		injectVariable(
			rule,
			variable,
			content[variable.name],
			options.prefix,
		);
	}
}

/**
 * Inject variable to AST.
 * 
 * @param rule Import rule.
 * @param variable Variable to import.
 * @param value Value of the variable.
 * @param defaultPrefix Default prefix for variable name.
 */
function injectVariable(
	rule: AtRule,
	variable: ParsedVariable,
	value: string | number,
	defaultPrefix: string,
): void
{
	const prefix = (
		( 'prefix' in variable )
		? variable.prefix
		: defaultPrefix
	);
	const name = prefix + variable.asName;
	
	const variableNode = decl( {prop: name, value: String( value )} );
	variableNode.source = rule.source;
	rule.parent.insertBefore( rule, variable );
}

/**
 * Module.
 */
export {
	injectVariables as default,
};
