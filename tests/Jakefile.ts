import * as Jakets from "jakets/lib/Jakets";
import * as Tsc from "jakets/lib/TscTask";

import { RollupTask } from "../lib/RollupTask";
let MakeRelative = Jakets.CreateMakeRelative(__dirname);

let CompileDir = Jakets.BuildDir + "/compile";

Jakets.GlobalTaskNs(
  "test"
  , "rollup"
  , [
    RollupTask(
      "rollup"
      , CompileDir + "/all.js"
      , [CompileDir + "/Main.js"]
      , [
        Tsc.TscTask(
          "tsc"
          , ["./Main.ts", "./Module1.ts"].map(MakeRelative)
          , []
          , {
            outDir: CompileDir,
            module: Tsc.ModuleKind.ES2015,
            target: Tsc.ScriptTarget.ES5
          }
        )
      ]
      , {
        Bundle: {
          // dest: "",
          format: "iife",
          name: "TopModule",
          sourcemap: "inline",
          strict: false
        }
      }
    )
  ]
  , async () => {
    require("../" + CompileDir + "/all");
  }
);
