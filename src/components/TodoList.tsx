import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createElement, FC } from "react";
import { RawTodoItem } from "../store";
import { TodoItem } from "./TodoItem";

export interface TodoListProps {
  items: RawTodoItem[];
  edit: (item: RawTodoItem, edit: (newItem: RawTodoItem) => void) => void;
  onDelete: (item: RawTodoItem) => void;
}

export const TodoList: FC<TodoListProps> = (props) => {
  return (
    <div className="vstack gap-2 flex-grow-1">
      <SortableContext
        items={props.items}
        strategy={verticalListSortingStrategy}
      >
        {props.items.map((item) => (
          <TodoItem
            key={item.id}
            info={item}
            edit={props.edit}
            onDelete={() => props.onDelete(item)}
          />
        ))}
      </SortableContext>
    </div>
  );
};
