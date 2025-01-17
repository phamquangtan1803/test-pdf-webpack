export const applyContent = async (data) => {
    const textDataArray = data
    const processTextData = (textData) => {
        const textCase = textData.textTransform;
        let textContent = textData.text;
    
        if (textCase === "uppercase") {
            textContent = textContent.toUpperCase();
        } 
        else if (textCase === "titleCase") {
            textContent = textContent.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
            });
        } 
        else if (textCase === "sentenceCase") {
            textContent = textContent.charAt(0).toUpperCase() + textContent.slice(1).toLowerCase();
        }
    
        return {
            text: textContent,
            width: textData.width,
            height: textData.height,
            posX: textData.x,
            posY: textData.y,
            fontSize: textData.fontSize,
            fontFamily: textData.fontFamily,
            language: textData.language,
            align: textData.align,
            lineHeight: textData.lineHeight,
            letterSpacing: textData.letterSpacing,
            fill: textData.fill,
            textFill: textData.textFill,
            visible: textData.visible,
            rotation: textData.rotation,
            opacity: textData.opacity,
            autoFitTextContent: textData.autoFitTextContent,
            autoFitBackgroundEnabled: textData.autoFitBackgroundEnabled,
            strokeBackground: textData.strokeBackground,
            strokeBgWidth: textData.strokeBgWidth,
            shadowColor: textData.shadowColor,
            shadowBlur: textData.shadowBlur,
            shadowOpacity: textData.shadowOpacity,
            shadowOffsetX: textData.shadowOffsetX,
            shadowOffsetY: textData.shadowOffsetY,
            cornerRadius: {
                topLeft: textData.cornerRadiusTopLeft,
                topRight: textData.cornerRadiusTopRight,
                bottomLeft: textData.cornerRadiusBottomLeft,
                bottomRight: textData.cornerRadiusBottomRight,
            }
        };
    };
    
    return (processTextData(textDataArray))
};
