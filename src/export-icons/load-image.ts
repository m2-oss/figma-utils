import axios from "axios";
import md5 from "md5";

import { SrcImageConfig } from "./config";
import { promises as fs } from "fs";
import path from "path";

export async function loadImage(
  config: SrcImageConfig,
  xFigmaToken: string
): Promise<Uint8Array> {
  config.scale = config.scale || 1;
  config.format = config.format || "svg";
  const cacheDir: string = process.env.CACHE_DIR || "";

  if (config.scale <= 4 && config.scale >= 0.01) {
    try {
      const data = (
        await axios.get(
          `https://api.figma.com/v1/images/${config.figmaProjectID}?ids=${config.frameID}&geometry=paths&format=${config.format}&scale=${config.scale}`,
          {
            headers: { "X-Figma-Token": xFigmaToken },
          }
        )
      ).data;
      const illustration = data.images[config.frameID];

      const hash = md5(illustration);

      let cacheArray: Uint8Array | undefined;
      if (cacheDir.length > 0) {
        try {
          const buffer = await fs.readFile(
            path.resolve(cacheDir, `${hash}.${config.format}`)
          );
          cacheArray = buffer;
        } catch (e) {
          cacheArray = undefined;
        }
        if (cacheArray !== undefined && cacheArray.length > 0) {
          return cacheArray;
        }
      }

      cacheArray = new Uint8Array(
        (
          await axios.get(`${illustration}`, {
            headers: { "X-Figma-Token": xFigmaToken },
            responseType: "arraybuffer",
          })
        ).data
      );

      if (cacheDir.length > 0) {
        if (cacheArray !== undefined && cacheArray.length > 0) {
          fs.writeFile(
            path.resolve(cacheDir, `${hash}.${config.format}`),
            cacheArray
          );
        }
      }

      return cacheArray;
    } catch (e) {
      return new Uint8Array(0);
    }
  }
  return new Uint8Array(0);
}
