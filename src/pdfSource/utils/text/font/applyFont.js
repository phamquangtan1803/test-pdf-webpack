import { fetchFont } from "../../../services/api/fontAPI.js";
import { Font } from "fonteditor-core";
import path from "path";
import fs from "fs";
import process from "process/browser";
export const applyFont = async () => {
  const fontBuffers = await fetchFont.get();
  const fontFolder = path.join(process.cwd(), "./src/utils/text/assets");

  fs.mkdirSync(fontFolder, { recursive: true });

  const fontPaths = fontBuffers.map(
    ({ data: fontBuffer, fileExtension }, index) => {
      const font = Font.create(fontBuffer, {
        type: fileExtension.toLowerCase(),
      });
      const fontMetadata = font.get();
      const fontName = fontMetadata.name.fontFamily || `unknown-font-${index}`;
      const outputFontPath = path.join(
        fontFolder,
        `${fontName}.${fileExtension}`
      );
      const relativeFontPath = path
        .relative(process.cwd(), outputFontPath)
        .replace(/\\/g, "/");

      fs.writeFileSync(outputFontPath, Buffer.from(fontBuffer));

      return relativeFontPath;
    }
  );

  return fontPaths;
};
