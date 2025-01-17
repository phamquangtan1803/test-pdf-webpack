import sharp from "sharp";
import { fetchImage } from "./fetchImage.js";
import  {
    drawCustomRect,
    drawCustomSVG,
    drawCircle,
} from "./helper.js";

const svgElement = {
    svgString: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"34\" height=\"34\" viewBox=\"0 0 34 34\" fill=\"none\">\n<path d=\"M17 0L21 13H34L23 21L27 34L17 26L7 34L11 21L0 13H13L17 0Z\" fill=\"#8F8F8F\"/>\n</svg>\n",
    svgUrl: "https://stg-template-static.obello.com/Static/Graphics/Shape-Star5point.svg",
    x: 0,
    y: 0,
    width: 34,
    height: 34,
    svgWidth: 34,
    svgHeight: 34,
    children: [
        {
            type: "path",
            d: "M17 0L21 13H34L23 21L27 34L17 26L7 34L11 21L0 13H13L17 0Z",
            fill: "#8F8F8F",
            stroke: null,
            strokeWidth: 0
        }
    ]
}


async function addImage(item, doc) {
    try {if (item.src === "") return;
    const imgBuffer = await fetchImage(item.src, item.opacity);

    doc.save();
    const imgHeight = item.height / item.cropHeight;
    const imgWidth = item.width / item.cropWidth;
    const imgCropX = imgWidth*item.cropX;
    const imgCropY = imgHeight*item.cropY;

    const pngBuffer = await sharp(imgBuffer).resize(Math.round(imgWidth), Math.round(imgHeight), {
        fit: 'cover'
    }).extract({
        left: Math.round(imgCropX),
        top:  Math.round(imgCropY),
        width: item.width,
        height: item.height
    }).png().toBuffer();

    doc.clip();
    doc.image(pngBuffer, item.x, item.y, { width: item.width, height: item.height});
    doc.restore();}
    catch (err) {
        console.log(err)
    }
}

function addRotate(x, y, doc, angle) {
    doc.rotate(angle, { origin: [x, y] });
}

function addOpacity(item, doc) {
    doc.fillOpacity(item.opacity);
    doc.strokeOpacity(item.opacity);
}

function addOverlayColor (item, doc, shape) {
    try {
    if (item.alpha === 0) return;

    let lineWidth = item.stroke === "transparent" ? 0 : item.strokeWidth;
    if (shape === "Circle") lineWidth /= 2;
    let topLeft = item.cornerRadiusTopLeft - lineWidth / 2 < 0 ? 0 : item.cornerRadiusTopLeft - lineWidth / 2;
    let topRight = item.cornerRadiusTopRight - lineWidth / 2 < 0 ? 0 : item.cornerRadiusTopRight - lineWidth / 2
    let bottomRight = item.cornerRadiusBottomRight - lineWidth / 2 < 0 ? 0 : item.cornerRadiusBottomRight - lineWidth / 2
    let bottomLeft = item.cornerRadiusBottomLeft - lineWidth / 2 < 0 ? 0 : item.cornerRadiusBottomLeft - lineWidth / 2

    let x = item.x + lineWidth / 2
    let y = item.y + lineWidth / 2

    let width = item.width - lineWidth
    let height = item.height - lineWidth

    if (shape === "Circle" || shape === "Rectangle") {
        x += lineWidth / 2;
        y += lineWidth / 2;
        width -= lineWidth;
        height -= lineWidth;
        topLeft = item.cornerRadiusTopLeft - lineWidth < 0 ? 0 : item.cornerRadiusTopLeft - lineWidth;
        topRight = item.cornerRadiusTopRight - lineWidth < 0 ? 0 : item.cornerRadiusTopRight - lineWidth
        bottomRight = item.cornerRadiusBottomRight - lineWidth < 0 ? 0 : item.cornerRadiusBottomRight - lineWidth
        bottomLeft = item.cornerRadiusBottomLeft - lineWidth < 0 ? 0 : item.cornerRadiusBottomLeft - lineWidth
    }

    switch (shape) {
        case "Circle":
            doc.path(drawCircle(x, y, width, height))
            break;
        case "Rectangle":
            doc.path(drawCustomRect(x, y, width, height, [topLeft, topRight, bottomRight, bottomLeft]));
            break;
        default:
            doc.path(drawCustomSVG(x, y, width, height,
                item.svgElement.children[0].width, item.svgElement.children[0].height,
                item.svgElement.width, item.svgElement.height,
                item.svgElement.children[0].x, item.svgElement.children[0].y,
                item.svgElement.children[0].d));
            break;
    }

    doc.fillOpacity(item.alpha*item.opacity);
    doc.fill(item.overlayFill)
    } catch (err) {
        console.log("Fail to add overlay color: ", err)
    }
}

function addOverlayColorStarRating (item, doc) {
    if (item.alpha === 0) return;

    const lineWidth = item.strokeWidth;

    const x = item.x + lineWidth
    const y = item.y + lineWidth

    const width = item.width - lineWidth*2
    const height = item.height - lineWidth*2

    for(let i = 0; i < 5; i++) {
        const gap = i*10;
        doc.path(drawCustomSVG(x + i*width/5 + gap, y, width/5 - gap/2, height,
            svgElement.children[0].width, svgElement.children[0].height,
            svgElement.width, svgElement.height,
            svgElement.children[0].x, svgElement.children[0].y,
            svgElement.children[0].d));
    }
}

function addOverlayColorImage(item, doc) {
    if (item.alpha === 0) return;

    let lineWidth = item.strokeWidth/2;
    const topLeft = item.cornerRadiusTopLeft + lineWidth;
    const topRight = item.cornerRadiusTopRight + lineWidth;
    const bottomRight = item.cornerRadiusBottomRight + lineWidth;
    const bottomLeft = item.cornerRadiusBottomLeft + lineWidth;

    const x = item.x - lineWidth
    const y = item.y - lineWidth

    const width = item.width + lineWidth*2
    const height = item.height + lineWidth*2

    doc.path(drawCustomRect(x, y, width, height, [topLeft, topRight, bottomRight, bottomLeft]));

    doc.fillOpacity(item.alpha*item.opacity);
    doc.fill(item.overlayFill)

}

export {
    addImage,
    addRotate,
    addOpacity,
    addOverlayColor, addOverlayColorStarRating, addOverlayColorImage,
}