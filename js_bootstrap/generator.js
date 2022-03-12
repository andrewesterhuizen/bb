// @ts-check

import {
  Program,
  Statement,
  StatementKind,
  Expression,
  ExpressionKind,
} from "./ast.js";
import { StringBuilder } from "./string-builder.js";

const TODO = () => {
  throw new Error("not yet implemented");
};

const prelude = `
#include <stdio.h> 
`;

export class Generator {
  output = new StringBuilder();

  /**
   * @param {string} type
   */
  mapTypeToCType(type) {
    switch (type) {
      case "u64":
        return "int";
      case "u8":
        return "char";
      default:
        console.log(`unknown type: `, type);
        TODO();
    }
  }

  /**
   * @param {Expression} expression
   */
  generateExpression(expression) {
    console.log("generateExpression:", expression);

    switch (expression.kind) {
      case ExpressionKind.INT_LITERAL:
      case ExpressionKind.IDENTIFIER:
        this.output.append(expression.value);
        break;
      case ExpressionKind.STRING_LITERAL:
        this.output.append('"');
        this.output.append(expression.value.replace(/\n/g, "\\n"));
        this.output.append('"');
        break;
      case ExpressionKind.BINARY:
        this.generateExpression(expression.left);
        this.output.append(" ");
        this.output.append(expression.operator);
        this.output.append(" ");
        this.generateExpression(expression.right);
        break;
      case ExpressionKind.CALL:
        this.generateExpression(expression.callee);

        this.output.append("(");

        for (let i = 0; i < expression.args.length; i++) {
          const arg = expression.args[i];
          this.generateExpression(arg);

          if (i + 1 !== expression.args.length) {
            this.output.append(",");
          }
        }

        this.output.append(")");
        break;
      default:
        console.log(expression);
        TODO();
    }
  }

  /**
   * @param {Statement} statement
   */
  generateStatement(statement) {
    console.log("\ngenerateStatement:", statement);

    switch (statement.kind) {
      case StatementKind.BLOCK:
        this.generateStatements(statement.body);
        break;
      default:
        console.log(statement);
        TODO();
    }
  }

  /**
   * @param {Statement[]} statements
   */
  generateStatements(statements) {
    console.log("\ngenerateStatements:", statements.length);

    for (let statement of statements) {
      switch (statement.kind) {
        case StatementKind.FUNCTION_DECLARATION: {
          this.output.append(this.mapTypeToCType(statement.returnType));
          this.output.append(" ");
          this.output.append(statement.identifier);
          this.output.appendLine("() {");
          this.generateStatement(statement.body);
          this.output.appendLine("");
          this.output.appendLine("}");
          break;
        }
        case StatementKind.VARIABLE_DECLARATION: {
          this.output.append(this.mapTypeToCType(statement.type));
          this.output.append(" ");
          this.output.append(statement.identifier);
          this.output.append(" = ");
          this.generateExpression(statement.value);
          this.output.appendLine(";");
          break;
        }
        case StatementKind.EXPRESSION: {
          this.generateExpression(statement.value);
          this.output.appendLine(";");
          break;
        }

        case StatementKind.RETURN: {
          this.output.append("return ");
          this.generateExpression(statement.value);
          this.output.appendLine(";");
          break;
        }

        default:
          console.log(statement);
          TODO();
      }
    }
  }

  /**
   * @param {Program} program
   * @returns {string}
   */
  generate(program) {
    console.log("\ngenerate");
    this.output.appendLine(prelude);
    this.generateStatements(program.body);
    return this.output.string();
  }
}
