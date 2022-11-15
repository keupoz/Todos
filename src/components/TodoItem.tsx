import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classnames from "classnames";
import { createElement, FC, FormEvent, Fragment, useState } from "react";
import { RawTodoItem } from "../store";

export interface TodoItemProps {
  info: RawTodoItem;
  edit: (item: RawTodoItem, edit: (newItem: RawTodoItem) => void) => void;
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

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    setEditing(false);
  }

  function setName(name: string): void {
    props.edit(props.info, (newInfo) => {
      newInfo.name = name;
    });
  }

  function setDone(done: boolean): void {
    props.edit(props.info, (newInfo) => {
      if (done) {
        newInfo.done = true;
      } else {
        delete newInfo.done;
      }
    });
  }

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
        onChange={(e) => setDone(e.currentTarget.checked)}
      />

      {editing ? (
        <form className="flex-grow-1" onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control form-control-sm"
            value={props.info.name}
            autoFocus
            onInput={(e) => setName(e.currentTarget.value)}
            onBlur={() => setEditing(false)}
          />
        </form>
      ) : (
        <>
          <div
            className={classnames("card-text me-auto", {
              "text-decoration-line-through": props.info.done,
              "text-muted": props.info.done,
            })}
          >
            {props.info.name}
          </div>

          <button
            className="btn btn-outline-primary btn-sm"
            type="button"
            onClick={() => setEditing(true)}
          >
            <i className="fas fa-edit"></i>
          </button>
        </>
      )}

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
