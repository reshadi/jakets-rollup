import * as Rollup from "rollup";
import * as Jakets from "jakets/lib/Jakets";
import * as Task from "jakets/lib/task/Task";
// import { } from "jakets/lib/task/FileTask";

let RollupNodeResolve = require('rollup-plugin-node-resolve');
let RollupMultiEntry = require('rollup-plugin-multi-entry');
let RollupNodeResolvePlugin = RollupNodeResolve({
  jsnext: true,
  module: true,
  main: true,  // for commonjs modules that have an index.js
  browser: true
});
let RollupMultiEntryPlugin = RollupMultiEntry();

export function RollupTask(
  name: string
  , outputFilename: string
  , inputFilenames: string[]
  , dependencies: Task.TaskDependencies
  , options?: {
    Rollup?: Rollup.Options
    Bundle?: Rollup.WriteOptions
  }
): Jakets.FileTaskType {
  //Make a copy of all options before changing them
  options = Object.assign({}, options);
  options.Rollup = Object.assign({}, options.Rollup);
  options.Bundle = Object.assign({}, options.Bundle);

  let plugins: Rollup.Plugin[] = [];
  if (options.Rollup.plugins) {
    plugins = plugins.concat(options.Rollup.plugins);
  }
  if (inputFilenames.length > 1) {
    plugins.push(RollupMultiEntry());
    options.Rollup.entry = <any>inputFilenames;
  } else {
    options.Rollup.entry = inputFilenames[0];
  }

  plugins.push(RollupNodeResolvePlugin);

  options.Rollup.plugins = plugins;

  options.Bundle.dest = outputFilename;

  let depInfo = new Jakets.CommandInfo(<any>{
    Name: name,
    Dependencies: Task.Task.NormalizeDedpendencies(dependencies),
    Files: inputFilenames,
    Options: options,
    Output: outputFilename
  });

  //Write the json file before adding the plugins:
  return Jakets.FileTask(depInfo.DependencyFile, depInfo.AllDependencies, async function () {
    return Rollup.rollup(options.Rollup)
      .then(bundle => bundle.write(options.Bundle))
      .then(() => {
        //Remove plugins since it is not clear what will be written!
        options.Rollup.plugins = null;
        depInfo.Write();
      });
  });
}
