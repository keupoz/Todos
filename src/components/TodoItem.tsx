import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classnames from "classnames";
import { createElement, FC, useState } from "react";
import { RawTodoItem } from "../store";

export interface TodoItemProps {
  info: RawTodoItem;
  onEditName: (name: string) => void;
  onToggleDone: (value: boolean) => void;
  onDelete: () => void;
}

export const TodoItem: FC<TodoItemProps> = (props) => {
  const [editing, setEditing] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.info.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={classnames("card hstack gap-2 px-3 py-2", {
        "text-bg-light": props.info.done,
      })}
      style={style}
    >
      <input
        type="checkbox"
        className="form-check-input m-0 flex-shrink-0"
        checked={props.info.done === true}
        onChange={(e) => props.onToggleDone(e.currentTarget.checked)}
      />

      {editing ? (
        <input
          type="text"
          className="form-control form-control-sm"
          value={props.info.name}
          autoFocus
          onInput={(e) => props.onEditName(e.currentTarget.value)}
          onKeyDown={(e) => (e.key === "Enter" ? setEditing(false) : void 0)}
        />
      ) : (
        <div
          className={classnames("card-text me-auto", {
            "text-decoration-line-through": props.info.done,
            "text-muted": props.info.done,
          })}
        >
          {props.info.name}
        </div>
      )}

      <button
        className="btn btn-outline-primary btn-sm"
        type="button"
        onClick={() => setEditing(!editing)}
      >
        <i className="fas fa-edit"></i>
      </button>

      <button
        className="btn btn-outline-danger btn-sm"
        type="button"
        onClick={props.onDelete}
      >
        <i className="fas fa-trash"></i>
      </button>

      <i
        ref={setNodeRef}
        className="fas fa-grip-lines text-muted ms-2"
        {...listeners}
        {...attributes}
      ></i>
    </div>
  );
};
