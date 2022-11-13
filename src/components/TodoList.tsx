import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createElement, FC } from "react";
import { RawTodoItem } from "../store";
import { TodoItem } from "./TodoItem";

export interface TodoListProps {
  items: RawTodoItem[];
  onEdit: (item: RawTodoItem, edit: (newItem: RawTodoItem) => void) => void;
  onDelete: (item: RawTodoItem) => void;
}

export const TodoList: FC<TodoListProps> = (props) => {
  function editName(item: RawTodoItem, newName: string): void {
    props.onEdit(item, (newItem) => {
      newItem.name = newName;
    });
  }

  function toggleDone(item: RawTodoItem, newValue: boolean): void {
    props.onEdit(item, (newItem) => {
      if (newValue) {
        newItem.done = true;
      } else {
        delete newItem.done;
      }
    });
  }

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
            onEditName={(newName) => editName(item, newName)}
            onToggleDone={(newValue) => toggleDone(item, newValue)}
            onDelete={() => props.onDelete(item)}
          />
        ))}
      </SortableContext>
    </div>
  );
};
