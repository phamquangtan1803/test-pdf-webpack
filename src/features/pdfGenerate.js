import { createPDF } from "../pdfSource/app.js";
export const pdfGenerate = async (templateSizeID) => {
  console.log("pdfGenerate");
  await createPDF(templateSizeID);
};
