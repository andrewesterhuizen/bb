// @ts-check

export const TokenKind = {
  KEYWORD: "KEYWORD",
  IDENTIFIER: "IDENTIFIER",
  INT_LITERAL: "INT_LITERAL",
  STRING_LITERAL: "STRING_LITERAL",
  LEFT_PAREN: "LEFT_PAREN",
  RIGHT_PAREN: "RIGHT_PAREN",
  LEFT_BRACE: "LEFT_BRACE",
  RIGHT_BRACE: "RIGHT_BRACE",
  COLON: "COLON",
  SEMICOLON: "SEMICOLON",
  EQUALS: "EQUALS",
  PLUS: "PLUS",
  END_OF_FILE: "END_OF_FILE",
};

const KEYWORDS = ["func", "var", "u8", "u64", "usize", "return"];

export class Token {
  /**
   * @param {string} [kind]
   * @param {string} [value]
   */
  constructor(kind, value) {
    /** @type {string} */
    this.kind = kind;
    /** @type {string} */
    this.value = value;
  }
}

const WHITESPACE_REGEX = /\s/;
const INTEGER_REGEX = /\d/;

export class Lexer {
  source = "";
  index = 0;

  basicTokens = {
    "+": TokenKind.PLUS,
    "=": TokenKind.EQUALS,
    "(": TokenKind.LEFT_PAREN,
    ")": TokenKind.RIGHT_PAREN,
    "{": TokenKind.LEFT_BRACE,
    "}": TokenKind.RIGHT_BRACE,
    ":": TokenKind.COLON,
    ";": TokenKind.SEMICOLON,
  };

  skipWhitespace() {
    while (WHITESPACE_REGEX.test(this.source[this.index])) {
      this.index++;
    }
  }

  getIdentifier() {
    this.skipWhitespace();

    let out = "";
    let c = this.source[this.index];

    while (!WHITESPACE_REGEX.test(c) && !(c in this.basicTokens)) {
      out += c;
      this.index++;
      c = this.source[this.index];
    }

    return out;
  }

  getString() {
    let out = "";

    // skip first quote
    this.index++;
    let c = this.source[this.index];

    while (c != '"') {
      out += c;
      this.index++;
      c = this.source[this.index];
    }

    // skip last quote
    this.index++;

    return out;
  }

  getInteger() {
    let out = "";

    let c = this.source[this.index];

    while (INTEGER_REGEX.test(c)) {
      out += c;
      this.index++;
      c = this.source[this.index];
    }

    return out;
  }

  /**
   * @param {string} [source]
   * @returns {Token[]}
   */
  getTokens(source) {
    this.index = 0;
    this.source = source;
    const tokens = [];

    while (this.index < this.source.length) {
      this.skipWhitespace();

      let c = this.source[this.index];
      if (c == undefined) {
        break;
      }

      console.log("\n");
      console.log("c", c);
      if (c in this.basicTokens) {
        console.log("is basic token");
        tokens.push(new Token(this.basicTokens[c], c));
        this.index++;
        continue;
      }

      console.log("not basic token");

      if (c == '"') {
        const stringValue = this.getString();
        tokens.push(new Token(TokenKind.STRING_LITERAL, stringValue));
        continue;
      }

      if (INTEGER_REGEX.test(c)) {
        const intValue = this.getInteger();
        tokens.push(new Token(TokenKind.INT_LITERAL, intValue));
        continue;
      }

      const next = this.getIdentifier();

      console.log("next", next);

      if (KEYWORDS.includes(next)) {
        console.log("is keyword");
        tokens.push(new Token(TokenKind.KEYWORD, next));
      } else {
        console.log("is identifier");
        tokens.push(new Token(TokenKind.IDENTIFIER, next));
      }
    }

    return tokens;
  }
}
