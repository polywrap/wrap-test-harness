import {join} from "path";
import {latestPolywrapWorkflowFormat} from "@polywrap/polywrap-manifest-types-js";
import {dump} from "js-yaml";
import {copyFile, mkdir, readdir, writeFile} from "fs/promises";

export const TESTS_FOLDER = "tests"
export const BUILD_FOLDER = "build"

enum ExpectedInfo {
  Workflow = "workflow.json",
  Schema = "schema.graphql",
  Implementations = "implementations"
}

const generateTestManifest = async (destPath: string, sourcePath: string, projectName: string) => {
  const workflowPath = join(sourcePath, projectName, ExpectedInfo.Workflow)
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
  const schemaPath = join(sourcePath, projectName, ExpectedInfo.Schema)
  const schemaSource = join(destPath, projectName, ExpectedInfo.Schema)
  return copyFile(schemaPath, schemaSource)
}

const getExtraFiles = (destPath: string, sourcePath: string, projectName: string, files: string[]) => {
  return files.map(file => {
    const destFile = join(destPath, projectName, file)
    const sourceFile = join(sourcePath, projectName, file)
    return copyFile(sourceFile, destFile)
  })
}

export const generate = async (destPath: string, sourcePath: string, projectName: string) => {
  const files = await getTestFiles(sourcePath, projectName)
  const testFolder = join(destPath, projectName)
  await mkdir(testFolder)
  await Promise.all([
    generateTestManifest(destPath, sourcePath, projectName),
    generateSchema(destPath, sourcePath, projectName),
    ...getExtraFiles(destPath, sourcePath, projectName, files),
    generateImplementationFiles(destPath, sourcePath, projectName)
  ])
}

const getTestFiles = async (sourcePath: string, projectName: string) => {
  const testPath = join(sourcePath, projectName)
  const files = await readdir(testPath)
  const expectedFiles = Object.values(ExpectedInfo)

  const [missingFile] = expectedFiles.filter(file => !files.includes(file))
  if (missingFile) {
    throw new Error(`File ${missingFile} missing from tests: ${projectName}`)
  }

  const fileChecker = (info: string[], currentFile: string) => {
    const isExtraFile = !expectedFiles.includes(currentFile as ExpectedInfo)
    if (isExtraFile) info.push(currentFile)
    return info
  }

  return files.reduce(fileChecker, [])
}


const generateImplementationFiles = async (
  destPath: string,
  sourcePath: string,
  projectName: string
) => {
  const sourceImplementationFolder = join(destPath, projectName, ExpectedInfo.Implementations)
  await mkdir(sourceImplementationFolder)

  const templateImplementationFolder = join(sourcePath, projectName, ExpectedInfo.Implementations)
  const implementations = await readdir(templateImplementationFolder)

  const getImplementationPath = async (implementation: string) => {
    const sourcePath = join(templateImplementationFolder, implementation)
    const destPath = join(sourceImplementationFolder, implementation)
    await mkdir(destPath)
    const [file] = await readdir(sourcePath) as string[]
    return join(implementation, file)
  }

  const getCopyPromises = (file: string) => {
    const sourcePath = join(templateImplementationFolder, file)
    const destPath = join(sourceImplementationFolder, file)
    return copyFile(sourcePath, destPath)
  }

  const filesPath = await Promise.all(implementations.map(getImplementationPath))
  return filesPath.map(getCopyPromises)

}