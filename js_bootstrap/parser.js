// @ts-check

import { TokenKind, Token, Lexer } from "./lexer.js";
import {
  Program,
  Statement,
  FunctionDeclarationStatement,
  VariableDeclarationStatement,
  ExpressionStatement,
  ReturnStatement,
  BlockStatement,
  Expression,
  IntegerLiteralExpression,
  StringLiteralExpression,
  IdentifierExpression,
  BinaryExpression,
  CallExpression,
  StatementKind,
  ExpressionKind,
  VariableType,
} from "./ast.js";

const TODO = () => {
  throw new Error("not yet implemented");
};

export class Parser {
  /** @type {Token[]} */
  tokens = [];
  index = 0;

  backup() {
    this.index--;
  }

  /**
   * @returns {Token}
   */
  currentToken() {
    if (this.index >= this.tokens.length) {
      return { kind: TokenKind.END_OF_FILE, value: "" };
    }

    return this.tokens[this.index];
  }

  /**
   * @returns {Token}
   */
  nextToken() {
    this.index++;

    if (this.index >= this.tokens.length) {
      return { kind: TokenKind.END_OF_FILE, value: "" };
    }

    return this.tokens[this.index];
  }

  /**
   * @returns {Token}
   */
  peekNextToken() {
    if (this.index + 1 >= this.tokens.length) {
      return { kind: TokenKind.END_OF_FILE, value: "" };
    }

    return this.tokens[this.index + 1];
  }

  /**
   * @param {string} [kind]
   * @returns {Token | undefined}
   */
  expect(kind) {
    const t = this.nextToken();

    if (t.kind === kind) {
      return t;
    }

    throw `Unexpected Token: expected ${kind}, got ${JSON.stringify(t)}`;
  }

  /**
   * @param {Expression} [callee]
   * @returns {Expression}
   */
  parseCallExpression(callee) {
    console.log("\nparseCallExpression");

    this.expect(TokenKind.LEFT_PAREN);

    let next = this.nextToken();
    console.log("next", next);

    /** @type {Expression[]} */
    let args = [];

    while (next.kind !== TokenKind.RIGHT_PAREN) {
      console.log("loooop");

      args.push(this.parseExpression());
      console.log("args2", args);

      const x = this.peekNextToken();
      console.log("X", x);

      if (x.kind === TokenKind.COMMA) {
        this.nextToken();
      }

      next = this.nextToken();
    }

    console.log("args", args);

    this.nextToken();
    return new CallExpression(callee, args);
  }

  /**
   * @returns {Expression}
   */
  parseExpression() {
    let t = this.currentToken();

    console.log("\nparseExpression: ", t);

    /** @type {Expression | null} */
    let left = null;

    switch (t.kind) {
      case TokenKind.INT_LITERAL:
        const value = parseInt(t.value);
        left = new IntegerLiteralExpression(value);
        this.nextToken();
        break;
      case TokenKind.STRING_LITERAL:
        left = new StringLiteralExpression(t.value);
        this.nextToken();
        break;
      case TokenKind.IDENTIFIER: {
        left = new IdentifierExpression(t.value);
        this.nextToken();
        break;
      }
    }

    t = this.currentToken();

    console.log("left:", left);

    if (!left) {
      console.log("next: ", t);
      TODO();
    }

    if (t.kind === TokenKind.SEMICOLON || t.kind === TokenKind.RIGHT_PAREN) {
      console.log("found end of expression, returning left");
      this.backup();
      return left;
    }

    if (t.kind == TokenKind.LEFT_PAREN) {
      this.index--;
      left = this.parseCallExpression(left);
    }

    if (t.kind == TokenKind.PLUS) {
      let op = t.value;
      this.nextToken();
      const right = this.parseExpression();
      left = new BinaryExpression(left, right, op);
    }

    if (this.currentToken().kind === TokenKind.SEMICOLON) {
      this.backup();
    }

    return left;
  }

  /**
   * @returns {Statement}
   */
  parseFunctionDeclarationStatement() {
    console.log("\nparseFunctionDeclarationStatement");
    const identifier = this.expect(TokenKind.IDENTIFIER);
    this.expect(TokenKind.LEFT_PAREN);
    this.expect(TokenKind.RIGHT_PAREN);

    const returnType = this.expect(TokenKind.KEYWORD);

    this.nextToken();
    const body = this.parseStatement();

    return new FunctionDeclarationStatement(
      identifier.value,
      returnType.value,
      body
    );
  }

  /**
   * @returns {Statement}
   */
  parseVariableDeclarationStatement() {
    console.log("\nparseVariableDeclarationStatement");

    const identifier = this.expect(TokenKind.IDENTIFIER);
    this.expect(TokenKind.COLON);
    const type = this.expect(TokenKind.KEYWORD);
    this.expect(TokenKind.EQUALS);
    this.nextToken();
    const value = this.parseExpression();

    this.expect(TokenKind.SEMICOLON);
    this.nextToken();

    return new VariableDeclarationStatement(
      identifier.value,
      VariableType[type.value],
      value
    );
  }

  /**
   * @returns {Statement}
   */
  parseStatement() {
    const t = this.currentToken();

    console.log("\nparseStatement: ", t);

    switch (t.kind) {
      case TokenKind.KEYWORD:
        switch (t.value) {
          case "func":
            return this.parseFunctionDeclarationStatement();
          case "var":
            return this.parseVariableDeclarationStatement();
          case "return":
            this.nextToken();
            const expression = this.parseExpression();
            this.expect(TokenKind.SEMICOLON);
            this.nextToken();
            return new ReturnStatement(expression);

          default:
            console.log(t);
            TODO();
        }
        break;

      case TokenKind.LEFT_BRACE:
        this.nextToken();
        const body = this.parseStatements();
        const s = new BlockStatement(body);
        return s;

      case TokenKind.INT_LITERAL:
      case TokenKind.STRING_LITERAL:
      case TokenKind.IDENTIFIER: {
        const expression = this.parseExpression();
        this.expect(TokenKind.SEMICOLON);
        this.nextToken();
        return new ExpressionStatement(expression);
      }

      case TokenKind.LEFT_PAREN: {
        this.nextToken();
        const expression = this.parseExpression();
        this.expect(TokenKind.RIGHT_PAREN);
        this.expect(TokenKind.SEMICOLON);
        this.nextToken();
        return new ExpressionStatement(expression);
      }

      default:
        console.log(t);
        TODO();
    }
  }

  /**
   * @returns {Statement[]}
   */
  parseStatements() {
    console.log("parse statements");
    /** @type {Statement[]} */
    const statements = [];

    while (this.index < this.tokens.length) {
      console.log(this.tokens[this.index]);
      if (this.currentToken().kind === TokenKind.RIGHT_BRACE) {
        break;
      }

      statements.push(this.parseStatement());
    }

    return statements;
  }

  /**
   * @param {string} source
   */
  parse(source) {
    console.log(source);
    const l = new Lexer();
    this.tokens = l.getTokens(source);
    console.log(this.tokens);

    const body = this.parseStatements();
    return new Program(body);
  }
}
