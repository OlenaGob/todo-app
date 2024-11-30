import { useId, useState } from "react";
import { TodoItem } from "./models/TodoItem";

export default function Item({
  item,
  onChange,
}: {
  item: TodoItem;
  onChange: (isChecked: boolean) => Promise<void>;
}) {
  const id = useId();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleOnChange(isChecked: boolean) {
    setIsLoading(true);
    try {
      await onChange(isChecked);
      setError(null);
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

  let classes = "bg-gray-100";
  if (item.isComplete) {
    classes = "bg-green-200";
  } else if (item.dueDate && new Date(item.dueDate) < new Date()) {
    classes = "bg-red-200";
  }

  const formattedDueDate =
    item.dueDate && new Date(item.dueDate).toLocaleDateString();

  return (
    <div
      className={`flex flex-col justify-between border rounded-lg relative ${classes}`}
    >
      {isLoading && (
        <div className="absolute size-full bg-white opacity-75 flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      )}
      <div className={`flex flex-wrap justify-between py-1 px-2 w-full`}>
        <div className="flex gap-4">
          <input
            className="cursor-pointer"
            id={id}
            type="checkbox"
            checked={item.isComplete}
            onChange={(event) => handleOnChange(event.target.checked)}
          />
          <label
            className={`cursor-pointer text-wrap ${
              item.isComplete ? "line-through" : ""
            }`}
            htmlFor={id}
          >
            {item.description}
          </label>
        </div>
        {!!formattedDueDate && (
          <div className="px-1 min-w-fit">{formattedDueDate}</div>
        )}
      </div>
      {!!error && (
        <div className="text-red-600 text-sm font-bold pl-2">{error}</div>
      )}
    </div>
  );
}
