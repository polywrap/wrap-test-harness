import { mkdir, readdir, rm } from "fs/promises"
import { join } from "path";
import { BUILD_FOLDER, generate, TESTS_FOLDER } from "./generator";

/**
 * - Build (`polywrap build`) implementations in every test case
 * - Run `polywrap run` to execute workflow - This will be done using JobRunners from CLI
 * - Output is received and checked to see if invocation was successful
 *
 * Result information should be manipulated to get cool data from it, showing which case failed on which implementation
 * - Probably having two ways to show results
 *     - Implement an http server withe express and create endpoints that return results
 *     - Show the results in CLI, with a table
 * Any of these solutions will need to manipulate the output of the workflow,
 * being the output an object of the result of the different cases in different implementations
 */

const main = async () => {
  try {
    await rm(BUILD_FOLDER, {recursive: true})
  } catch (e) {
    // If this comes here means that there's no build folder and that's ok
  } finally {
    await mkdir(BUILD_FOLDER)
  }

  const cases = await readdir(TESTS_FOLDER)
  const destPath = join(__dirname, "..", BUILD_FOLDER)
  const sourcePath = join(__dirname, "..", TESTS_FOLDER)
  for (const name of cases) {
    await generate(destPath, sourcePath, name)
  }
}

main().then()