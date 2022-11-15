import { createElement, FC, FormEvent, Fragment, useState } from "react";
import { RawTodoList } from "../store";

export interface ListSelectorProps {
  lists: RawTodoList[];
  current: RawTodoList;
  onSelect: (list: RawTodoList) => void;
  onNewList: (name: string) => void;
  onEdit: (list: RawTodoList, edit: (newList: RawTodoList) => void) => void;
  onDelete: (list: RawTodoList) => void;
}

type EditingState = [enabled: boolean, addingNew: boolean];

export const ListSelector: FC<ListSelectorProps> = (props) => {
  const [value, setValue] = useState("");
  const [[editing, addingNew], setEditing] = useState<EditingState>([
    false,
    false,
  ]);

  function select(id: number): void {
    const list = props.lists.find((list) => list.id === id);

    if (list === undefined) return;

    props.onSelect(list);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (value.length > 0) {
      if (addingNew) {
        props.onNewList(value);
      } else {
        props.onEdit(props.current, (newList) => {
          newList.name = value;
        });
      }

      setValue("");
      setEditing([false, false]);
    }
  }

  return (
    <div className="hstack gap-2">
      {editing ? (
        <form className="flex-grow-1" onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter list name"
            autoFocus
            value={value}
            onInput={(e) => setValue(e.currentTarget.value)}
            onBlur={() => setEditing([false, false])}
          />
        </form>
      ) : (
        <>
          <select
            className="form-select"
            value={props.current.id}
            onChange={(e) => select(parseInt(e.currentTarget.value))}
          >
            {props.lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>

          <button
            className="btn btn-outline-primary"
            onClick={() => {
              setEditing([true, false]);
              setValue(props.current.name);
            }}
          >
            <i className="fas fa-edit"></i>
          </button>

          {props.lists.length > 1 ? (
            <button
              className="btn btn-outline-danger"
              onClick={() => props.onDelete(props.current)}
            >
              <i className="fas fa-trash"></i>
            </button>
          ) : null}
        </>
      )}

      <button
        className="btn btn-primary hstack gap-2 flex-shrink-0"
        type="button"
        onClick={() => {
          setEditing([true, true]);
          setValue("");
        }}
      >
        New list
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
};
