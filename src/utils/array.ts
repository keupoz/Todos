export function getFirstItem<T>(arr: T[]): T {
  let result;

  for (const item of arr) {
    result = item;
    break;
  }

  if (result === undefined) {
    throw new Error("Empty array");
  }

  return result;
}
