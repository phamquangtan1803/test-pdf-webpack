import { fetchFont } from "./fetchFont.js";
import PDFDocument from "pdfkit";

const defaultFont = {
  fontPath: {
    path: 'src/utils/text/assets/TimesNewRoman.ttf',
    metadata: null
  },
  fontId: 1,
  s3FilePath: "",
  fontFamily: "Times New Roman",
}

export const generateCharMetadata = async (item, valueList) => {
  const result = []
  let curCharPos = 0;

  const fontList = await fetchFonts(getFontList(valueList))

  let curLine = [];
  const lines = [];
  let maxLineHeight = 0;
  let maxFontSize = 0;
  for (let i = 0; i < valueList.length; i++) {
    if (valueList[i].text !== '\n') {
      curLine.push(valueList[i])
      const fontSize = valueList[i].fontSize
      const lineHeight = valueList[i].lineHeight * fontSize
      if (lineHeight > maxLineHeight) maxLineHeight = lineHeight;
      if (fontSize > maxFontSize) maxFontSize = fontSize;
    } else {
      lines.push({
        largestLineHeight: maxLineHeight,
        lineContent: curLine,
        maxFontSize
      });
      curLine = [];
      maxLineHeight = 0;
    }
  }

  lines.push({
    largestLineHeight: maxLineHeight,
    lineContent: curLine,
    maxFontSize
  });

  lines.forEach(line => {
    line.lineContent.forEach((value) => {
      for (const currentChar of value.text) {
        const doc = new PDFDocument();
        const font = fontList.find(font => font.fontId === value.fontId)
        const charWidth = doc.fontSize(value.fontSize).font(font.fontPath.path).widthOfString(currentChar)

        result.push({
          text: currentChar,
          pos: curCharPos++,
          fill: value.fill,
          letterSpacing: currentChar != " " ? (value.letterSpacing*value.fontSize/100) : 0,
          textDecoration: value.textDecoration,
          maxFontSize: line.maxFontSize,
          fontSize: value.fontSize,
          fontPath: font.fontPath.path,
          lineHeight: line.largestLineHeight,
          align: value.align,
          fontFamily: value.fontFamily,
          fontId: value.fontId,
          textTransform: value.textTransform,
          width: charWidth,
        })
      }
    })
  })

  return result
}

export const getFontList = (valueList) => {
  const seenFontIds = new Set([1]);
  const fontList = valueList.filter(obj => obj.fontId && obj.s3FilePath && obj.fontFamily)
    .filter(({ fontId }) => {
      if (!seenFontIds.has(fontId)) {
        seenFontIds.add(fontId);
        return true;
      }
      return false;
    })
    .map(({ fontId, s3FilePath, fontFamily }) => ({ fontId, s3FilePath, fontFamily }))

  fontList.push(defaultFont)

  return fontList;
}

export const fetchFonts = async (fontList) => {
  for (let i = 0; i < fontList.length; i++) {
    if (fontList[i].s3FilePath !== "") {
      const fontPath = await fetchFont(fontList[i].s3FilePath)
      fontList[i] = {
        fontPath,
        ...fontList[i]
      }
    }
  }

  return fontList
}

const measureWordWidthandHeight = (word, chars) => {
  const wordArray = chars.slice(word.start, word.end);
  const wordWidth = wordArray.reduce((sum, obj) => {
    return sum += (obj.width + (obj.letterSpacing ? obj.letterSpacing : 0))
  }, 0)
  const wordHeight = chars[word.start].lineHeight;

  return {wordWidth, wordHeight}
}

export const generateLineMetadata = (item, valueList, chars) => {
  const text = valueList.map(obj => obj.text).join("")

  const maxWidth = item.width
  let x = item.x
  let y = item.y
  const lines = []
  let currentLine = ""
  let currentWidth = 0;
  let currentPos = 0;

  const linesText = text.split('\n').filter(part => part != "")
  for (let i = 0; i < linesText.length; i++) {
    const words = linesText[i].split(/(\s+)/).filter(part => part !== '');
    for (let j = 0; j < words.length; j++) {
      const wordPos = {
        start: currentPos,
        end: currentPos + words[j].length
      }
      const word = words[j];
      currentPos += words[j].length;
      const {wordWidth, wordHeight} = measureWordWidthandHeight(wordPos, chars)
      if (currentWidth + wordWidth < maxWidth) {
        currentLine += word;
        currentWidth += wordWidth;
      } else {
        lines.push({
          text: currentLine,
          width: currentWidth,
          lineHeight: chars[currentPos - 1].lineHeight
        })
        currentLine = word;
        currentWidth = wordWidth;
      }
    }
    lines.push({
      text: currentLine,
      width: currentWidth,
      lineHeight: chars[currentPos - 1].lineHeight,
    })
    currentLine = "",
    currentWidth = 0;
  }

  return lines
}

export const calcTextLines = async (item, valueList) => {
  const chars = await generateCharMetadata(item, valueList);
  const lines = generateLineMetadata(item, valueList, chars);

  return {
    lines,
    chars
  }
}

