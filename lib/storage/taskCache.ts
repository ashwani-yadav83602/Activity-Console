// lib/storage/taskCache.ts

import localforage from "localforage";
import type { Task } from "@/lib/services/taskApi";

const CACHE_KEY = "tasks-cache";

const storage = localforage.createInstance({
  name: "activity-console",
  storeName: "tasks",
});

export interface CachedTasks {
  tasks: Task[];
  cachedAt: number;
}

export async function getCachedTasks(): Promise<CachedTasks | null> {
  return storage.getItem<CachedTasks>(CACHE_KEY);
}

export async function saveCachedTasks(tasks: Task[]) {
  await storage.setItem(CACHE_KEY, {
    tasks,
    cachedAt: Date.now(),
  });
  const value = await storage.getItem("tasks-cache");
  console.log(value);
}

export async function clearCachedTasks() {
  await storage.removeItem(CACHE_KEY);
}