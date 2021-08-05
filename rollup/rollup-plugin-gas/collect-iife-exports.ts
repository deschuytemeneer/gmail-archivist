import { visit } from 'recast';

import {
  IIFEExpressionStatement,
  GlobalThisExportStatement,
  isStringVariableDeclarator,
  isGlobalThisExportStatement,
} from './typechecks';

export interface CollectExportsOptions {
  /**
   * Whether any exports that are duplicated should be reported as an Error.
   */
  throwOnDuplicates?: boolean;

  /**
   * Whether any exports of which the property is computed but of which the variable is undeclared
   * should be reported as an Error.
   */
  throwOnUndeclaredComputedProperties?: boolean;
}

/**
 * Given an IIFEExpressionStatement, collects any statement inside the block that is a 'globalThis
 * export' into a map where the keys are the name of the exported property, and the value is the
 * whole GlobalThisExportStatement representing the exported property.
 */
export default function collectExports(
  iife: IIFEExpressionStatement,
  options: CollectExportsOptions = {}
): Map<string, GlobalThisExportStatement> {
  const { throwOnDuplicates: reportDuplicates = true, throwOnUndeclaredComputedProperties: reportUndeclaredComputedProperties = false } = options;

  const computedFunctionNames = new Map<string, string>();
  const exported = new Map<string, GlobalThisExportStatement>();

  visit(iife.expression.callee.body, {
    // We ran into a variable declaration, record the names of any declarators that declare a
    // string literal, because it may be used as the computed property name of a globalThis export
    // later.
    visitVariableDeclarator(path) {
      if (isStringVariableDeclarator(path.node)) {
        const { id, init } = path.node;
        computedFunctionNames.set(id.name, init.value);
      }

      this.traverse(path);
    },

    visitExpressionStatement(path) {
      if (isGlobalThisExportStatement(path.node)) {
        // We ran into a globalThis export, resolve the exported name first.
        const { property, computed: isComputed = false } = path.node.expression.left;
        let exportedName = property.name;

        // Look up any computed property names in the map we were collecting so far, if the export
        // name is a computed property.
        if (isComputed) {
          if (reportUndeclaredComputedProperties && !computedFunctionNames.has(exportedName)) {
            throw new Error(`Undeclared variable: ${exportedName}`);
          } else {
            exportedName = computedFunctionNames.get(exportedName);
          }
        }

        if (reportDuplicates && exported.has(exportedName)) {
          throw new Error(`Duplicate globalThis export: ${exportedName}`);
        } else {
          exported.set(exportedName, path.node);
        }
      }

      this.traverse(path);
    },
  });

  return exported;
}
