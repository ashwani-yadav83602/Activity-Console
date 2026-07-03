"use client";

import { useTaskSummary } from "@/hooks/useTaskSummary";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function TaskSummary({ taskId }: { taskId: string }) {
  const { content, isStreaming, error } = useTaskSummary(taskId);

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!content && isStreaming) {
    return <p className="text-sm text-gray-500">Generating summary…</p>;
  }

  return (
    <div className="prose prose-sm max-w-none text-sm leading-6">
      {/* No rehype-raw plugin — embedded <script>/<img onerror> render as
          inert text, never as live DOM. This is the sanitization boundary. */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      {isStreaming && <span className="animate-pulse text-gray-400"> ▍</span>}
    </div>
  );
}