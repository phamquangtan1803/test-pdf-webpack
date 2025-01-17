import { createCanvas } from "canvas";

export function applyShadow(doc, textContent, line, linePosY){
    if (textContent.shadowBlur > 0 && textContent.shadowColor) {
        const shadowPaddingX = Math.abs(textContent.shadowOffsetX || 0) + textContent.shadowBlur;
        const shadowPaddingY = Math.abs(textContent.shadowOffsetY || 0) + textContent.shadowBlur;
        const canvasWidth = (textContent.autoFitBackgroundEnabled ? textContent.width : doc.widthOfString(line)) + shadowPaddingX * 2;
        const canvasHeight = (textContent.autoFitBackgroundEnabled ? textContent.height : doc.heightOfString(line)) + shadowPaddingY * 2;
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext("2d");
    
        ctx.font = `${textContent.fontSize}px ${textContent.fontFamily}`;
        ctx.shadowColor = textContent.shadowColor || "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = textContent.shadowBlur;
        ctx.shadowOffsetX = textContent.shadowOffsetX || 0;
        ctx.shadowOffsetY = textContent.shadowOffsetY || 0;
        ctx.fillStyle = "rgba(0, 0, 0, 0)"; 
        ctx.fillText(line, shadowPaddingX, textContent.fontSize + shadowPaddingY); 
    
        doc.image(canvas.toBuffer("image/png"), textContent.posX - shadowPaddingX, linePosY - shadowPaddingY, {
            width: canvasWidth,
            height: canvasHeight,
        });
    }
}