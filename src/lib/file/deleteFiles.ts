import fs from "fs";
// ===========================
// delete existing file=======
// ===========================

export const deleteFile = (filePath: string | Express.Multer.File) => {
  try {
    if (typeof filePath !== "string") {
      filePath = filePath.path;
    } else {
      filePath = process.cwd() + "/public/" + filePath;
    }

    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          if (err.code === "ENOENT") {
            console.log(`${filePath} does not exist.`);
            return true; // File doesn't exist, return true
          } else {
            console.log(`Error deleting file ${filePath}: ${err}`);
            return false; // Failed to delete file, return false
          }
        } else {
          console.log(`${filePath} deleted successfully.`);
          return true; // File deleted successfully
        }
      });
    } else {
      console.log(`${filePath} does not exist.`);
      return true; // File doesn't exist, return true
    }
  } catch (error) {
    console.log(`Error deleting file ${filePath}: ${error}`);
    return false; // Failed to delete file, return false
  }
};
