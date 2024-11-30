import { useMemo } from "react";

import { useTodoList } from "./useTodoList";
import Item from "./Item";
import { TodoItem } from "./models/TodoItem";

export default function TodoList() {
  const { todoList, isLoading, error, markAsComplete } = useTodoList();

  const items = useMemo(() => {
    return todoList
      .sort((prev: TodoItem, next: TodoItem) => {
        if (!prev.dueDate) {
          return 1;
        } else if (!next.dueDate) {
          return -1;
        }
        return +new Date(prev.dueDate) - +new Date(next.dueDate);
      })
      .sort((prev, next) => +prev.isComplete - +next.isComplete);
  }, [todoList]);

  if (isLoading) {
    return <div className="spinner-xl"></div>;
  }

  if (error) {
    return <div className="text-red-600 px-1">{error}</div>;
  }

  return (
    <div className="w-full flex justify-center px-1">
      <div className="w-[30rem] flex flex-col gap-2">
        {items.map((item: TodoItem) => (
          <Item
            key={item.id}
            item={item}
            onChange={(isComplete) => markAsComplete(item.id, isComplete)}
          />
        ))}
      </div>
    </div>
  );
}
