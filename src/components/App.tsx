import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { arrayMove } from "@dnd-kit/sortable";
import { createElement, FC, useEffect, useState } from "react";
import {
  getListLastId,
  getTodoLastId,
  getTodoLists,
  RawTodoItem,
  RawTodoList,
  storeListLastId,
  storeTodoLastId,
  storeTodoLists,
} from "../store";
import { editArrayItem, getFirstItem } from "../utils/array";
import { ListSelector } from "./ListSelector";
import { TodoAdder } from "./TodoAdder";
import { TodoList } from "./TodoList";

export const App: FC = () => {
  const [listLastId, setListLastId] = useState(getListLastId);
  const [itemLastId, setItemLastId] = useState(getTodoLastId);

  const [lists, setLists] = useState(getTodoLists);

  const [currentList, setCurrentList] = useState(() => getFirstItem(lists));

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    storeListLastId(listLastId);
  }, [listLastId]);

  useEffect(() => {
    storeTodoLastId(itemLastId);
  }, [itemLastId]);

  useEffect(() => {
    storeTodoLists(lists);
  }, [lists]);

  function addList(name: string): void {
    const id = listLastId + 1;
    const newList: RawTodoList = { id, name, items: [] };

    setLists([...lists, newList]);
    setListLastId(id);
    setCurrentList(newList);
  }

  function deleteList(list: RawTodoList): void {
    const newLists = lists.filter((l) => l !== list);
    setLists(newLists);
    setCurrentList(getFirstItem(newLists));
  }

  function editList(
    list: RawTodoList,
    edit: (newList: RawTodoList) => void
  ): void {
    const [newLists, newList] = editArrayItem(lists, list, edit);

    setLists(newLists);
    setCurrentList(newList);
  }

  function addItem(name: string): void {
    const id = itemLastId + 1;

    editList(currentList, (newList) => {
      newList.items = [...newList.items, { id, name }];
    });

    setItemLastId(id);
  }

  function deleteItem(item: RawTodoItem): void {
    editList(currentList, (newList) => {
      newList.items = newList.items.filter((i) => i !== item);
    });
  }

  function editItem(
    item: RawTodoItem,
    edit: (newItem: RawTodoItem) => void
  ): void {
    editList(currentList, (newList) => {
      const [newItems] = editArrayItem(newList.items, item, edit);
      newList.items = newItems;
    });
  }

  function clearDone(): void {
    editList(currentList, (newList) => {
      newList.items = newList.items.filter((item) => !item.done);
    });
  }

  function handleDragEnd(e: DragEndEvent): void {
    const { active, over } = e;

    if (active.id !== over?.id) {
      editList(currentList, (newList) => {
        const oldIndex = newList.items.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = newList.items.findIndex(
          (item) => item.id === over?.id
        );

        newList.items = arrayMove(newList.items, oldIndex, newIndex);
      });
    }
  }

  function clearData(): void {
    localStorage.clear();

    setListLastId(getListLastId());
    setItemLastId(getTodoLastId());

    const lists = getTodoLists();

    setLists(lists);
    setCurrentList(getFirstItem(lists));
  }

  return (
    <div className="container py-2 vstack gap-2 min-vh-100">
      <ListSelector
        lists={lists}
        current={currentList}
        onNewList={addList}
        onEdit={editList}
        onDelete={deleteList}
        onSelect={setCurrentList}
      />

      <TodoAdder onItemAdd={addItem} onClearDone={clearDone} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        onDragEnd={handleDragEnd}
      >
        <TodoList
          items={currentList.items}
          edit={editItem}
          onDelete={deleteItem}
        />
      </DndContext>

      <button
        className="btn btn-outline-danger"
        type="button"
        onClick={clearData}
      >
        Delete all data
      </button>
    </div>
  );
};
