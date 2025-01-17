import fs from "fs";
import sharp from "sharp";
import path from "path";
import process from "process/browser";
export async function convertSVGToPNG(svgPath, svgBuffer, svgWidth) {
  const scaleFactor = 10;
  const logoFolder = path.join(process.cwd(), "./src/utils/logo/assets");
  const getFileName = (url) => {
    const match = url.match(/\/([^/]+)\.svg$/);
    return match ? match[1] : null;
  };
  const fileName = getFileName(svgPath);
  fs.mkdirSync(logoFolder, { recursive: true });

  const outputPngPath = path.join(logoFolder, `${fileName}.png`);

  await sharp(svgBuffer)
    .resize({ width: Math.round(svgWidth * scaleFactor) })
    .png()
    .toFile(outputPngPath);

  return outputPngPath;
}
