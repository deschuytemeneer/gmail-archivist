import { join as pathJoin } from 'path';
import { promises as fs } from 'fs';
import { format } from 'prettier';
import { parse } from 'recast';

import { AST } from './typechecks';

export async function loadFixture(name: string, shouldParse?: false): Promise<string>;
export async function loadFixture(name: string, shouldParse?: true): Promise<AST>;
export async function loadFixture(name: string, shouldParse = false): Promise<unknown> {
  const contents = await fs.readFile(pathJoin(__dirname, '__fixtures__', name), 'utf-8');
  return shouldParse ? (parse(contents) as AST) : contents;
}

export function normalize(code: string): string {
  return format(code, { parser: 'babel' });
}
