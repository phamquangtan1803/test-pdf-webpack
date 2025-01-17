import Konva from "konva";

export function getTextArr(textContent) {
  const {
    width,
    height,
    lineHeight,
    autoFitEnabled,
    textFill,
    letterSpacing,
    text,
    align,
    verticalAlign,
    textTransform,
    textDecoration,
    fontSize,
    fontFamily,
    fontStyle,
  } = textContent;
  const textNode = new Konva.Text({
    width: width,
    height: autoFitEnabled ? height || 1 : undefined,
    opacity: 1,
    lineHeight,
    align,
    verticalAlign,
    textTransform,
    textDecoration,
    wrap: "word",
    autoFitEnabled,
    fontSize: fontSize,
    fill: textFill,
    ellipsis: false,
    fontFamily: fontFamily,
    letterSpacing: letterSpacing,
    text: text,
    fontStyle: fontStyle,
  });

  return textNode.textArr;
}
