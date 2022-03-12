// @ts-check

import { Parser } from "./parser.js";
import { Generator } from "./generator.js";

const src = `
func main() u64 {
    var x: u8 = 1;
    var y: u8 = 2;
    var result: u8 = x + y;
    printf("result: ");
    printf("%d\n", result);
    return 0;
}
`;

class Compiler {
  /**
   * @param {string} [source]
   */
  compile(source) {
    const p = new Parser();
    const ast = p.parse(source);
    console.log("ast", JSON.stringify(ast, null, 2));

    const g = new Generator();
    const out = g.generate(ast);

    console.log("\n*******");
    console.log(out);
  }
}

const c = new Compiler();
c.compile(src);
