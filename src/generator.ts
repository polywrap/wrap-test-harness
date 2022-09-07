import {join} from "path";
import {
  latestPolywrapWorkflowFormat,
  validatePolywrapManifest,
  validatePolywrapWorkflow
} from "@polywrap/polywrap-manifest-types-js";
import {dump} from "js-yaml";
import {copyFile, mkdir, readdir, writeFile} from "fs/promises";

export const TESTS_FOLDER = "tests"
export const BUILD_FOLDER = "build"

enum ExpectedInfo {
  Workflow = "workflow.json",
  Schema = "schema.graphql",
  Implementations = "implementations"
}

const DependencyMap = {
  "rs": "Cargo.toml",
  "as": "package.json"
}

const ImplementationsMap = {
  "rs": "rust",
  "as": "assemblyscript"
}

const ImplementationModule = {
  "rs": "Cargo.toml",
  "as": "src/index.ts"
}

type ImplementationName = keyof typeof ImplementationsMap

const generateTestManifest = async (destPath: string, sourcePath: string, projectName: string) => {
  const workflowPath = join(sourcePath, projectName, ExpectedInfo.Workflow)
  const { default: workflowInfo } = await import(workflowPath)

  const info = {
    format: latestPolywrapWorkflowFormat,
    ...workflowInfo,
    name: projectName
  }

  validatePolywrapWorkflow(info)
  const manifest = dump(info)

  const testManifestPath = join(destPath, projectName, "polywrap.test.yaml")
  return writeFile(testManifestPath, manifest)
}

const generateSchema = async (destPath: string, sourcePath: string, projectName: string) => {
  const schemaPath = join(sourcePath, projectName, ExpectedInfo.Schema)
  const schemaSource = join(destPath, projectName, ExpectedInfo.Schema)
  return copyFile(schemaPath, schemaSource)
}

const getSharedFiles = async (destPath: string, sourcePath: string, projectName: string, expectedFiles: string[]) => {
  const files = await getTestFiles(sourcePath, projectName, expectedFiles)
  return files.map(file => {
    const destFile = join(destPath, projectName, file)
    const sourceFile = join(sourcePath, projectName, file)
    return copyFile(sourceFile, destFile)
  })
}

export const generate = async (destPath: string, sourcePath: string, projectName: string) => {
  const buildFolder = join(destPath, projectName)
  const testFolder = join(sourcePath, projectName)
  const files = await readdir(testFolder)

  const expectedFiles: string[] = Object.values(ExpectedInfo)
  const [missingFile] = expectedFiles.filter(file => !files.includes(file))
  if (missingFile) {
    throw new Error(`File ${missingFile} missing from tests: ${projectName}`)
  }

  await mkdir(buildFolder)
  await Promise.all([
    generateTestManifest(destPath, sourcePath, projectName),
    generateSchema(destPath, sourcePath, projectName),
    getSharedFiles(destPath, sourcePath, projectName, expectedFiles),
    generateImplementationFiles(destPath, sourcePath, projectName)
  ])
}

const getTestFiles = async (sourcePath: string, projectName: string, expectedFiles: string[]) => {
  const testPath = join(sourcePath, projectName)
  const files = await readdir(testPath)
  return files.filter(file => !expectedFiles.includes(file))
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

  const getImplementations = async (implementation: string) => {
    const sourcePath = join(templateImplementationFolder, implementation)
    const destPath = join(sourceImplementationFolder, implementation, "src")
    await mkdir(destPath, {recursive: true})
    const [file] = await readdir(sourcePath) as string[]
    return join(implementation, "src", file)
  }

  const getCopyPromises = (file: string) => {
    const [implementation, _, name] = file.split("/")
    const sourcePath = join(templateImplementationFolder, implementation, name)
    const destPath = join(sourceImplementationFolder, file)
    return copyFile(sourcePath, destPath)
  }

  const generateDependencyFile = (implementation: ImplementationName) => {
    const dependenciesFile = join(__dirname, "..", "defaults")
    const file = DependencyMap[implementation]
    const sourcePath = join(dependenciesFile, file)
    const destPath = join(sourceImplementationFolder, implementation, file)
    return copyFile(sourcePath, destPath)
  }

  const implementationPath = await Promise.all(implementations.map(getImplementations))

  const generatePolywrapManifest = async (file: string) => {
    const manifestFile = join(__dirname, "..", "defaults", "polywrap.json")
    const { default: manifestTemplate } = await import(manifestFile)
    const [implementation] = file.split("/")

    const implementationName = ImplementationsMap[implementation as ImplementationName]
    const manifest = {
      ...manifestTemplate,
      project: {
        name: projectName,
        type: `wasm/${implementationName}`,
      },
      source: {
        ...manifestTemplate.source,
        module: "./" + ImplementationModule[implementation as keyof typeof ImplementationModule]
      }
    }

    validatePolywrapManifest(manifest)

    const yamlManifest = dump(manifest)

    const manifestPath = join(sourceImplementationFolder, implementation, "polywrap.yaml")
    return await writeFile(manifestPath, yamlManifest)
  }

  return [
    ...implementationPath.map(getCopyPromises),
    ...implementationPath.map(generatePolywrapManifest),
    ...implementations.map(generateDependencyFile),
  ]
}