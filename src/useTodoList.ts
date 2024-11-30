import { useEffect, useState } from "react";
import { TodoItem } from "./models/TodoItem";

export const useTodoList = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTodo() {
      try {
        setError(null);
        setIsLoading(true);

        const response = await fetch(
          "https://b0f179aa-a791-47b5-a7ca-5585ba9e3642.mock.pstmn.io/get",
          {
            headers: {
              "x-api-key": apiKey,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const todoData = await response.json();
        setIsLoading(false);
        setTodoList(todoData);
      } catch (err: unknown) {
        let message = "Something went wrong";
        if (typeof err === "string") {
          message = err.toUpperCase();
        } else if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTodo();
  }, []);

  return { todoList, isLoading, markAsComplete, error };

  async function markAsComplete(id: number, isComplete: boolean) {
    try {
      const response = await fetch(
        `https://b0f179aa-a791-47b5-a7ca-5585ba9e3642.mock.pstmn.io/patch/${id}`,
        {
          method: "PATCH",
          headers: {
            "x-api-key": apiKey,
          },
          body: JSON.stringify({ isComplete: true }),
        }
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      setTodoList(
        todoList.map((item) => {
          if (item.id === id) {
            item.isComplete = isComplete;
          }
          return item;
        })
      );
    } catch (err) {
      let message = "Something went wrong";
      if (typeof err === "string") {
        message = err.toUpperCase();
      } else if (err instanceof Error) {
        message = err.message;
      }
      throw new Error(message);
    }
  }
};
