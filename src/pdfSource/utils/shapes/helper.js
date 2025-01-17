import svgPath from "svgpath";
import { addImage } from "./addPropsToDoc.js";
import sharp from "sharp";
import { SVG_WIDTH_HEIGHT } from "../../constant/svg.js";
const svgElement = {
  svgString:
    '<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">\n<path d="M17 0L21 13H34L23 21L27 34L17 26L7 34L11 21L0 13H13L17 0Z" fill="#8F8F8F"/>\n</svg>\n',
  svgUrl:
    "https://stg-template-static.obello.com/Static/Graphics/Shape-Star5point.svg",
  x: 0,
  y: 0,
  width: SVG_WIDTH_HEIGHT,
  height: SVG_WIDTH_HEIGHT,
  svgWidth: SVG_WIDTH_HEIGHT,
  svgHeight: SVG_WIDTH_HEIGHT,
  children: [
    {
      type: "path",
      d: "M17 0L21 13H34L23 21L27 34L17 26L7 34L11 21L0 13H13L17 0Z",
      fill: "#8F8F8F",
      stroke: null,
      strokeWidth: 0,
    },
  ],
};
function drawCustomRect(x, y, width, height, radii) {
  const [topLeft, topRight, bottomRight, bottomLeft] = radii;
  const svgString =
    "M " +
    (x + topLeft) +
    " " +
    y +
    "A " +
    topLeft +
    " " +
    topLeft +
    " 0 0 0 " +
    x +
    " " +
    (y + topLeft) +
    "L " +
    x +
    " " +
    (y + height - bottomLeft) +
    "A " +
    bottomLeft +
    " " +
    bottomLeft +
    " 0 0 0 " +
    (x + bottomLeft) +
    " " +
    (y + height) +
    "L " +
    (x + width - bottomRight) +
    " " +
    (y + height) +
    "A " +
    bottomRight +
    " " +
    bottomRight +
    " 0 0 0 " +
    (x + width) +
    " " +
    (y + height - bottomRight) +
    "L " +
    (x + width) +
    " " +
    (y + topRight) +
    "A " +
    topRight +
    " " +
    topRight +
    " 0 0 0 " +
    (x + width - topRight) +
    " " +
    y +
    "L " +
    (x + topLeft) +
    " " +
    y +
    "Z";
  return svgString;
}

function drawCircle(x, y, width, height) {
  const radius = Math.min(width, height) / 2;

  return drawCustomRect(x, y, width, height, [radius, radius, radius, radius]);
}

function drawCustomSVG(
  x,
  y,
  width,
  height,
  pathWidth,
  pathHeight,
  svgWidth,
  svgHeight,
  pathX,
  pathY,
  path
) {
  const scaleX = pathWidth === undefined ? width / svgWidth : width / pathWidth;
  const scaleY =
    pathHeight === undefined ? height / svgHeight : height / pathHeight;

  return svgPath(path)
    .translate(
      pathX !== undefined ? -pathX : 0,
      pathY !== undefined ? -pathY : 0
    )
    .scale(scaleX, scaleY)
    .translate(x, y)
    .toString();
}

function calculateAngleFromTan(x, y) {
  if (x < 0 && y > 0) return 180 + (Math.atan(y / x) * 180) / Math.PI;
  if (x < 0 && y < 0) return -90 - (Math.atan(y / x) * 180) / Math.PI;

  return (Math.atan(y / x) * 180) / Math.PI;
}

