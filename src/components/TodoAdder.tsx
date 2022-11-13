import { createElement, FC, FormEvent, useRef, useState } from "react";

export interface TodoAdderProps {
  onItemAdd: (name: string) => void;
  onClearDone: () => void;
}

export const TodoAdder: FC<TodoAdderProps> = (props) => {
  const [value, setValue] = useState("");
  const [isFocused, setFocused] = useState(false);

  const input = useRef<HTMLInputElement>(null);

  function addItem(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (value.length === 0) {
      input.current?.focus();
    } else {
      props.onItemAdd(value);
      setValue("");
    }
  }

  return (
    <form className="hstack gap-2" onSubmit={addItem}>
      <input
        type="text"
        className="form-control"
        placeholder="Enter task name"
        ref={input}
        value={value}
        onInput={(e) => setValue(e.currentTarget.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      <button
        className="button btn btn-primary hstack gap-2 flex-shrink-0"
        type="submit"
      >
        {!isFocused ? "Add item" : null}
        <i className="fas fa-plus"></i>
      </button>

      <button
        className="button btn btn-outline-danger hstack gap-2 flex-shrink-0"
        type="button"
        onClick={props.onClearDone}
      >
        {!isFocused ? "Clear done" : null}
        <i className="fas fa-trash"></i>
      </button>
    </form>
  );
};
