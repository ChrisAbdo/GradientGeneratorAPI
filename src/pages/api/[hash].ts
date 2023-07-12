// @ts-nocheck
import Jimp from "jimp";
import TinyGradient from "tinygradient";
import randomColor from "randomcolor";

export default async ({ req, res }: any) => {
  const { hash } = req.query;

  const color1 = randomColor({ seed: hash, format: "rgb" });
  const color2 = randomColor({ seed: hash + 1, format: "rgb" });

  const gradient = TinyGradient([
    { color: color1, pos: 0 },
    { color: color2, pos: 1 },
  ]);

  const image = new Jimp(100, 100);
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const color = Jimp.rgbaToInt(
      ...gradient
        .rgbAt(x / image.bitmap.width)
        .toRgb()
        .map(Math.round),
      255
    );

    image.bitmap.data[idx + 0] = (color >> 24) & 0xff;
    image.bitmap.data[idx + 1] = (color >> 16) & 0xff;
    image.bitmap.data[idx + 2] = (color >> 8) & 0xff;
    image.bitmap.data[idx + 3] = color & 0xff;
  });

  const buffer = await image.getBufferAsync(Jimp.MIME_PNG);

  res.setHeader("Content-Type", "image/png");
  res.send(buffer);
};
