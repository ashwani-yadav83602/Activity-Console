import { Task, TaskStatus, TaskType, TaskType } from "@/lib/services/taskApi";

export const PAGE_SIZE = 5;

export const STATUS_OPTIONS: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "qa", label: "QA" },
  { value: "blocked", label: "Blocked" },
  { value: "done", label: "Done" },
];

export const TYPE_OPTIONS: { value: TaskType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "image", label: "Image" },
  { value: "audio", label: "Audio" },
  { value: "text", label: "Text" },
];

// Presentation-only formatting — kept separate from data normalization
export function formatStatus(status: Task["status"]) {
  return status
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatType(type: Task["type"]) {
  return type[0].toUpperCase() + type.slice(1);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}