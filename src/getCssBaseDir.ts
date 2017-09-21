import {dirname} from 'path';
import {NodeBase} from 'postcss';

/**
 * Get base directory of the current CSS file.
 * 
 * @param node Current PostCSS AST node.
 */
function getCssBaseDir( node: NodeBase ): string
{
	if ( node.source && node.source.input && node.source.input.file )
	{
		return dirname( node.source.input.file );
	}
	
	return '';
}

/**
 * Module.
 */
export {
	getCssBaseDir as default,
};
