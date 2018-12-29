import * as Path from "path";
import * as Rollup from "rollup";
import * as Jakets from "jakets/lib/Jakets";
import * as Task from "jakets/lib/task/Task";
// import { } from "jakets/lib/task/FileTask";

let RollupNodeResolve = require('rollup-plugin-node-resolve');
// let RollupMultiEntry = require('rollup-plugin-multi-entry');
let RollupNodeResolvePlugin = RollupNodeResolve({
  jsnext: true,
  module: true,
  main: true,  // for commonjs modules that have an index.js
  browser: true
});
// let RollupMultiEntryPlugin = RollupMultiEntry();

export interface RollupOptions {
  Rollup?: Rollup.InputOptions;
  Bundle?: Rollup.OutputOptions;
}

export function RollupTask(
  name: string
  , outputFilename: string
  , inputFilenames: string[]
  , dependencies: Task.TaskDependencies
  , options?:RollupOptions
): Jakets.FileTaskType {
  //Make a copy of all options before changing them

  let inputOptions: Rollup.RollupOptions = {
    ...options.Rollup,
    input: inputFilenames,
    // input: null,
    cache: null,
    plugins: [RollupNodeResolvePlugin],
  };
  if (options.Rollup && options.Rollup.plugins) {
    inputOptions.plugins = inputOptions.plugins.concat(options.Rollup.plugins);
  }
  // if (inputFilenames.length > 1) {
  //   inputOptions.plugins.push(RollupMultiEntry());
  //   inputOptions.input = <any>inputFilenames;
  // } else {
  //   inputOptions.input = inputFilenames[0];
  // }

  let outputOptions: Rollup.OutputOptions = {
    ...options.Bundle,
    // dest: outputFilename,
    file: outputFilename,
  };

  let depInfo = new Jakets.CommandInfo({
    Name: name,
    Dir: Path.resolve(Jakets.LocalDir),
    Command: "rollup",
    Inputs: inputFilenames,
    Outputs: [outputFilename],
    Options: { Rollup: inputOptions, Bundle: outputOptions },
    Dependencies: Task.Task.NormalizeDedpendencies(dependencies),
  });

  //Write the json file before adding the plugins:
  return Jakets.FileTask(depInfo.DependencyFile, depInfo.AllDependencies, async function () {
    let sectionName = `rollup compile ${depInfo.Data.Name} with ${depInfo.DependencyFile}`;
    console.time(sectionName);

    return Rollup.rollup(inputOptions)
      .then(bundle => {
        return bundle.write(outputOptions);
      })
      .then(() => {
        //Remove plugins since it is not clear what will be written!
        inputOptions.plugins = null;
        depInfo.Write();
        console.timeEnd(sectionName);
      });
  });
}
