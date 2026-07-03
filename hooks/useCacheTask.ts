"use client";

import { useCallback, useEffect, useState } from "react";
import type { Task } from "@/lib/services/taskApi";
import {
  getCachedTasks,
  saveCachedTasks,
} from "@/lib/storage/taskCache";

export function useTaskCache() {
  const [cachedTasks, setCachedTasks] = useState<any[]>([]);
  const [cachedAt, setCachedAt] = useState<number | null>(null);
  const [loadingCache, setLoadingCache] = useState(true);

  const loadCache = useCallback(async () => {
    try {
      const cache = await getCachedTasks();

      if (cache) {
        setCachedTasks(cache.tasks);
        setCachedAt(cache.cachedAt);
      }
    } finally {
      setLoadingCache(false);
    }
  }, []);

  const updateCache = useCallback(async (tasks: Task[]) => {
    await saveCachedTasks(tasks);

    setCachedTasks(tasks);
    setCachedAt(Date.now());
  }, []);

  useEffect(() => {
    loadCache();
  }, [loadCache]);

  return {
    cachedTasks,
    cachedAt,
    loadingCache,
    updateCache,
    hasCache: cachedTasks.length > 0,
    isStale: cachedAt !== null,
  };
}