export function applyBackground(doc, textContent, line, index){
    let lineWidth;
    if (textContent.autoFitBackgroundEnabled) {
        lineWidth = textContent.width;
    } 
    else {
        lineWidth = doc.widthOfString(line);
    }

    const rectX = textContent.posX;
    const rectY = textContent.posY + index * (textContent.lineHeight + textContent.fontSize);
    const rectHeight = textContent.lineHeight * (doc.heightOfString(line));
    const cornerRadius = textContent.cornerRadius.topLeft || 0;

    if (textContent.fill !== "transparent") {
        doc.roundedRect(rectX, rectY, lineWidth, rectHeight, cornerRadius)
            .fillColor(textContent.fill, textContent.opacity)
            .strokeColor(textContent.strokeBackground, textContent.opacity)
            .fillAndStroke(textContent.fill, textContent.strokeBackground);
    }
}