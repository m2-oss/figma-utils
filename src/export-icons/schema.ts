import axios from 'axios';
import md5 from 'md5';
import Translit from 'cyrillic-to-translit-js';

import { SrcImagePackConfig } from './config';

const translit = new Translit();

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface MinifiedItem {
    hash: string;
    id: string;
    name: string;
    absoluteBoundingBox: BoundingBox;
    url?: string;
}

export interface MinifiedSchema {
    name: string;
    version: string;
    lastModified: string;
    children: MinifiedItem[];
}

export const itemKey: (item: MinifiedItem) => string = (item: MinifiedItem) => md5(`${item.name}-${item.id}`);

export function convertSchemaToHashMap(schema: MinifiedSchema): {
    [name: string]: string;
} {
    const result: {
        [name: string]: string;
    } = {};
    for (const child of schema.children) {
        result[itemKey(child)] = child.hash;
    }
    return result;
}

async function loadFigmaSchema(figmaId: string, xFigmaToken: string) {
    return (
        await axios.get(`https://api.figma.com/v1/files/${figmaId}`, {
            headers: { 'X-Figma-Token': xFigmaToken },
        })
    ).data;
}

export async function loadMinifiedSchema(config: SrcImagePackConfig, xFigmaToken: string): Promise<MinifiedSchema> {
    const schema = await loadFigmaSchema(config.figmaProjectID, xFigmaToken);

    const children = schema.document.children
        .filter((item: { name: string }) => config.page === item.name.trim())[0]
        .children.filter(
            (item: { name: string; type: string }) =>
                (item.type === 'FRAME' || item.type === 'COMPONENT' || item.type === 'COMPONENT_SET') &&
                config.frameName.indexOf(item.name) >= 0,
        )
        .reduce(
            (acc: any[], item: { children: any[]; name: string }) => [
                ...acc,
                ...item.children.map((i) => ({ ...i, sourceFrame: item.name })),
            ],
            [],
        )
        .filter((item: { name: string; type: string }) => item.type === 'FRAME' || item.type === 'COMPONENT')
        .map((item: { name: string; id: string; absoluteBoundingBox: any; sourceFrame: string }) => {
            const regex = /\s/gi;
            const array = translit
                .transform(item.name)
                .split('/')
                .map(
                    (i) =>
                        i
                            .trim()
                            .replace(regex, '-')
                            .toLowerCase()
                            .replace(/^type=/, ''), // Странный префикс в исходнике
                );
            const name = array.join('--');
            const str = JSON.stringify(item);
            const hash = md5(str + JSON.stringify(config));
            const { absoluteBoundingBox } = item;
            const resultItem: MinifiedItem = {
                id: item.id,
                name,
                hash,
                absoluteBoundingBox,
            };
            return resultItem;
        });
    return {
        name: schema.name,
        version: schema.version,
        lastModified: schema.lastModified,
        children,
    };
}
