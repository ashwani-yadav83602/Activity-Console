import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Raw API Types
 * These match the backend exactly — inconsistencies and all.
 */

export interface RawAssignee {
  id: string;
  name: string;
}

export interface RawTask {
  id: string;
  title: string;
  type: unknown;
  status: unknown;
  assignee: RawAssignee | null;
  annotationCount: string | number;
  updatedAt: string | number;
  meta: {
    priority?: string;
    note?: string;
    [key: string]: unknown;
  };
}

export interface RawGetTasksResponse {
  page: number;
  pageSize: number;
  total: number;
  items: RawTask[];
}

export interface GetTasksParams {
  page: number;
  pageSize: number;
}

/**
 * Normalized Types
 * These are what the rest of the app should actually consume.
 */

export type TaskType = "audio" | "text" | "image";

export type TaskStatus = "todo" | "in_progress" | "qa" | "blocked" | "done";

export interface Assignee {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  assignee: Assignee | null;
  annotationCount: number;
  updatedAt: string; // always ISO 8601, regardless of source format
  priority: string | null;
  note: string | null;
  meta: Record<string, unknown>;
}

export interface GetTasksResponse {
  page: number;
  pageSize: number;
  total: number;
  items: Task[];
}

/**
 * Normalization helpers
 *
 * Exported so other consumers of raw server data (e.g. the WebSocket feed
 * in useTaskFeed, which receives the same inconsistent status/date formats
 * as this REST endpoint) can reuse the exact same logic instead of
 * duplicating — and potentially drifting from — the rules defined here.
 */

const VALID_TASK_TYPES: TaskType[] = ["audio", "text", "image"];

export function normalizeType(raw: unknown): TaskType {
  if (typeof raw === "string" && VALID_TASK_TYPES.includes(raw as TaskType)) {
    return raw as TaskType;
  }
  console.warn(`Unknown task type received: ${String(raw)}, defaulting to "text"`);
  return "text";
}

// Backend sends inconsistent casing/format: "InProgress", "done", "QA", "todo", "BLOCKED"
const STATUS_MAP: Record<string, TaskStatus> = {
  todo: "todo",
  inprogress: "in_progress",
  qa: "qa",
  blocked: "blocked",
  done: "done",
};

export function normalizeStatus(raw: unknown): TaskStatus {
  if (typeof raw === "string") {
    const key = raw.toLowerCase().replace(/[\s_-]/g, "");
    const mapped = STATUS_MAP[key];
    if (mapped) return mapped;
  }
  console.warn(`Unknown task status received: ${String(raw)}, defaulting to "todo"`);
  return "todo";
}

export function normalizeAnnotationCount(raw: string | number): number {
  const n = typeof raw === "number" ? raw : parseInt(raw, 10);
  return Number.isFinite(n) ? n : 0;
}

// Backend sends either epoch ms (number) or ISO string — always output ISO string
export function normalizeUpdatedAt(raw: string | number): string {
  const date = typeof raw === "number" ? new Date(raw) : new Date(raw);
  if (Number.isNaN(date.getTime())) {
    console.warn(`Invalid updatedAt received: ${String(raw)}`);
    return new Date(0).toISOString();
  }
  return date.toISOString();
}

export function normalizeTask(raw: RawTask): Task {
  return {
    id: raw.id,
    title: raw.title,
    type: normalizeType(raw.type),
    status: normalizeStatus(raw.status),
    assignee: raw.assignee,
    annotationCount: normalizeAnnotationCount(raw.annotationCount),
    updatedAt: normalizeUpdatedAt(raw.updatedAt),
    priority: raw.meta?.priority ?? null,
    note: raw.meta?.note ?? null,
    meta: raw.meta ?? {},
  };
}

/**
 * API slice
 */

export const taskApi = createApi({
  reducerPath: "taskApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000",
  }),

  tagTypes: ["Task"],

  endpoints: (builder) => ({
    getTasks: builder.query<GetTasksResponse, GetTasksParams>({
      query: ({ page, pageSize }) => ({
        url: "/api/tasks",
        params: { page, pageSize },
      }),
      transformResponse: (response: RawGetTasksResponse): GetTasksResponse => ({
        page: response.page,
        pageSize: response.pageSize,
        total: response.total,
        items: response.items.map(normalizeTask),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Task" as const, id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),
  }),
});

export const { useGetTasksQuery } = taskApi;