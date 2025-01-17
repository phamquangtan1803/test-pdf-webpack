import axios from "axios";
import sharp from "sharp";

const fetchImage = async (src, opacity) => {
    const fetchedImg = await axios.get(src, { responseType: "arraybuffer" });
    const result = await sharp(Buffer.from(fetchedImg.data))
            .ensureAlpha(opacity).toBuffer();
    return result;
}

export {fetchImage};