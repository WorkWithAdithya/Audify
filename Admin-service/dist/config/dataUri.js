// src/config/dataUri.ts
import DataUriParser from "datauri/parser.js";
import path from "node:path";
const parser = new DataUriParser();
/**
 * Returns a DataURI object compatible with Cloudinary's uploader when given a Multer file.
 * Keeps your original behavior (controller checks for `.content`).
 */
const getBuffer = (file) => {
    if (!file || !file.buffer)
        return null;
    const ext = path.extname(file.originalname || "");
    const safeExt = ext && ext.startsWith(".") ? ext : ".bin";
    return parser.format(safeExt, file.buffer);
};
export default getBuffer;
