export const calculateLogoSize = (logoContainer, logo, options) => {
    const {
      width: containerWidth,
      height: containerHeight,
      x: containerX,
      y: containerY,
    } = logoContainer;
    const { width: originalWidth, height: originalHeight } = logo;
    const {
      paddingTop = true,
      paddingRight = true,
      paddingBottom = true,
      paddingLeft = true,
    } = options;
    let logoPadding;
    const paddingRatio = options?.paddingRatio ? options?.paddingRatio : 1;
  
    const ratio = Math.round((originalWidth / originalHeight) * 100);
    if (ratio < 62.5) {
      logoPadding = originalWidth;
    } else if (62.5 <= ratio && ratio <= 100) {
      logoPadding = originalWidth / 2;
    } else if (100 < ratio && ratio <= 160) {
      logoPadding = originalHeight / 2;
    } else {
      logoPadding = originalHeight;
    }
    logoPadding = logoPadding * paddingRatio;
  
    const imageBoxPaddingHorizontal =
      (paddingRight ? logoPadding : 0) + (paddingLeft ? logoPadding : 0);
    const imageBoxPaddingVertical =
      (paddingTop ? logoPadding : 0) + (paddingBottom ? logoPadding : 0);
  
    const imageBoxWidth = originalWidth + imageBoxPaddingHorizontal;
    const imageBoxHeight = originalHeight + imageBoxPaddingVertical;
  
    const scaleY = containerHeight / imageBoxHeight;
    const scaleX = containerWidth / imageBoxWidth;
    const scaleImageBox = scaleX > scaleY ? scaleY : scaleX;
    const containerPadding = logoPadding * scaleImageBox;
  
    const containerPaddingTop = paddingTop ? containerPadding : 0;
    const containerPaddingRight = paddingRight ? containerPadding : 0;
    const containerPaddingBottom = paddingBottom ? containerPadding : 0;
    const containerPaddingLeft = paddingLeft ? containerPadding : 0;
  
    const scaleWidth = scaleImageBox * imageBoxWidth;
    const scaleHeight = scaleImageBox * imageBoxHeight;
    const imageWidth = scaleWidth - containerPaddingRight - containerPaddingLeft;
    const imageHeight = scaleHeight - containerPaddingTop - containerPaddingBottom;
  
    const imagePaddingLeft = paddingLeft
      ? paddingRight
        ? (containerWidth - imageWidth) / 2
        : containerWidth - imageWidth
      : 0;
    const imagePaddingTop = paddingTop
      ? paddingBottom
        ? (containerHeight - imageHeight) / 2
        : containerHeight - imageHeight
      : 0;
  
    const imageX = containerX + imagePaddingLeft;
    const imageY = containerY + imagePaddingTop;
  
    return {
      x: Math.round(parseFloat(imageX)),
      y: Math.round(parseFloat(imageY)),
      width: Math.round(imageWidth),
      height: Math.round(imageHeight),
      paddingX: Math.round(imagePaddingLeft),
      paddingY: Math.round(imagePaddingTop),
    };
  };