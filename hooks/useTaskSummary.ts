"use client";

import { useEffect, useRef, useState } from "react";

interface UseTaskSummaryResult {
  content: string;
  isStreaming: boolean;
  error: string | null;
}

export function useTaskSummary(taskId: string | null): UseTaskSummaryResult {
  const [content, setContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Reset whenever the selected task changes
    setContent("");
    setError(null);
    sourceRef.current?.close();

    if (!taskId) return;

    setIsStreaming(true);

    const source = new EventSource(
      `http://localhost:4000/api/tasks/${taskId}/summary`
    );
    sourceRef.current = source;

    source.onmessage = (event) => {
      try {
        // Server encodes each chunk with JSON.stringify, so decode it back
        const chunk: string = JSON.parse(event.data);
        setContent((prev) => prev + chunk);
      } catch {
        // Malformed frame — skip rather than crash the stream
      }
    };

    source.addEventListener("done", () => {
      setIsStreaming(false);
      source.close();
    });

    source.onerror = () => {
      setError("Lost connection to the summary stream.");
      setIsStreaming(false);
      source.close();
    };

    return () => {
      source.close();
      sourceRef.current = null;
    };
  }, [taskId]);

  return { content, isStreaming, error };
}