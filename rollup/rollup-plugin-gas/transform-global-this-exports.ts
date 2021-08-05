import { parse, print, types } from 'recast';

import { AST, VariableDeclarationKind, isIIFE } from './typechecks';
import collectExports, { CollectExportsOptions } from './collect-iife-exports';

const build = types.builders;

export interface TransformGlobalThisOptions extends CollectExportsOptions {
  /**
   * The identifier to use for the object to collect all globals in.
   */
  globalsVarIdentifier: string;
}

/**
 * Creates a variable declaration of an object literal with the given name.
 *
 * @example
 * // createObjectLiteralVar('globalVariables')
 * var globalVariables = {};
 */
function createObjectLiteralVar(identifier: string, kind: VariableDeclarationKind = 'var') {
  return build.variableDeclaration(kind, [
    build.variableDeclarator(build.identifier(identifier), build.objectExpression([])),
  ]);
}

/**
 * Creates a function declaration with name `identifier` that passes any arguments on to a function
 * with the same name 'exported' in the object with identifier `globalsVarIdentifier`.
 *
 * @example
 * // createGlobalExport('onHomepage', 'globals')
 * function onHomepage() {
 *   globals['onHomepage'].call(null, arguments);
 * }
 */
function createGlobalExport(identifier: string, globalsVarIdentifier: string) {
  // `return <globalsVarIdentifier>['<identifier>'].call(null, arguments);`
  const invokeGlobalExportFnStatement = build.returnStatement(
    build.callExpression(
      // <globalsVarIdentifier>[<identifier>].call
      build.memberExpression(
        build.memberExpression(build.identifier(globalsVarIdentifier), build.literal(identifier)),
        build.identifier('call')
      ),
      [build.nullLiteral(), build.identifier('arguments')]
    )
  );

  // `function <identifier>() { <invokeGlobalExportFnStatement> }`
  return build.functionDeclaration(
    build.identifier(identifier),
    [],
    build.blockStatement([invokeGlobalExportFnStatement])
  );
}

/**
 * Performs the modifications on the given AST.
 */
function modify(
  ast: AST,
  { globalsVarIdentifier, ...collectExportOptions }: TransformGlobalThisOptions
): AST {
  // Add a global 'scope map' as first line in the program.
  ast.program.body.unshift(createObjectLiteralVar(globalsVarIdentifier));

  // For each IIFE in the program, modify that IIFE, identify any 'globalThis exports' and collect
  // them in an array.
  const globalExports = [];
  for (const globalStatement of ast.program.body) {
    if (isIIFE(globalStatement)) {
      globalStatement.expression.arguments.push(build.identifier(globalsVarIdentifier));
      globalStatement.expression.callee.params.push(build.identifier('globalThis'));

      globalExports.push(...collectExports(globalStatement, collectExportOptions).keys());
    }
  }

  // Add a global function for each of the IIFE 'exports' that delegates to the function added to
  // the global scope map.
  for (const globalExport of globalExports) {
    ast.program.body.push(createGlobalExport(globalExport, globalsVarIdentifier));
  }

  return ast;
}

/**
 * Gets a complete options object with the given overrides.
 */
function getDefaultOptions(
  overrides: Partial<TransformGlobalThisOptions> = {}
): TransformGlobalThisOptions {
  return {
    globalsVarIdentifier: 'globals',
    throwOnDuplicates: true,
    throwOnUndeclaredComputedProperties: true,
    ...overrides,
  };
}

/**
 * Transforms the given source code so that any 'globalThis export' in any IIFE is added to a global
 * object with the name 'globals', and a function declaration is added that delegates to this
 * globalThis property.
 *
 * @example
 * (function () {
 *   globalThis.test = () => {};
 * }());
 *
 * // gets transformed to ...
 *
 * var globals = {};
 * ((function (globalThis) {
 *    globalThis.test = () => {};
 * })(globals));
 * function test() {
 *    globals["test"].call(null, arguments);
 * }
 */
export default function transformGlobalThisExports(
  source: string,
  options: Partial<TransformGlobalThisOptions> = {}
): string {
  return print(modify(parse(source), getDefaultOptions(options))).code;
}
