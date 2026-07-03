/**
 * Re-export normalized types from taskApi
 * This is the single source of truth for all task-related types
 */
export type {
  Task,
  TaskType,
  TaskStatus,
  Assignee,
  GetTasksResponse,
} from "@/lib/services/taskApi";
