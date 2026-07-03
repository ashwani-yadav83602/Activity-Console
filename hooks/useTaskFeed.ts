"use client";

import { useEffect, useRef } from "react";
import {
  connectionStatusChanged,
  taskUpdated,
  taskAssigned,
  annotationCreated,
} from "@/lib/redux/taskFeedSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { normalizeStatus, normalizeUpdatedAt } from "@/lib/services/taskApi";

const WS_URL = "ws://localhost:4000/ws";
const MAX_BACKOFF_MS = 30_000;

type ServerEvent =
  | { kind: "task.updated"; payload: { id: string; status: unknown; updatedAt: string | number } }
  | { kind: "task.assigned"; payload: { id: string; assignee: { id: string; name: string } | null } }
  | { kind: "annotation.created"; payload: { taskId: string; by: string; at: number } };

export function useTaskFeed() {
  const dispatch = useAppDispatch();
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manuallyClosedRef = useRef(false);

  useEffect(() => {
    manuallyClosedRef.current = false;

    function connect() {
      dispatch(connectionStatusChanged("connecting"));
      const socket = new WebSocket(WS_URL);
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectAttemptRef.current = 0; // reset backoff on a clean connect
        dispatch(connectionStatusChanged("open"));
      };

      socket.onmessage = (event) => {
        let parsed: ServerEvent;
        try {
          parsed = JSON.parse(event.data);
        } catch {
          console.warn("Received malformed WS frame, skipping:", event.data);
          return;
        }

        switch (parsed.kind) {
          case "task.updated":
            dispatch(
    taskUpdated({
        id: parsed.payload.id,
        status: normalizeStatus(parsed.payload.status),
        updatedAt: normalizeUpdatedAt(parsed.payload.updatedAt),
    })
);
            break;
          case "task.assigned":
            dispatch(taskAssigned(parsed.payload));
            break;
          case "annotation.created":
            dispatch(annotationCreated(parsed.payload));
            break;
          default:
            // Forward-compatible: unknown event kinds are logged, not thrown
            console.warn("Unknown WS event kind:", (parsed as { kind?: string }).kind);
        }
      };

      socket.onerror = () => {
        dispatch(connectionStatusChanged("error"));
      };

      socket.onclose = () => {
        dispatch(connectionStatusChanged("closed"));
        socketRef.current = null;
        if (manuallyClosedRef.current) return;

        // Exponential backoff, capped, with a little jitter so multiple
        // tabs/clients don't all retry in lockstep
        const attempt = reconnectAttemptRef.current;
        const backoff = Math.min(1000 * 2 ** attempt, MAX_BACKOFF_MS);
        const jitter = Math.random() * 300;
        reconnectAttemptRef.current += 1;

        reconnectTimerRef.current = setTimeout(connect, backoff + jitter);
      };
    }

    connect();

    return () => {
      manuallyClosedRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      socketRef.current?.close();
    };
  }, [dispatch]);
}