async function createFiller(item, doc, shape) {
  try {
    let lineWidth = item.stroke === "transparent" ? 0 : item.strokeWidth;
    if (shape === "Circle" || shape === "Rectangle") lineWidth /= 2;
    let topLeft =
      item.cornerRadiusTopLeft - lineWidth / 2 < 0
        ? 0
        : item.cornerRadiusTopLeft - lineWidth / 2;
    let topRight =
      item.cornerRadiusTopRight - lineWidth / 2 < 0
        ? 0
        : item.cornerRadiusTopRight - lineWidth / 2;
    let bottomRight =
      item.cornerRadiusBottomRight - lineWidth / 2 < 0
        ? 0
        : item.cornerRadiusBottomRight - lineWidth / 2;
    let bottomLeft =
      item.cornerRadiusBottomLeft - lineWidth / 2 < 0
        ? 0
        : item.cornerRadiusBottomLeft - lineWidth / 2;

    let x = item.x + lineWidth / 2;
    let y = item.y + lineWidth / 2;

    let width = item.width - lineWidth;
    let height = item.height - lineWidth;

    if (shape === "Circle" || shape === "Rectangle") {
      x += lineWidth / 2;
      y += lineWidth / 2;
      width -= lineWidth;
      height -= lineWidth;
      topLeft =
        item.cornerRadiusTopLeft - lineWidth < 0
          ? 0
          : item.cornerRadiusTopLeft - lineWidth;
      topRight =
        item.cornerRadiusTopRight - lineWidth < 0
          ? 0
          : item.cornerRadiusTopRight - lineWidth;
      bottomRight =
        item.cornerRadiusBottomRight - lineWidth < 0
          ? 0
          : item.cornerRadiusBottomRight - lineWidth;
      bottomLeft =
        item.cornerRadiusBottomLeft - lineWidth < 0
          ? 0
          : item.cornerRadiusBottomLeft - lineWidth;
    }

    switch (shape) {
      case "Circle":
        doc.path(drawCircle(x, y, width, height));
        break;
      case "Rectangle":
        doc.path(
          drawCustomRect(x, y, width, height, [
            topLeft,
            topRight,
            bottomRight,
            bottomLeft,
          ])
        );
        break;
      default:
        doc.path(
          drawCustomSVG(
            x,
            y,
            width,
            height,
            item.svgElement.children[0].width,
            item.svgElement.children[0].height,
            item.svgElement.width,
            item.svgElement.height,
            item.svgElement.children[0].x,
            item.svgElement.children[0].y,
            item.svgElement.children[0].d
          )
        );
        break;
    }

    if (item.src !== "") {
      doc.fillColor("transparent");
      await addImage(item, doc);
    }

    if (item.src === "" && item.fill !== "transparent") {
      doc.fill(item.fill);
    }

    if (item.src === "" && item.fill === "transparent") {
      doc.fillOpacity(0);
      doc.fill();
    }
  } catch (error) {
    console.log("Add filler fail: ", error);
  }
}

function createFillerStarRating(item, doc) {
  const x = item.x;
  const y = item.y;

  const width = item.width;
  const height = item.height;

  const scale = width / svgElement.width;
  const gap = 0.5 * scale;
  const elementWidth = (width - gap * 4) / 5;

  for (let i = 0; i < 5; i++) {
    doc.path(
      drawCustomSVG(
        x + i * elementWidth + i * gap,
        y,
        elementWidth,
        height,
        svgElement.children[0].width,
        svgElement.children[0].height,
        svgElement.width,
        svgElement.height,
        svgElement.children[0].x,
        svgElement.children[0].y,
        svgElement.children[0].d
      )
    );
  }

  if (item.src === "" && item.fill !== "transparent") {
    doc.fill(item.fill);
  }

  if (item.src === "" && item.fill === "transparent") {
    doc.fillOpacity(0);
    doc.strokeOpacity(0);
    doc.stroke();
    doc.restore();
  }
}

async function createFillerImage(item, doc) {
  let lineWidth = item.strokeWidth;
  const topLeft =
    item.cornerRadiusTopLeft - lineWidth < 0
      ? 0
      : item.cornerRadiusTopLeft - lineWidth;
  const topRight =
    item.cornerRadiusTopRight - lineWidth < 0
      ? 0
      : item.cornerRadiusTopRight - lineWidth;
  const bottomRight =
    item.cornerRadiusBottomRight - lineWidth < 0
      ? 0
      : item.cornerRadiusBottomRight - lineWidth;
  const bottomLeft =
    item.cornerRadiusBottomLeft - lineWidth < 0
      ? 0
      : item.cornerRadiusBottomLeft - lineWidth;

  const x = item.x + lineWidth;
  const y = item.y + lineWidth;

  const width = item.width - lineWidth * 2;
  const height = item.height - lineWidth * 2;

  doc.path(
    drawCustomRect(x, y, width, height, [
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
    ])
  );
  if (item.src === "" && item.fill === "transparent") {
    doc.fillOpacity(0);
    doc.strokeOpacity(0);
    doc.stroke();
    doc.restore();
    return;
  }
  await addImage(item, doc);
}

