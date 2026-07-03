import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type TaskStatus, type Assignee, normalizeStatus, normalizeUpdatedAt } from "@/lib/services/taskApi";

export interface LiveTaskPatch {
  id: string;
  status?: TaskStatus;
  updatedAt?: string;
  assignee?: Assignee | null;
  // Annotation counts arrive as deltas, not absolutes — the base count
  // lives on the fetched Task, so we track "how many more" separately
  // and add it on merge (see mergeTaskWithLiveUpdates).
  annotationDelta?: number;
}

interface TaskFeedState {
  patches: Record<string, LiveTaskPatch>;
  connectionStatus: "connecting" | "open" | "closed" | "error";
}

const initialState: TaskFeedState = {
  patches: {},
  connectionStatus: "closed",
};

const taskFeedSlice = createSlice({
  name: "taskFeed",
  initialState,
  reducers: {
    connectionStatusChanged(
      state,
      action: PayloadAction<TaskFeedState["connectionStatus"]>
    ) {
      state.connectionStatus = action.payload;
    },

    taskUpdated(
      state,
      action: PayloadAction<{ id: string; status: unknown; updatedAt: string | number }>
    ) {
      const { id, status, updatedAt } = action.payload;
      const existing = state.patches[id] ?? { id };
      state.patches[id] = {
        ...existing,
        status: normalizeStatus(status),
        updatedAt: normalizeUpdatedAt(updatedAt),
      };
    },

    taskAssigned(
      state,
      action: PayloadAction<{ id: string; assignee: Assignee | null }>
    ) {
      const { id, assignee } = action.payload;
      const existing = state.patches[id] ?? { id };
      state.patches[id] = { ...existing, assignee };
    },

    annotationCreated(
      state,
      action: PayloadAction<{ taskId: string; by: string; at: number }>
    ) {
      const { taskId } = action.payload;
      const existing = state.patches[taskId] ?? { id: taskId };
      state.patches[taskId] = {
        ...existing,
        annotationDelta: (existing.annotationDelta ?? 0) + 1,
      };
    },

    // Once a task's patch has been merged/displayed, callers can clear it
    // to keep the overlay from growing unbounded over a long session.
    patchCleared(state, action: PayloadAction<string>) {
      delete state.patches[action.payload];
    },
  },
});

export const {
  connectionStatusChanged,
  taskUpdated,
  taskAssigned,
  annotationCreated,
  patchCleared,
} = taskFeedSlice.actions;

export default taskFeedSlice.reducer;