export function isPrimitive(value: any): boolean {
  return [
    'string',
    'number',
    'bigint',
    'symbol',
    'null',
    'undefined',
    'boolean',
  ].includes(typeof value);
}
