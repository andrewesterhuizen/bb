// @ts-check

export const VariableType = {
  u8: "u8",
};

export const ExpressionKind = {
  STRING_LITERAL: "STRING_LITERAL",
  INT_LITERAL: "INT_LITERAL",
  IDENTIFIER: "IDENTIFIER",
  CALL: "CALL",
  MEMBER: "MEMBER",
  BINARY: "BINARY",
};

export class Expression {
  /**
   * @param {string} [kind]
   */
  constructor(kind) {
    /** @type {string} */
    this.kind = kind;
  }
}

export class IntegerLiteralExpression extends Expression {
  /**
   * @param {number} [value]
   */
  constructor(value) {
    super(ExpressionKind.INT_LITERAL);
    /** @type {number} */
    this.value = value;
  }
}

export class StringLiteralExpression extends Expression {
  /**
   * @param {string} [value]
   */
  constructor(value) {
    super(ExpressionKind.STRING_LITERAL);
    /** @type {string} */
    this.value = value;
  }
}

export class IdentifierExpression extends Expression {
  /**
   * @param {string} [value]
   */
  constructor(value) {
    super(ExpressionKind.IDENTIFIER);
    /** @type {string} */
    this.value = value;
  }
}

export class CallExpression extends Expression {
  /**
   * @param {Expression} [callee]
   * @param {Expression[]} [args]
   */
  constructor(callee, args) {
    super(ExpressionKind.CALL);
    /** @type {Expression} */
    this.callee = callee;
    /** @type {Expression[]} */
    this.args = args;
  }
}

export class BinaryExpression extends Expression {
  /**
   * @param {Expression} [left]
   * @param {Expression} [right]
   * @param {string} [operator]
   */
  constructor(left, right, operator) {
    super(ExpressionKind.BINARY);
    /** @type {Expression} */
    this.left = left;
    /** @type {Expression} */
    this.right = right;
    /** @type {string} */
    this.operator = operator;
  }
}

export const StatementKind = {
  EXPRESSION: "EXPRESSION",
  RETURN: "RETURN",
  BLOCK: "BLOCK",
  FUNCTION_DECLARATION: "FUNCTION_DECLARATION",
  VARIABLE_DECLARATION: "VARIABLE_DECLARATION",
};

export class Statement {
  /**
   * @param {string} [kind]
   */
  constructor(kind) {
    /** @type {string} */
    this.kind = kind;
  }
}

export class ExpressionStatement extends Statement {
  /**
   * @param {Expression} [value]
   */
  constructor(value) {
    super(StatementKind.EXPRESSION);
    /** @type {Expression} */
    this.value = value;
  }
}

export class ReturnStatement extends Statement {
  /**
   * @param {Expression} [value]
   */
  constructor(value) {
    super(StatementKind.RETURN);
    /** @type {Expression} */
    this.value = value;
  }
}

export class BlockStatement extends Statement {
  /**
   * @param {Statement[]} [body]
   */
  constructor(body) {
    super(StatementKind.BLOCK);
    /** @type {Statement[]} */
    this.body = body;
  }
}

export class FunctionDeclarationStatement extends Statement {
  /**
   * @param {string} [identifier]
   * @param {string} [returnType]
   * @param {Statement} [body]
   */
  constructor(identifier, returnType, body) {
    super(StatementKind.FUNCTION_DECLARATION);
    /** @type {string} */
    this.identifier = identifier;
    /** @type {string} */
    this.returnType = returnType;
    /** @type {Statement} */
    this.body = body;
  }
}

export class VariableDeclarationStatement extends Statement {
  /**
   * @param {string} [identifier]
   * @param {keyof VariableType} [type]
   * @param {Expression} [value]
   */
  constructor(identifier, type, value) {
    super(StatementKind.VARIABLE_DECLARATION);
    /** @type {string} */
    this.identifier = identifier;
    /** @type {keyof VariableType} */
    this.type = type;
    /** @type {Expression} */
    this.value = value;
  }
}

export class Program {
  /**
   * @param {Statement[]} [body]
   */
  constructor(body) {
    /** @type {Statement[]} */
    this.body = body;
  }
}
