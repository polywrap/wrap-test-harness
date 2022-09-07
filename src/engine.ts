import {access, mkdir, readdir, rm, stat} from "fs/promises"
import {join} from "path";
import {BUILD_FOLDER, generate, TESTS_FOLDER} from "./generator";

/**
 * - Reads from tests folder and iterate through each case to get implementations & manifest
 * - Creates build folder where different cases are going to live, with all needed files in order to build
 * - Manifests are created based on name of current folder & use type based on sub-folder name (as,rs)
 *     - JS manifest types will be used to generate a JSON that then will be parsed to YAML
 * - Test manifest is created based on the workflow file, lives in root of case
 * - Project manifest is created based on name of case & type of implementation
 * - Source (src) folder is created and implementation file is moved there
 * - Dependencies file will be moved to the corresponding implementation, living in the same level of project manifest
 *
 * Once we have all the test cases ready to be built, we should build them and execute run using the CLI
 *
 * - Build (`polywrap build`) implementations in every test case
 * - Run `polywrap run` to execute workflow - This will be done using JobRunners from CLI
 * - Output is received and checked to see if invocation was successful
 *
 * Result information should be manipulated to get cool data from it, showing which case failed on which implementation
 * - TODO: Define implementation for this
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
  const sourcePath = join(__dirname, "..", TESTS_FOLDER)
  const destPath = join(__dirname, "..", BUILD_FOLDER)
  for (const name of cases) {
    await generate(destPath, sourcePath, name)
  }
}

main().then()