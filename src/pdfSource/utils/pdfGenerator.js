import PDFDocument from "pdfkit";
import { drawShapes } from "./shapes/drawShapes.js";
import { drawText } from "./text/drawText.js";
import { drawLogo } from "./logo/drawLogo.js";

export const generatePDF = async (data, stream) => {
  const doc = new PDFDocument({ size: [data[0].width, data[0].height] });
  doc.pipe(stream);

  function applyBackground(doc, color) {
    if (color && color.toLowerCase() !== "#ffffff") {
      doc.rect(0, 0, doc.page.width, doc.page.height).fillColor(color).fill();
    }
  }

  for (let i = 0; i < data.length; i++) {
    applyBackground(doc, data[0].background);
    const page = data[i];
    const itemList = page.children;
    for (let j = 0; j < itemList.length; j++) {
      const item = itemList[j];
      switch (item.type) {
        case "shape":
          await drawShapes(item, doc);
          break;
        case "image":
          await drawShapes(item, doc);
          break;
        case "text":
          await drawText(item, doc);
          break;
        case "svg":
          await drawLogo(item, doc);
          break;
        default:
          break;
      }
    }
    if (i !== data.length - 1) doc.addPage({ size: [page.width, page.height] });
  }

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", function () {
      const blob = stream.toBlob("application/pdf");
      resolve(blob);
    });

    stream.on("error", function (err) {
      reject(err);
    });
  });
};
