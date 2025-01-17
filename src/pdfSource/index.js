// import { fetchData } from "./services/api/mainAPI.js";
// import { fetchFont } from "./services/api/fontAPI.js";
// import initializeFontClients from "./services/clients/fontClient.js";
// import { generatePDF } from "./utils/pdfGenerator.js";
// import { fileURLToPath } from "url";
// import path from "path";
// import fs from "fs";
import blobStream from "blob-stream";
import PDFDocument from "pdfkit";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export async function createPDF(templateSizeID) {
//   try {
//     const data = await fetchData.get(templateSizeID);

//     let fontClients = await initializeFontClients(data);
//     fetchFont.setClients(fontClients);

//     const timestamp = Date.now();
//     const outputFolder = path.join(__dirname, "../output");
//     const outputPath = path.join(outputFolder, `generated-${timestamp}.pdf`);

//     fs.mkdirSync(outputFolder, { recursive: true });
//     fs.mkdirSync(path.dirname(outputPath), { recursive: true });

//     // Create a blob stream
//     const stream = blobStream();

//     // Pass the stream to the PDF generator
//     await generatePDF(data, stream);

//     // When the stream is finished, create a blob URL and open it
//     stream.on("finish", function () {
//       const url = stream.toBlobURL("application/pdf");
//       window.open(url);
//     });

//     console.log(
//       `PDF generated successfully at ${path.relative(
//         process.cwd(),
//         outputPath
//       )}`
//     );
//   } catch (error) {
//     console.error("Error in main process:", error);
//   }
// }
export function testPdf() {
  // Create a document and pipe to a blob
  const doc = new PDFDocument();
  const stream = doc.pipe(blobStream());

  // Draw some text
  doc.fontSize(25).text("Here is some vector graphics...", 100, 80);

  // Some vector graphics
  doc.save().moveTo(100, 150).lineTo(100, 250).lineTo(200, 250).fill("#FF3300");

  doc.circle(280, 200, 50).fill("#6600FF");

  // An SVG path
  doc
    .scale(0.6)
    .translate(470, 130)
    .path("M 250,75 L 323,301 131,161 369,161 177,301 z")
    .fill("red", "even-odd")
    .restore();

  // A gradient fill
  const gradient = doc
    .linearGradient(100, 300, 200, 300)
    .stop(0, "green")
    .stop(0.5, "red")
    .stop(1, "green");
  doc.rect(100, 300, 100, 100).fill(gradient);

  // Stroke & fill uncolored tiling pattern
  const stripe45d = doc.pattern(
    [1, 1, 4, 4],
    3,
    3,
    "1 w 0 1 m 4 5 l s 2 0 m 5 3 l s"
  );
  doc.circle(280, 350, 50).fill([stripe45d, "blue"]);

  doc
    .rect(380, 300, 100, 100)
    .fillColor("lime")
    .strokeColor([stripe45d, "orange"])
    .lineWidth(5)
    .fillAndStroke();
  doc.restore();

  // And some justified text wrapped into columns
  const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
  doc
    .text("And here is some wrapped text...", 100, 450)
    .font("Times-Roman", 13)
    .moveDown()
    .text(lorem, {
      width: 412,
      align: "justify",
      indent: 30,
      columns: 2,
      height: 300,
      ellipsis: true,
    });

  // End and display the document
  doc.end();
  stream.on("finish", function () {
    const url = stream.toBlobURL("application/pdf");
    window.open(url);
  });

  console.log("testPdf");
}
