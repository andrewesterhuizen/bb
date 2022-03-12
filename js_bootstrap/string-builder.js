// @ts-check

export class StringBuilder {
  indentLevel = 2;
  indent = 0;
  buffer = "";

  applyIndent() {
    this.buffer += " ".repeat(this.indent);
  }

  /**
   * @param {string} s
   */
  append(s) {
    this.buffer += s;
  }

  /**
   * @param {string} s
   */
  appendLine(s) {
    this.append(s);
    this.buffer += "\n";
  }

  increaseIndent() {
    this.indent += this.indentLevel;
  }

  decreaseIndent() {
    this.indent -= this.indentLevel;
  }

  /**
   * @returns {string}
   */
  string() {
    return this.buffer;
  }
}
