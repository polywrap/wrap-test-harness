/*
 * This entire file will be split.
 * Creating a `Generate` class that has all the methods
 * to manipulate the output from different test-case/implementation.
 *
 * We only need three arguments:
 * - Destination path (destPath)
 * - Source path (sourcePath)
 * - Project name (projectName)
 *
 * Also, objects that map the folder name (rs|as) to different strings,
 * should probably be moved to one variable.
 */

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
  Implementations = "implementations",
}

const CustomManifest = "polywrap.json";

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

  const [ missingFile ] = expectedFiles.filter(file => !files.includes(file))

  if (missingFile) {
    throw new Error(`File ${missingFile} missing from tests: ${projectName}`)
  }

  await mkdir(buildFolder)
  await generateImplementationFiles(destPath, sourcePath, projectName)
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
  const testManifest = dump(info)

  const testManifestPath = join(destPath, projectName, "polywrap.test.yaml")
  await writeFile(testManifestPath, testManifest)

  // Copy schema to implementation folder
  const schemaPath = join(sourcePath, projectName, ExpectedInfo.Schema)
  const schemaSource = join(destPath, projectName, ExpectedInfo.Schema)
  await copyFile(schemaPath, schemaSource)

  // Get implementation related files
  const destImplementationFolder = join(destPath, projectName, ExpectedInfo.Implementations)
  await mkdir(destImplementationFolder)
  const templateImplementationFolder = join(sourcePath, projectName, ExpectedInfo.Implementations)

  const generateImplementations = async (implementation: ImplementationName) => {
    // Generate implementation files (i.e: index.ts/lib.rs)
    const sourcePath = join(templateImplementationFolder, implementation)
    const destPath = join(destImplementationFolder, implementation, "src")

    const files = await readdir(sourcePath)
    for (const file of files) {
      await mkdir(destPath, {recursive: true}),
      await copyFile(join(sourcePath, file), join(destPath, file))
    }

    // Generate dependency files (i.e: package.json/Cargo.toml)
    const file = DependencyMap[implementation]
    const defaultsFolder = join(__dirname, "..", "defaults")
    const dependenciesSourcePath = join(defaultsFolder, file)
    const dependenciesDestPath = join(destImplementationFolder, implementation, file)
    await copyFile(dependenciesSourcePath, dependenciesDestPath)

    // Get files from tests folder
    const testRootPath = join(templateImplementationFolder, "..")
    let rootFiles = (await readdir(testRootPath)).filter(f => !expectedFiles.includes(f))

    // Generate polywrap manifest (i.e: polywrap.yaml)
    let manifest = {
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

    if (rootFiles.includes(CustomManifest)) {
      const { default: customManifest } = await import(join(testRootPath, CustomManifest))
      rootFiles = rootFiles.filter(file => file !== CustomManifest)
      manifest = {
        ...manifest,
        ...customManifest,
        project: {
          ...manifest.project,
          ...customManifest.project
        },
        source: {
          ...manifest.source,
          ...customManifest.source
        }
      }
    }

    validatePolywrapManifest(manifest as PolywrapManifest)

    const yamlManifest = dump(manifest)

    const manifestPath = join(destImplementationFolder, implementation, "polywrap.yaml")
    await writeFile(manifestPath, yamlManifest)

    // Copy common files
    for (const file of rootFiles) {
      const destFile = join(destImplementationFolder, "..", file)
      const sourceFile = join(templateImplementationFolder, "..", file)
      await copyFile(sourceFile, destFile)
    }
  }

  const implementations = await readdir(templateImplementationFolder)
  implementations.map(generateImplementations)
}