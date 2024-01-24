export function deepCopyObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
