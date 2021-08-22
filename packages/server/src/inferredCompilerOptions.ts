import type * as ts from 'typescript/lib/tsserverlibrary';
import type * as vscode from 'vscode-languageserver/node';

export async function getInferredCompilerOptions(
	ts: typeof import('typescript/lib/tsserverlibrary'),
	connection: vscode.Connection,
) {

	let [implicitProjectConfig_1, implicitProjectConfig_2] = (await connection.workspace.getConfiguration([
		{ section: 'js/ts.implicitProjectConfig' },
		{ section: 'javascript.implicitProjectConfig' },
	]));

	implicitProjectConfig_1 = implicitProjectConfig_1 ?? {};
	implicitProjectConfig_2 = implicitProjectConfig_2 ?? {};

	const checkJs = readCheckJs();
	const experimentalDecorators = readExperimentalDecorators();
	const strictNullChecks = readImplicitStrictNullChecks();
	const strictFunctionTypes = readImplicitStrictFunctionTypes();

	const options: ts.CompilerOptions = {
		...inferredProjectCompilerOptions('typescript'),
		allowJs: true,
		allowSyntheticDefaultImports: true,
		allowNonTsExtensions: true,
		resolveJsonModule: true,
	};

	return options;

	function readCheckJs(): boolean {
		return implicitProjectConfig_1['checkJs']
			?? implicitProjectConfig_2['checkJs']
			?? false;
	}

	function readExperimentalDecorators(): boolean {
		return implicitProjectConfig_1['experimentalDecorators']
			?? implicitProjectConfig_2['experimentalDecorators']
			?? false;
	}

	function readImplicitStrictNullChecks(): boolean {
		return implicitProjectConfig_1['strictNullChecks'] ?? false;
	}

	function readImplicitStrictFunctionTypes(): boolean {
		return implicitProjectConfig_1['strictFunctionTypes'] ?? true;
	}

	function inferredProjectCompilerOptions(projectType: 'typescript' | 'javascript'): ts.CompilerOptions {
		const projectConfig: ts.CompilerOptions = {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2020,
			jsx: ts.JsxEmit.Preserve,
		};

		if (checkJs) {
			projectConfig.checkJs = true;
			if (projectType === 'typescript') {
				projectConfig.allowJs = true;
			}
		}

		if (experimentalDecorators) {
			projectConfig.experimentalDecorators = true;
		}

		if (strictNullChecks) {
			projectConfig.strictNullChecks = true;
		}

		if (strictFunctionTypes) {
			projectConfig.strictFunctionTypes = true;
		}

		if (projectType === 'typescript') {
			projectConfig.sourceMap = true;
		}

		return projectConfig;
	}
}
