"use client";

import { useSortable } from "@dnd-kit/react/sortable";
import { GripVertical } from "lucide-react";
import type { PageField } from "./types";

interface SortableFieldItemProps {
  field: PageField;
  index: number;
  groupName: string;
}

export function SortableFieldItem({ field, index, groupName }: SortableFieldItemProps) {
  const { ref, isDragging } = useSortable({
    id: field.Page_Field_ID,
    index,
    type: "item",
    accept: "item",
    group: groupName,
  });

  return (
    <div
      ref={ref}
      className={`flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm transition-opacity ${
        isDragging ? "opacity-40 shadow-lg ring-2 ring-cyan-400" : "hover:bg-gray-50"
      }`}
    >
      <GripVertical className="w-4 h-4 text-gray-400 shrink-0 cursor-grab" />
      <span className="font-mono text-gray-900 min-w-36 truncate">{field.Field_Name}</span>
      <span className="text-gray-600 flex-1 truncate">{field.Field_Label ?? "—"}</span>
      {field.Required && (
        <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium shrink-0">
          Required
        </span>
      )}
      {field.Hidden && (
        <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium shrink-0">
          Hidden
        </span>
      )}
    </div>
  );
}
