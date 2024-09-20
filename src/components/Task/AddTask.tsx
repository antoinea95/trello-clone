import { z } from "zod";
import { CreateForm } from "../Form/CreateForm";
import { FormContent, ListType, TaskType } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { useAddDoc, useUpdateDoc } from "@/firebase/mutateHook";

export const AddTask = ({
  list,
  boardId,
  setIsAddTask,
}: {
  list: ListType;
  boardId: string;
  setIsAddTask: Dispatch<SetStateAction<boolean>>;
}) => {

  const createTask = useAddDoc<TaskType>("tasks", list.id);
  const updateList = useUpdateDoc<ListType>("lists", list.id, boardId);

  const TaskSchema = z.object({
    title: z.string().min(1),
  });

  const onSubmit = async (data: z.infer<typeof TaskSchema>) => {
    createTask.mutate({
      ...data,
      createdAt: Date.now()
    }, {
      onSuccess: (newTaskId) => {
        updateList.mutate({
          tasks: [...list.tasks, newTaskId]
        })
        setIsAddTask(false);
      }
    })
  }


  const formContent : FormContent = [
    { name: "title", type: "text", placeholder: "Board title" },
  ];

  return (
    <div className="flex flex-col justify-center p-4 rounded-xl border-black border gap-3 w-full">
      <CreateForm 
      schema={TaskSchema}
      onSubmit={onSubmit}
      formContent={formContent}
      buttonName="Create task"
      query={createTask}
      />
      <Button
        className="w-full px-3 bg-red-500"
        onClick={() => setIsAddTask(false)}
      >
        Cancel
      </Button>
    </div>
  );
};
