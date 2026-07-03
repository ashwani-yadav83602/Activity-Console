import type { Task } from "@/lib/services/taskApi";
import type { LiveTaskPatch } from "@/lib/redux/taskFeedSlice";

export function mergeTaskWithLiveUpdates(task: Task, patch?: LiveTaskPatch): Task {
  if (!patch) return task;
  return {
    ...task,
    status: patch.status ?? task.status,
    updatedAt: patch.updatedAt ?? task.updatedAt,
    assignee: patch.assignee !== undefined ? patch.assignee : task.assignee,
    annotationCount: task.annotationCount + (patch.annotationDelta ?? 0),
  };
}