function createStroke(item, doc, shape) {
  let lineWidth = item.stroke === "transparent" ? 0 : item.strokeWidth;
  if (shape === "Circle" || shape === "Rectangle") lineWidth /= 2;
  let topLeft =
    item.cornerRadiusTopLeft - lineWidth / 2 < 0
      ? 0
      : item.cornerRadiusTopLeft - lineWidth / 2;
  let topRight =
    item.cornerRadiusTopRight - lineWidth / 2 < 0
      ? 0
      : item.cornerRadiusTopRight - lineWidth / 2;
  let bottomRight =
    item.cornerRadiusBottomRight - lineWidth / 2 < 0
      ? 0
      : item.cornerRadiusBottomRight - lineWidth / 2;
  let bottomLeft =
    item.cornerRadiusBottomLeft - lineWidth / 2 < 0
      ? 0
      : item.cornerRadiusBottomLeft - lineWidth / 2;

  let x = item.x;
  let y = item.y;

  let width = item.width;
  let height = item.height;

  if (shape === "Circle" || shape === "Rectangle") {
    x += lineWidth / 2;
    y += lineWidth / 2;
    width -= lineWidth;
    height -= lineWidth;
  }

  switch (shape) {
    case "Circle":
      doc.path(drawCircle(x, y, width, height));
      break;
    case "Rectangle":
      doc.path(
        drawCustomRect(x, y, width, height, [
          topLeft,
          topRight,
          bottomRight,
          bottomLeft,
        ])
      );
      break;
    default:
      doc.path(
        drawCustomSVG(
          x,
          y,
          width,
          height,
          item.svgElement.children[0].width,
          item.svgElement.children[0].height,
          item.svgElement.width,
          item.svgElement.height,
          item.svgElement.children[0].x,
          item.svgElement.children[0].y,
          item.svgElement.children[0].d
        )
      );
      break;
  }

  doc.fillOpacity(0);
  const hasStroke = item.stroke !== undefined && item.stroke !== "transparent";
  doc.lineWidth(!hasStroke ? 0 : lineWidth);
  if (item.elementType === "image") {
    doc.lineWidth(item.strokeWidth);
  }

  if (!hasStroke) {
    doc.strokeOpacity(0);
    doc.stroke();
    return;
  }

  doc.stroke(item.stroke);
}

function createStrokeStarRating(item, doc) {
  const x = item.x;
  const y = item.y;

  const width = item.width;
  const height = item.height;

  const scale = width / svgElement.width;
  const gap = 0.5 * scale;
  const elementWidth = (width - gap * 4) / 5;

  for (let i = 0; i < 5; i++) {
    doc.path(
      drawCustomSVG(
        x + i * elementWidth + i * gap,
        y,
        elementWidth,
        height,
        svgElement.children[0].width,
        svgElement.children[0].height,
        svgElement.width,
        svgElement.height,
        svgElement.children[0].x,
        svgElement.children[0].y,
        svgElement.children[0].d
      )
    );
  }

  doc.fillOpacity(0);
  const hasStroke = item.stroke !== undefined && item.stroke !== "transparent";
  doc.lineWidth(hasStroke ? item.strokeWidth / 5 : 0);

  if (!hasStroke) {
    doc.strokeOpacity(0);
  }

  doc.stroke(item.stroke);
}

function createStrokeImage(item, doc) {
  let lineWidth = item.strokeWidth / 2;
  const topLeft =
    item.cornerRadiusTopLeft - lineWidth < 0
      ? 0
      : item.cornerRadiusTopLeft - lineWidth;
  const topRight =
    item.cornerRadiusTopRight - lineWidth < 0
      ? 0
      : item.cornerRadiusTopRight - lineWidth;
  const bottomRight =
    item.cornerRadiusBottomRight - lineWidth < 0
      ? 0
      : item.cornerRadiusBottomRight - lineWidth;
  const bottomLeft =
    item.cornerRadiusBottomLeft - lineWidth < 0
      ? 0
      : item.cornerRadiusBottomLeft - lineWidth;

  const x = item.x + lineWidth;
  const y = item.y + lineWidth;

  const width = item.width - lineWidth * 2;
  const height = item.height - lineWidth * 2;

  doc.path(
    drawCustomRect(x, y, width, height, [
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
    ])
  );

  doc.fillOpacity(0);
  const hasStroke = item.stroke !== undefined && item.stroke !== "transparent";
  doc.lineWidth(hasStroke ? item.strokeWidth : 0);

  if (!hasStroke) {
    doc.strokeOpacity(0);
  }

  doc.stroke(item.stroke);
}

