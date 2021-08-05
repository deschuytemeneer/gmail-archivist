import * as recast from 'recast';
import {
  AST,
  isIIFE,
  isStringVariableDeclarator,
  isGlobalThisExportStatement,
  VariableDeclarationKind,
} from './typechecks';

function visit(code: string, methods: recast.types.Visitor) {
  const body = (recast.parse(code) as AST).program;
  recast.visit(body, methods);
}

describe('utils', () => {
  it('`isIIFE` correctly determines if a statement is an IIFE', () => {
    const iifeStatement = '(function () {})();';
    const regularFunctionStatement = 'function fn() {}';

    const iifes = [];
    visit([iifeStatement, regularFunctionStatement].join('\n'), {
      visitExpressionStatement(path) {
        if (isIIFE(path.node)) {
          iifes.push(recast.print(path.node).code);
        }
        this.traverse(path);
      },
    });

    expect(iifes).toHaveLength(1);
    expect(iifes[0]).toMatch(iifeStatement);
  });

  it('`isStringVariableDeclarator` correctly determines if a variable declarator declares a string literal', () => {
    const createVar = (name: string, kind: VariableDeclarationKind, val = '""') =>
      `${kind} ${name} = ${val}`;

    const program = [
      createVar('stringVar', 'var'),
      createVar('stringConst', 'const'),
      createVar('stringLet', 'let'),
      createVar('objectLiteralVar', 'var', '{}'),
    ].join('\n');

    const declaratorNames = [];
    visit(program, {
      visitVariableDeclarator(path) {
        if (isStringVariableDeclarator(path.node)) {
          declaratorNames.push(path.node.id.name);
        }
        this.traverse(path);
      },
    });

    expect(declaratorNames).toHaveLength(3);
    expect(declaratorNames[0]).toMatch('stringVar');
    expect(declaratorNames[1]).toMatch('stringConst');
    expect(declaratorNames[2]).toMatch('stringLet');
  });

  it('`isGlobalThisExportStatement` correctly determines if a statement is of the form "globalThis.<property> = <function>"', () => {
    const arrowFunction = 'globalThis.arrowFunction = () => {}';
    const computed = 'globalThis[COMPUTED] = () => {}';
    const regularFunction = 'globalThis.regularFunction = function() {}';

    const program = [arrowFunction, computed, regularFunction].join('\n');

    const globalExports: { isComputed: boolean, name: string }[] = [];
    visit(program, {
      visitExpressionStatement(path) {
        if (isGlobalThisExportStatement(path.node)) {
          const { property, computed: isComputed = false } = path.node.expression.left;
          globalExports.push({ isComputed, name: property.name });
        }
        this.traverse(path);
      },
    });

    expect(globalExports).toHaveLength(3);
    expect(globalExports[0].name).toMatch('arrowFunction');
    expect(globalExports[0].isComputed).toBeFalsy();
    expect(globalExports[1].name).toMatch('COMPUTED');
    expect(globalExports[1].isComputed).toBeTruthy();
    expect(globalExports[2].name).toMatch('regularFunction');
    expect(globalExports[2].isComputed).toBeFalsy();
  });
});
