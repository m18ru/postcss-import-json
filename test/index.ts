import {expect} from 'chai';
import {readFileSync} from 'fs';
import 'mocha';
import {resolve} from 'path';
import * as postcss from 'postcss';
import importJson, {
	PluginOptions,
} from '../src/index';

describe(
	'Import JSON',
	() =>
	{
		it(
			'should inject on top level',
			() => check( 'simple' ),
		);
		
		it(
			'should inject on nested level',
			() => check( 'nested' ),
		);
		
		it(
			'should use prefix from options',
			() => check( 'global-prefix', {prefix: '--'} ),
		);
		
		it(
			'should use prefix individual variable prefix',
			() => check( 'variable-prefix' ),
		);
		
		it(
			'should allow variable renaming',
			() => check( 'rename' ),
		);
		
		it(
			'should allow variable renaming and prefixing at the same time',
			() => check( 'rename-and-prefix' ),
		);
		
		it(
			'should allow custom resolve function',
			() => check(
				'custom-resolve',
				{
					resolve: ( path ) => (
						/^~\//.test( path )
						? resolve( __dirname, path.substr( 2 ) )
						: path
					),
				},
			),
		);
	},
);

/**
 * Check PostCSS result with specific options.
 * 
 * @param options Plugin options.
 * @param input Input CSS.
 * @param output Expected output CSS.
 */
function check(
	name: string,
	options: Partial<PluginOptions> = {},
): Promise<void>
{
	const sourceName = resolve( __dirname, `fixtures/${name}.pcss` );
	const expectedName = resolve( __dirname, `fixtures/${name}.expected.pcss` );
	
	return postcss( [importJson( options )] )
		.process(
			readFileSync( sourceName, 'utf8' ),
			{from: sourceName},
		)
		.then(
			( result ) =>
			{
				expect(
					result.css,
				).to.equal(
					readFileSync( expectedName, 'utf8' ),
				);
			},
		);
}
