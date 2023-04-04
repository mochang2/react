export function isPrimitive(value: any): boolean {
  return Object(value) !== value;
}
