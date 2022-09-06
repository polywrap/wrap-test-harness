import {copyFile, mkdir, readdir, rm, stat, writeFile} from "fs/promises"
import {dump} from "js-yaml";
import {join} from "path";
import {latestPolywrapWorkflowFormat} from "@polywrap/polywrap-manifest-types-js";

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

const TESTS_FOLDER = "tests"
const BUILD_FOLDER = "build"

enum ExpectedFiles {
  Workflow = "workflow.json",
  Schema = "schema.graphql"
}

interface FilesInfo {
  hasWorkflow: boolean
  hasSchema: boolean
  extraFiles: string[]
}

const generateTestManifest = async (destPath: string, sourcePath: string, projectName: string) => {
  const workflowPath = join(sourcePath, projectName, ExpectedFiles.Workflow)
  const workflowInfo = await import(workflowPath)
  const info = {
    format: latestPolywrapWorkflowFormat,
    ...workflowInfo,
    projectName
  }
  const manifest = dump(info)

  const testManifestPath = join(destPath, projectName, "polywrap.test.yaml")
  return writeFile(testManifestPath, manifest)
}

const generateSchema = async (destPath: string, sourcePath: string, projectName: string) => {
  const schemaPath = join(sourcePath, projectName, ExpectedFiles.Schema)
  const schemaSource = join(destPath, projectName, ExpectedFiles.Schema)
  return copyFile(schemaPath, schemaSource)
}

const getExtraFiles = (destPath: string, sourcePath: string, projectName: string, files: string[]) => {
  return files.map(file => {
    const destFile = join(destPath, projectName, file)
    const sourceFile = join(sourcePath, projectName, file)
    return copyFile(sourceFile, destFile)
  })
}

export const generateFiles = async (destPath: string, sourcePath: string, projectName: string) => {
  const files = await getTestFiles(sourcePath, projectName)
  const testFolder = join(destPath, projectName)
  await mkdir(testFolder)
  await Promise.all([
    generateTestManifest(destPath, sourcePath, projectName),
    generateSchema(destPath, sourcePath, projectName),
    ...getExtraFiles(destPath, sourcePath, projectName, files)
  ])
}

const getTestFiles = async (sourcePath: string, projectName: string) => {
  const testPath = join(sourcePath, projectName)
  const files = await readdir(testPath)

  const fileChecker = (info: FilesInfo, currentFile: string) => {
    if (currentFile === "implementations") return info
    if (currentFile === ExpectedFiles.Workflow) {
      info.hasWorkflow = true
      return info
    }

    if (currentFile === ExpectedFiles.Schema) {
      info.hasSchema = true
      return info
    }

    info.extraFiles.push(currentFile)
    return info
  }

  const {hasWorkflow, hasSchema, extraFiles} = files.reduce(fileChecker, {
    hasWorkflow: false,
    hasSchema: false,
    extraFiles: []
  })

  if (!hasWorkflow) throw new Error(`Workflow not found for test ${name}`)
  if (!hasSchema) throw new Error(`Schema not found for test ${name}`)

  return extraFiles
}

const main = async () => {
  try {
    const folderExists = await stat(BUILD_FOLDER)
    if (folderExists) {
      await rm(BUILD_FOLDER, {recursive: true})
    }
  } catch (e) {

  }
  await mkdir(BUILD_FOLDER)

  const cases = await readdir(TESTS_FOLDER)
  const sourcePath = join(__dirname, "..", TESTS_FOLDER)
  const destPath = join(__dirname, "..", BUILD_FOLDER)
  for (const name of cases) {
    await generateFiles(destPath, sourcePath, name)
  }
}

main().then()