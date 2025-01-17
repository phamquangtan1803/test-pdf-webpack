import { applyFont } from "./font/applyFont.js";
import { applyContent } from "./content/applyContent.js";
import { applyBackground } from "./content/applyBackground.js";
import { applyShadow } from "./content/applyShadow.js";
import { getTextArr } from "./content/canvasTextArr.js";
import getMatchingFontPath from "./font/fontResolver.js";
import { drawRichText } from "./richtext/drawRichText.js";

export const drawText = async (data, doc) => {
    if (data.elementType === "richText") await drawRichText(data, doc)
    else {
        const fontPaths = await applyFont();
        const textContent = await applyContent(data);
        const textArr = getTextArr(textContent);
        const wrappedTextLines = textArr.map(item => item.text)
        const fontPath = getMatchingFontPath(textContent.language, textContent.fontFamily, fontPaths);

        if (textContent.visible !== false) {
            doc.save();

            if (!fontPath) {
                console.error(`No font found for language: ${textContent.language}, fontFamily: ${textContent.fontFamily}`);
                return;
            }

            if (textContent.rotation) {
                const centerX = textContent.posX + textContent.width / 2;
                const centerY = textContent.posY + textContent.height / 2;
                doc.rotate(textContent.rotation, { origin: [centerX, centerY] });
            }

            doc.fontSize(textContent.fontSize);

            wrappedTextLines.forEach((line, index) => {
                const linePosY = textContent.posY + index * (textContent.lineHeight + textContent.fontSize);

                applyBackground(doc, textContent, line, index);
                applyShadow(doc, textContent, line, linePosY);

                doc.font(fontPath)
                    .fillColor(textContent.textFill || "#000", textContent.opacity || 1)
                    .text(line, textContent.posX, linePosY, {
                        align: textContent.align,
                        width: textContent.width,
                        height: textContent.height,
                        paragraphGap: textContent.lineHeight * textContent.height,
                        characterSpacing: (textContent.letterSpacing / 100) * textContent.fontSize,
                    });
            })

            doc.restore();
        }
    }
}