async function createShadow(item, doc, shape) {
  let svgString = "";
  const shadowColor =
    item.shadowColor === "undefined" ? "none" : item.shadowColor;
  let shadowOpacity = 0;

  if (item.shadowColor === "undefined") {
    shadowOpacity = 1;
  }

  if (item.shadowColor !== "undefined" && item.shadowColor !== undefined) {
    shadowOpacity = item.shadowOpacity;
  }

  const lineWidth =
    item.stroke !== "transparent" &&
    item.stroke != undefined &&
    item.stroke != null &&
    item.name != "Circle" &&
    item.name != "Rectangle"
      ? item.strokeWidth
      : 0;
  const width = item.width + lineWidth * 2;
  const height = item.height + lineWidth * 2;

  let path = "";

  // let shape_ = shape;
  // if (item.src !== "") shape_ = "image";
  switch (shape) {
    case "Circle":
      {
        path = drawCircle(0, 0, width, height);
      }
      break;
    case "Rectangle":
      {
        const topLeft =
          item.cornerRadiusTopLeft > 0
            ? item.cornerRadiusTopLeft + lineWidth
            : 0;
        const topRight =
          item.cornerRadiusTopRight > 0
            ? item.cornerRadiusTopRight + lineWidth
            : 0;
        const bottomRight =
          item.cornerRadiusBottomRight > 0
            ? item.cornerRadiusBottomRight + lineWidth
            : 0;
        const bottomLeft =
          item.cornerRadiusBottomLeft > 0
            ? item.cornerRadiusBottomLeft + lineWidth
            : 0;
        path = drawCustomRect(0, 0, width, height, [
          topLeft,
          topRight,
          bottomLeft,
          bottomRight,
        ]);
      }
      break;
    // case "image": {
    //     const imageBuffer = await fetchImage(item.src, item.opacity);
    //     path = await processImageFromBuffer(imageBuffer);
    // }
    //     break;
    default:
      {
        path = drawCustomSVG(
          0,
          0,
          width,
          height,
          item.svgElement.children[0].width,
          item.svgElement.children[0].height,
          item.svgElement.width,
          item.svgElement.height,
          item.svgElement.children[0].x,
          item.svgElement.children[0].y,
          item.svgElement.children[0].d
        );
      }
      break;
  }

  const svg = svgPath(path)
    .translate(
      Math.max(-item.shadowOffsetX, 0),
      Math.max(-item.shadowOffsetY, 0)
    )
    .toString();

  svgString = `<svg width="2000"
    height="2000"
    xmlns="http://www.w3.org/2000/svg">
    <defs>
        <filter x="-100%" y="-100%" width="500%" height="500%" id="shadow">
            <feOffset in="SourceGraphic" dx="${item.shadowBlur}" dy="${
    item.shadowBlur
  }" />
            <feGaussianBlur stdDeviation="${item.shadowBlur / 2}" />
        </filter>
    </defs>
    <path d="${svg}" fill="${shadowColor}" opacity="${
    shadowOpacity * item.opacity
  }" filter="url(#shadow)" />
</svg>`;

  const image = await sharp(Buffer.from(svgString)).png().toBuffer();
  doc
    .save()
    .rotate(item.rotation, {
      origin: [item.x + item.shadowOffsetX, item.y + item.shadowOffsetY],
    })
    .image(
      image,
      item.x + item.shadowOffsetX - item.shadowBlur,
      item.y + item.shadowOffsetY - item.shadowBlur,
      {
        width: 2000,
        height: 2000,
      }
    );
  doc.restore();
}

export {
  createShadow,
  drawCustomRect,
  drawCustomSVG,
  drawCircle,
  createFiller,
  createFillerStarRating,
  createFillerImage,
  createStroke,
  createStrokeStarRating,
  createStrokeImage,
  calculateAngleFromTan,
};
