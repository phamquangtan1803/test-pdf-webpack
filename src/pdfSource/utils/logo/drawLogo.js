import { applySVG } from "./svg/applySVG.js";
import { parse } from 'svgson'
import { calculateLogoSize } from "./svg/calcLogoSize.js";
import { convertSVGToPNG } from "./svg/convertToPNG.js";
import fs from "fs";

export const drawLogo = async (data, doc) => {
    const logoData = data
    if (logoData.length === 0) return;
    const logoFile = await applySVG(logoData.src);
    const logoSVG = fs.readFileSync(logoFile, 'utf-8');
    const svgData = await parse(logoSVG)
    const logoItem = {
        fill: logoData.fill, 
        x: logoData.x, 
        y: logoData.y, 
        width: logoData.width,
        height: logoData.height,
        imageWidth: logoData.imageWidth,
        imageHeight: logoData.imageHeight,
        paddingRatio: logoData.paddingRatio,
        rotation: logoData.rotation,
        visible: logoData.visible,
        opacity: logoData.opacity
    }
    const viewBoxParts = svgData.attributes.viewBox.split(' ').map(Number)
    const viewBoxWidth = parseFloat(viewBoxParts[2])
    const viewBoxHeight = parseFloat(viewBoxParts[3])
    const logoContainer = {
        width: logoItem.width, 
        height: logoItem.height, 
        x: logoItem.x, 
        y: logoItem.y,
    };   
    const logo = { width: viewBoxWidth, height: viewBoxHeight,}; 
    const options = {
        paddingTop: true,
        paddingRight: true,
        paddingBottom: true,
        paddingLeft: true,
        paddingRatio: logoItem.paddingRatio,   
    };
    const svgItem = calculateLogoSize(logoContainer, logo, options);
    const pngPath = await convertSVGToPNG(logoFile, Buffer.from(logoSVG), logo.width)
    doc.image(pngPath, svgItem.x, svgItem.y, { width: svgItem.width, height: svgItem.height})
}

