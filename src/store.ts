import { z } from "zod";

export interface RawTodoItem extends z.infer<typeof TodoItemSchema> {}
export interface RawTodoList extends z.infer<typeof TodoListSchema> {}

export const TodoItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  done: z.boolean().optional(),
});

export const TodoListSchema = z.object({
  id: z.number(),
  name: z.string(),
  items: TodoItemSchema.array(),
});

function getLastId(name: string): number | null {
  const id = localStorage.getItem(name);

  if (id === null) return null;

  return parseInt(id);
}

export function getListLastId(): number {
  return getLastId("listLastId") ?? 1;
}

export function storeListLastId(id: number): void {
  localStorage.setItem("listLastId", `${id}`);
}

export function getTodoLastId(): number {
  return getLastId("todoLastId") ?? 0;
}

export function storeTodoLastId(id: number): void {
  localStorage.setItem("todoLastId", `${id}`);
}

export function getTodoLists(): RawTodoList[] {
  const items = localStorage.getItem("todoLists");

  if (items === null) return [{ id: 1, name: "Default", items: [] }];

  const json = JSON.parse(items);

  return TodoListSchema.array().parse(json);
}

export function storeTodoLists(lists: RawTodoList[]): void {
  if (lists.length > 0) {
    const stringified = JSON.stringify(lists);
    localStorage.setItem("todoLists", stringified);
  } else {
    localStorage.removeItem("todoLists");
  }
}
