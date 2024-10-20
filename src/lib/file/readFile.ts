import { promises as fs } from "fs";
import * as path from "path";

async function readFileWithValidation(filePath: string): Promise<string> {
  try {
    // Step 1: Validate if the file path is provided
    if (!filePath) {
      throw new Error("File path is not provided.");
    }

    // Step 2: Resolve the absolute path
    const resolvedPath: string = path.resolve(
      process.cwd() + "/public" + filePath
    );

    // Step 3: Check if the file exists and is accessible
    const fileStats = await fs.stat(resolvedPath);

    // Step 4: Ensure that the path is a valid file (not a directory)
    if (!fileStats.isFile()) {
      throw new Error(`The path provided is not a file: ${resolvedPath}`);
    }

    // Step 5: Read the file content
    const fileContent: string = await fs.readFile(resolvedPath, "utf-8");

    // Step 6: Return the file content
    return fileContent;
  } catch (error) {
    throw error;
  }
}

export default readFileWithValidation;
