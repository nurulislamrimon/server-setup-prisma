import multer from "multer";
import path from "path";
import fs from "fs";
import { ApiError } from "../../utils/ApiError";

export const uploadFiles = ({
  folder,
  size = 2000000,
  file_types = ["image/png", "image/jpg", "image/jpeg"],
}: {
  folder: string;
  size?: number;
  file_types?: string[];
}) => {
  const UPLOAD_FOLDER = "/public/" + folder;

  // Function to create folder if it doesn't exist
  const createFolderIfNotExist = (folderPath: string) => {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  };

  // multer upload destination and files name
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folderPath = process.cwd() + UPLOAD_FOLDER;
      createFolderIfNotExist(folderPath); // Create folder if it doesn't exist
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const filename =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        Date.now() +
        fileExt;
      // add the file path to the req
      req.uploadedFolder = folder;
      cb(null, filename);
    },
  });

  // multer upload functionality
  return multer({
    storage,
    limits: { fileSize: size },
    fileFilter(req, file, cb) {
      if (file_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new ApiError(400, "The file format is not allowed!"));
      }
    },
  });
};
