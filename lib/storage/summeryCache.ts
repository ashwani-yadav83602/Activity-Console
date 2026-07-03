// lib/storage/summaryCache.ts

import localforage from "localforage";

const storage = localforage.createInstance({
  name: "activity-console",
  storeName: "summaries",
});

export interface CachedSummary {
  taskId: string;
  summary: string;
  cachedAt: number;
}

export async function getCachedSummary(taskId: string|null): Promise<CachedSummary | null> {
  if (!taskId) return null;
  return storage.getItem<CachedSummary>(taskId);
}

export async function saveCachedSummary(
  taskId: string|null,
  summary: string
) {
  if (!taskId) return;
  await storage.setItem(taskId, {
    taskId,
    summary,
    cachedAt: Date.now(),
  });
}

export async function clearSummary(taskId: string|null) {
  if (!taskId) return;  
  await storage.removeItem(taskId);
}