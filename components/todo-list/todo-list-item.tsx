import { Todo } from "@prisma/client";

import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export type TodoListItemProps = {
  actionsEnabled: boolean;
  todo: Todo;
  onToggle: (id: string, isChecked: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export const TodoListItem = ({
  todo: { description, completedAt, id },
  onToggle,
  onDelete,
  actionsEnabled,
}: TodoListItemProps) => {
  const isChecked = !!completedAt;

  return (
    <div className="flex items-center justify-between min-h-[35px] gap-2">
      <div className="flex gap-2">
        <Checkbox
          id={id}
          checked={isChecked}
          onCheckedChange={(newIsChecked) =>
            onToggle(id, newIsChecked as boolean)
          }
          disabled={!actionsEnabled}
        />
        <Label htmlFor={id} className={isChecked ? "line-through" : ""}>
          {description}
        </Label>
      </div>
      <div className="flex items-end min-w-fit">
        {actionsEnabled && (
          <Button
            variant="destructive"
            size={"iconSm"}
            onClick={() => onDelete(id)}
          >
            <Trash2 size={14} />
          </Button>
        )}
        {!actionsEnabled && isChecked && (
          <div className="text-sm text-gray-500">
            {formatDistanceToNow(completedAt)}
          </div>
        )}
      </div>
    </div>
  );
};
