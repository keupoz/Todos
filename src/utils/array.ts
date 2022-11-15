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

export function editArrayItem<T>(
  array: T[],
  item: T,
  edit: (newItem: T) => void
): [newArray: T[], newItem: T] {
  const index = array.indexOf(item);

  if (index < 0) return [array, item];

  const newArray = [...array];
  const newItem = { ...item };

  edit(newItem);

  newArray[index] = newItem;

  return [newArray, newItem];
}
