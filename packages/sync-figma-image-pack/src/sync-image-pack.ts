import md5 from 'md5';
import svgToPng from 'svg-render';

import Translit from 'cyrillic-to-translit-js';

const translit = new Translit();

import { loadFigmaImage } from '@m2-oss/load-figma-image';

import { DstFigmaImagePackConfig, ImageFigmaPackConfig } from './types';
import { BoundingBox, loadMinifiedFigmaSchema, MinifiedItem, MinifiedSchema } from './schema';
import { promises as fs } from 'fs';
import path from 'path';

export const schemaKey: (imagePack: ImageFigmaPackConfig) => string = (imagePack: ImageFigmaPackConfig) =>
    md5(`${JSON.stringify(imagePack)}`);

export const frameKey: (item: MinifiedItem, config: ImageFigmaPackConfig) => string = (
    item: MinifiedItem,
    config: ImageFigmaPackConfig,
) => md5(`${item.hash}${JSON.stringify(config)}`);

async function saveSchemasToCache(
    minifiedSchemas: MinifiedSchema[],
    configs: ImageFigmaPackConfig[],
    cacheDir: string,
): Promise<void> {
    if (minifiedSchemas.length !== configs.length) {
        throw new Error('minifiedSchemas.length !== configs.length');
    }

    const fileWrites = [];
    for (let i = 0; i < configs.length; i++) {
        fileWrites.push(
            fs.writeFile(
                path.resolve(cacheDir, `${schemaKey(configs[i])}.json`),
                JSON.stringify(minifiedSchemas[i], null, '\t'),
            ),
        );
    }
    await Promise.all(fileWrites);
}

async function loadHashMap(configs: ImageFigmaPackConfig[], cacheDir: string): Promise<Map<string, string>> {
    const map: Map<string, string> = new Map<string, string>();
    if (!cacheDir) {
        return map;
    }
    for (const config of configs) {
        try {
            const file = await fs.readFile(path.resolve(cacheDir, `${schemaKey(config)}.json`));
            const schema = JSON.parse(file.toString()) as MinifiedSchema;
            for (const item of schema.children) {
                map.set(frameKey(item, config), item.hash);
            }
        } catch (e) {
            console.info(e);
        }
    }
    return map;
}

async function loadSchemasFromFigma(configs: ImageFigmaPackConfig[], xFigmaToken: string): Promise<MinifiedSchema[]> {
    const schemaLoaders = [];
    for (const i of configs) {
        const loader = loadMinifiedFigmaSchema(i.src, xFigmaToken);
        if (loader) {
            schemaLoaders.push(loader);
        }
    }
    return Promise.all(schemaLoaders);
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

interface DstSizes {
    width: number;
    height: number;
    scale: number;
}
function getDstSizes(dstConfig: DstFigmaImagePackConfig, absoluteBoundingBox: BoundingBox): DstSizes {
    let scale = 1;
    let width = absoluteBoundingBox.width;
    let height = absoluteBoundingBox.height;
    if (dstConfig.height) {
        scale = dstConfig.height / absoluteBoundingBox.height;
        height = dstConfig.height;
        width = Math.ceil(absoluteBoundingBox.width * scale);
    } else if (dstConfig.width) {
        scale = dstConfig.width / absoluteBoundingBox.width;
        width = dstConfig.width;
        height = Math.ceil(absoluteBoundingBox.height * scale);
    }
    return { scale, width, height };
}

export function calculateFileName(config: DstFigmaImagePackConfig, item: MinifiedItem, dstSizes: DstSizes): string {
    return `${translit.transform(item.name)}-${dstSizes.width}x${dstSizes.height}.${config.format}`.toLowerCase();
}

async function downloadImage(config: ImageFigmaPackConfig, item: MinifiedItem, xFigmaToken: string, targetDir: string) {
    const folder = path.resolve(targetDir, config.dst.folder);
    await fs.mkdir(folder, { recursive: true });
    const dstSizes = getDstSizes(config.dst, item.absoluteBoundingBox);
    let buffer = await loadFigmaImage(
        {
            figmaProjectID: config.src.figmaProjectID,
            frameID: item.id,
        },
        xFigmaToken,
    );
    if (buffer === undefined) {
        return;
    }
    if (config.dst.color !== undefined) {
        const value = buffer
            .toString()
            .replace(/(<(path|circle).*)fill="#[a-zA-Z0-9]{6}"(\/>)/gm, `$1fill="${config.dst.color}"$3`);
        buffer = Buffer.from(value, 'utf8');
    }
    let uint8Array: Uint8Array = buffer;
    if (config.dst.format === 'png') {
        try {
            uint8Array = await svgToPng({
                buffer: buffer,
                width: dstSizes.width,
                height: dstSizes.height,
            });
        } catch (e) {
            console.info(e);
            return;
        }
    }
    if (uint8Array.length > 0) {
        await fs.writeFile(
            path.resolve(targetDir, config.dst.folder, calculateFileName(config.dst, item, dstSizes)),
            uint8Array,
        );
    }
}

export async function syncImagePack(
    configs: ImageFigmaPackConfig[],
    xFigmaToken: string,
    targetDir: string,
): Promise<void> {
    const cacheDir: string = process.env.CACHE_DIR || '';
    await fs.mkdir(targetDir, { recursive: true });

    const minifiedSchemasFromFigma = await loadSchemasFromFigma(configs, xFigmaToken);
    const caches = await loadHashMap(configs, cacheDir);

    let loaders = [];
    for (let i = 0; i < configs.length; i++) {
        const config = configs[i];
        const minifiedSchema = minifiedSchemasFromFigma[i];
        for (const item of minifiedSchema.children) {
            const key = md5(item.hash + JSON.stringify(config));
            if (caches.get(key) !== item.hash) {
                loaders.push(downloadImage(config, item, xFigmaToken, targetDir));
            }
            // защита от одновременных обращений
            if (loaders.length >= 50) {
                await Promise.all(loaders);
                await sleep(80000);
                loaders = [];
            }
        }
    }

    if (cacheDir) {
        await saveSchemasToCache(minifiedSchemasFromFigma, configs, cacheDir);
    }
}
