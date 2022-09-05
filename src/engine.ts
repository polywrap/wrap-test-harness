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
 * - Run `polywrap run` to execute workflow
 * - Output is received and checked to see if invocation was successful
 *
 * Result information should be manipulated to get cool data from it, showing which case failed on which implementation
 * - TODO: Define implementation for this
 */

export const execute = () => {

}