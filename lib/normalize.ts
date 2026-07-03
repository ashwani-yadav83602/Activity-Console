import { Task, TaskStatus, TaskType } from "@/types/task";


export function normalizeTask(raw: any): Task {
  const status = normalizeStatus(raw.status);
  const type = normalizeType(raw.type);

  return {
    id: String(raw.id),
    title: String(raw.title ?? "Untitled"),

    type,

    status,

    assignee: raw.assignee?.name ?? null,

    annotationCount: Number(raw.annotationCount) || 0,

    updatedAt:
      typeof raw.updatedAt === "number"
        ? new Date(raw.updatedAt)
        : new Date(String(raw.updatedAt)),

    meta: {
      priority: raw.meta?.priority,
      note: raw.meta?.note,
    },
  };
}

function normalizeStatus(value: unknown): TaskStatus {
  switch (String(value).toLowerCase()) {
    case "todo":
      return TaskStatus.TODO;

    case "inprogress":
    case "in_progress":
      return TaskStatus.IN_PROGRESS;

    case "qa":
      return TaskStatus.QA;

    case "done":
      return TaskStatus.DONE;

    case "blocked":
      return TaskStatus.BLOCKED;

    default:
      return TaskStatus.UNKNOWN;
  }
}

function normalizeType(value: unknown): TaskType {
  switch (String(value).toLowerCase()) {
    case "image":
    case "audio":
    case "text":
      return String(value).toLowerCase() as TaskType;

    default:
      return "unknown";
  }
}