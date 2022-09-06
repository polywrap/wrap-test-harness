import {join} from "path";
import {latestPolywrapWorkflowFormat} from "@polywrap/polywrap-manifest-types-js";
import {dump} from "js-yaml";
import {copyFile, mkdir, readdir, writeFile} from "fs/promises";

export const TESTS_FOLDER = "tests"
export const BUILD_FOLDER = "build"

enum ExpectedFiles {
    Workflow = "workflow.json",
    Schema = "schema.graphql"
}

interface FilesInfo {
    hasWorkflow: boolean
    hasSchema: boolean
    extraFiles: string[]
}

interface ManifestInformation {
    name: string
    language: string
    type: string
    manifest: unknown
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

export const generate = async (destPath: string, sourcePath: string, projectName: string) => {
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