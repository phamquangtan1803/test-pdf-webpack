import { fetchFont } from "./fetchFont.js"
import { calcTextLines, getFontList } from "./richTextUtils.js";

export const drawRichText = async (item, doc) => {
    const {lines, chars} = await calcTextLines(item, item.valueList);
    const fontList = await getFontList(item.valueList)
    let currentPos = -1;
    let x = item.x;
    let y = item.y;
    doc.save();

    //add rotate
    doc.rotate(item.rotation, { origin: [item.x, item.y]})

    //draw background
    const hasFill = item.fill !== "transparent" && item.fill != undefined;
    const hasStroke = item.strokeBackground !== "transparent" && item.strokeBackground != undefined && hasFill;
    const paddingX = item.padding.horizontal, paddingY = item.padding.vertical;
    doc.save().roundedRect(item.x - (paddingX) , item.y - (paddingY), item.width + (paddingX*2), item.height + (paddingY*2), item.cornerRadiusTopLeft)
    .lineWidth(item.strokeBgWidth).fillOpacity(hasFill ? 1 : 0)
    .strokeOpacity(hasStroke ? 1 : 0)
    .fillColor(item.fill).fillAndStroke(item.fill, item.strokeBackground).restore();

    y += chars[0].maxFontSize/1.2;

    lines.forEach(line => {
        switch (item.align) {
            case "left": {
                x = x;
            } break;
            case "center": {
                x += (item.width - line.width)/2
            } break;
            case "right": {
                x += item.width - line.width
            } break;
            default: 
                break;
        }
        for (let i = 0; i < line.text.length; i++) {
            currentPos++;
            const char = chars[currentPos];
            let underline = char.textDecoration === "underline" && !(char.text == " " && i == (line.text.length - 1))
            doc.save().translate(x, y).font(char.fontPath).fontSize(char.fontSize).fillColor(char.fill).text(char.text, 0, 0, {
                continued: i === (line.text.length - 1) ? false : true,
                underline: underline,
                baseline: 'alphabetic'
            }).restore();
            x += char.letterSpacing
        }
        y += line.lineHeight;
        x = item.x;
    })
    doc.restore();
}