import "jakets/Jakefile";
import * as Jakets from "jakets/lib/Jakets";
import * as Tsc from "jakets/lib/TscTask";
import { RollupTask } from "./lib/RollupTask";
let MakeRelative = Jakets.CreateMakeRelative(__dirname);

Jakets.GlobalTask(
  "test_rollup"
  , [
    RollupTask(
      "rollup"
      , Jakets.BuildDir + "/compile/all.js"
      , [Jakets.BuildDir + "/compile/Main.js"]
      , [
        Tsc.TscTask(
          "tsc"
          , [MakeRelative("./tests/Main.ts")]
          , []
          , {
            outDir: "build/compile",
            module: Tsc.ModuleKind.ES2015,
            target: Tsc.ScriptTarget.ES5
          }
        )
      ]
      , {
        Bundle: {
          dest: "",
          format: "iife",
          moduleName: "TopModule",
          sourceMap: "inline",
          useStrict: false
        }
      }
    )
  ]
  , async () => {
    require("./" + Jakets.BuildDir + "/compile/all");
  }
);