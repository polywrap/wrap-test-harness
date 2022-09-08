import {join} from "path";
import {
  latestPolywrapManifestFormat,
  latestPolywrapWorkflowFormat,
  PolywrapManifest,
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

const expectedFiles: string[] = Object.values(ExpectedInfo)

export const generate = async (destPath: string, sourcePath: string, projectName: string) => {
  const buildFolder = join(destPath, projectName)
  const testFolder = join(sourcePath, projectName)
  const files = await readdir(testFolder)

  const [missingFile] = expectedFiles.filter(file => !files.includes(file))
  if (missingFile) {
    throw new Error(`File ${missingFile} missing from tests: ${projectName}`)
  }

  await mkdir(buildFolder)
  await generateImplementationFiles(destPath, sourcePath, projectName)
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
  // Generate test manifest from workflow
  const workflowPath = join(sourcePath, projectName, ExpectedInfo.Workflow)
  const {default: workflowInfo} = await import(workflowPath)

  const info = {
    format: latestPolywrapWorkflowFormat,
    ...workflowInfo,
    name: projectName
  }

  validatePolywrapWorkflow(info)
  const manifest = dump(info)

  const testManifestPath = join(destPath, projectName, "polywrap.test.yaml")
  await writeFile(testManifestPath, manifest)

  // Copy schema to implementation folder
  const schemaPath = join(sourcePath, projectName, ExpectedInfo.Schema)
  const schemaSource = join(destPath, projectName, ExpectedInfo.Schema)
  await copyFile(schemaPath, schemaSource)

  // Get implementation related files
  const sourceImplementationFolder = join(destPath, projectName, ExpectedInfo.Implementations)
  await mkdir(sourceImplementationFolder)

  const templateImplementationFolder = join(sourcePath, projectName, ExpectedInfo.Implementations)
  const implementations = await readdir(templateImplementationFolder)

  // Copy common files
  const files = await getTestFiles(sourcePath, projectName, expectedFiles)

  for (const file of files) {
    const destFile = join(destPath, projectName, file)
    const sourceFile = join(sourcePath, projectName, file)
    await copyFile(sourceFile, destFile)
  }

  const generateImplementations = async (implementation: ImplementationName) => {
    // Generate implementation files (i.e: index.ts/lib.rs)
    const sourcePath = join(templateImplementationFolder, implementation)
    const destPath = join(sourceImplementationFolder, implementation, "src")

    const files = await readdir(sourcePath)
    for (const file of files) {
      await mkdir(destPath, {recursive: true}),
      await copyFile(join(sourcePath, file), join(destPath, file))
    }

    // Generate dependency files (i.e: package.json/Cargo.toml)
    const file = DependencyMap[implementation]
    const defaultsFolder = join(__dirname, "..", "defaults")
    const dependenciesSourcePath = join(defaultsFolder, file)
    const dependenciesDestPath = join(sourceImplementationFolder, implementation, file)
    await copyFile(dependenciesSourcePath, dependenciesDestPath)

    // Generate polywrap manifest (i.e: polywrap.yaml)
    const manifest = {
      format: latestPolywrapManifestFormat,
      project: {
        name: projectName,
        type: `wasm/${ImplementationsMap[implementation]}`,
      },
      source: {
        schema: "../../schema.graphql",
        module: `./${ImplementationModule[implementation]}`
      },
    }

    validatePolywrapManifest(manifest as PolywrapManifest)

    const yamlManifest = dump(manifest)

    const manifestPath = join(sourceImplementationFolder, implementation, "polywrap.yaml")
    await writeFile(manifestPath, yamlManifest)
  }

  return implementations.map(generateImplementations)
}