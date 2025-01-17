import path from "path";
const getMatchingFontPath = (language, fontFamily, fontPaths) => {
    if (language === "Japanese") {
        return "./src/utils/text/assets/NotoSansJP.ttf";
    } 
    else if (language === "Russian") {
        return "./src/utils/text/assets/Roboto-Regular.ttf";
    }

    const matchedFontPath = fontPaths.find((fontPath) => {
        const fontName = path.basename(fontPath, path.extname(fontPath));
        return fontName === fontFamily;
    });

    if (!matchedFontPath) {
        console.error(`No matching font found for fontFamily: ${fontFamily}`);
        return null;
    }
    
    return matchedFontPath;
};

export default getMatchingFontPath;