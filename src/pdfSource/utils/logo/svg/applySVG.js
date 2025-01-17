import { fetchLogo } from "../../../services/api/logoAPI.js";
import path from "path"
import fs from "fs"

export const applySVG = async (svgURL) => {
    try {
        const response = await fetchLogo.get(svgURL);
        const logoBuffer = response.data;
        const getFileName = (url) => {
            const match = url.match(/\/([^/]+)\.svg$/);
            return match ? match[1] : null;
        };
        const fileName = getFileName(svgURL);
        const logoFolder = path.join(process.cwd(), "./src/utils/logo/assets");
        fs.mkdirSync(logoFolder, { recursive: true });

        const filePath = path.join(logoFolder, `${fileName}.svg`);
        fs.writeFileSync(filePath, Buffer.from(logoBuffer));
        const relativeLogoPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
        return relativeLogoPath;
    } 
    catch (error) {
        console.error('Error saving logos:', error)
        return []
    }
}