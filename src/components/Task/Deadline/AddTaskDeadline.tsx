import { Calendar, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { z } from "zod";
import { ToggleButton } from "../../Button/ToggleButton";
import { TaskType } from "@/utils/types/tasks.types";
import { MutationResultType } from "@/utils/types/form.types";
import { FormContainer } from "@/components/Form/containers/FormContainer";
import { FormFieldDateItem } from "@/components/Form/fields/FormFieldDateItem";
import { FormCheckBoxItem } from "@/components/Form/fields/FormCheckBoxItem";
import { FormActionsButton } from "@/components/Form/actions/FormActionsButton";

/**
 * AddTaskDeadline component allows adding or updating a deadline for a task.
 * The component provides a form to set or update the "to" and optional "from" date for the task's deadline.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {TaskType} props.task - The task object containing current task information, including deadlines.
 * @param {MutationResultType<string, Partial<TaskType>>} props.mutationQuery - The mutation query for updating the task with the deadline.
 *
 * @returns The AddTaskDeadline component.
 */
export const AddTaskDeadline = ({
  task,
  mutationQuery,
}: {
  task: TaskType;
  mutationQuery: MutationResultType<string, Partial<TaskType>>;
}) => {
  const [isAddDate, setIsAddDate] = useState(false);
  const [isBeginDate, setIsBeginDate] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Set the initial state for the start date if the task has a 'from' date
  useEffect(() => {
    if (task.dueDate && task.dueDate.from) {
      setIsBeginDate(true);
    }
  }, [task.dueDate]);

  // Schema to validate the deadline dates using Zod
  const TaskDeadLineSchema = z
    .object({
      to: z.date().refine((date) => date.getTime() >= today.getTime(), {
        message: "Deadline cannot be in the past.",
      }),
      from: z
        .date()
        .nullable()
        .refine((date) => !date || date.getTime() >= today.getTime(), {
          message: "Start date cannot be in the past.",
        }),
    })
    .refine((data) => !data.from || data.from < data.to, {
      message: "Start date must be before deadline.",
      path: ["from"], // Associate the error with the 'from' field
    });

  /**
   * Handles form submission for adding or updating the task deadline.
   *
   * @param {FieldValues} data - The form data containing the 'to' (deadline) and optional 'from' (start) dates.
   */
  const handleAddDeadline = async (data: FieldValues) => {
    mutationQuery.mutate(
      {
        dueDate: {
          completed: false,
          to: data.to.toDateString(),
          from: data.from && isBeginDate ? data.from.toDateString() : null,
        },
      },
      {
        onSuccess: () => setIsAddDate(false), // Close the form on success
      }
    );
  };

  return (
    <>
      {isAddDate ? (
        <FormContainer
          schema={TaskDeadLineSchema}
          onSubmit={handleAddDeadline}
          mutationQuery={mutationQuery}
          defaultValues={{
            to: task.dueDate ? new Date(task.dueDate.to) : undefined,
            from:
              task.dueDate && task.dueDate.from
                ? new Date(task.dueDate.from)
                : null,
          }}
        >
          {({ form }) => (
            <>
              <FormFieldDateItem form={form} id="to" />
              {isBeginDate && <FormFieldDateItem form={form} id="from" />}
              <FormCheckBoxItem
                id="begin"
                defaultChecked={task.dueDate?.from ? true : false}
                onCheckedChange={() => {
                  setIsBeginDate((prev) => !prev);
                }}
              >
                <span className="text-sm font-medium"> Start date?</span>
              </FormCheckBoxItem>
              <FormActionsButton
                isPending={mutationQuery.isPending}
                setIsOpen={setIsAddDate}
              >
                <span className="flex items-center gap-2">
                  <Plus size={16} />{" "}
                  {`${task.dueDate ? "Update" : "Add"} deadline`}
                </span>
              </FormActionsButton>
            </>
          )}
        </FormContainer>
      ) : (
        <ToggleButton setIsOpen={setIsAddDate}>
          <Calendar size={16} />
          {task.dueDate ? "Update" : "Add"} deadline
        </ToggleButton>
      )}
    </>
  );
};
