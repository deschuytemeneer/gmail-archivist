import { types } from 'recast';

export type AST = types.namedTypes.File;

type ExpressionStatement = types.namedTypes.ExpressionStatement;
type ArrowFunctionExpression = types.namedTypes.ArrowFunctionExpression;
type FunctionExpression = types.namedTypes.FunctionExpression;
type CallExpression = types.namedTypes.CallExpression;
type AssignmentExpression = types.namedTypes.AssignmentExpression;
type MemberExpression = types.namedTypes.MemberExpression;
type VariableDeclarator = types.namedTypes.VariableDeclarator;
type Identifier = types.namedTypes.Identifier;
type Literal = types.namedTypes.Literal;

export type VariableDeclarationKind = 'var' | 'let' | 'const';

export type GlobalThisExportStatement = ExpressionStatement & {
  expression: AssignmentExpression & {
    left: GlobalThisMemberExpression;
    right: ArrowFunctionExpression;
  };
};

const namedTypes = types.namedTypes;

/**
 * Checks whether the given statement is an IIFE.
 */
export function isIIFE(statement: unknown): statement is IIFEExpressionStatement {
  return (
    namedTypes.ExpressionStatement.check(statement) &&
    namedTypes.CallExpression.check(statement.expression) &&
    namedTypes.FunctionExpression.check(statement.expression.callee)
  );
}

export type StringVariableDeclarator = VariableDeclarator & {
  id: Identifier;
  init: Literal & {
    value: string;
  };
};

/**
 * Checks whether the given VariableDeclarator declares a string literal.
 */
export function isStringVariableDeclarator(
  declarator: unknown
): declarator is StringVariableDeclarator {
  return (
    namedTypes.VariableDeclarator.check(declarator) &&
    namedTypes.Identifier.check(declarator.id) &&
    namedTypes.Literal.check(declarator.init) &&
    typeof declarator.init.value === 'string'
  );
}

export type GlobalThisMemberExpression = MemberExpression & {
  object: Identifier & {
    name: 'globalThis';
  };
  property: Identifier;
};

/**
 * Checks whether the given expression is a member expression on the 'globalThis' object.
 */
export function isGlobalThisMemberExpression(
  expression: unknown
): expression is GlobalThisMemberExpression {
  return (
    namedTypes.MemberExpression.check(expression) &&
    namedTypes.Identifier.check(expression.object) &&
    namedTypes.Identifier.check(expression.property) &&
    expression.object.name === 'globalThis'
  );
}

export type IIFEExpressionStatement = ExpressionStatement & {
  expression: CallExpression & {
    callee: FunctionExpression;
  };
};

/**
 * Checks whether the given statement is of the form
 * `globalThis.<name> = <arrow function expression or function expression>`
 */
export function isGlobalThisExportStatement(
  statement: unknown
): statement is GlobalThisExportStatement {
  return (
    namedTypes.ExpressionStatement.check(statement) &&
    namedTypes.AssignmentExpression.check(statement.expression) &&
    isGlobalThisMemberExpression(statement.expression.left) &&
    (namedTypes.ArrowFunctionExpression.check(statement.expression.right) ||
      namedTypes.FunctionExpression.check(statement.expression.right))
  );
}
