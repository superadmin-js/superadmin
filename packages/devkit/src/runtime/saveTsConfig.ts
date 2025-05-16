import { saveFile } from '@nzyme/project-utils';
import type { TsConfigJson } from 'type-fest';

/**
 *
 */
export async function saveTsConfig(path: string, tsConfig: TsConfigJson) {
    await saveFile(path, JSON.stringify(tsConfig, null, 2));
}
