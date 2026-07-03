import { formatDate, formatStatus, formatType } from "@/app/tasks/pageHelper";
import { Task } from "@/types/task";
import { TaskSummary } from "./TaskSummery";

export default function Page({ selectedTask }: { selectedTask: Task | null }) {
  return (  <div className="rounded-lg bg-white p-5 shadow">
            <h2 className="mb-4 text-xl font-semibold">Task Details</h2>

            {selectedTask ? (
              <div className="space-y-3">
                <p>
                  <strong>Title:</strong> {selectedTask.title}
                </p>

                <p>
                  <strong>Type:</strong> {formatType(selectedTask?.type)}
                </p>

                <p>
                  <strong>Status:</strong> {formatStatus(selectedTask?.status)}
                </p>

                <p>
                  <strong>Assignee:</strong>{" "}
                  {selectedTask.assignee?.name ?? "Unassigned"}
                </p>

                <p>
                  <strong>Updated:</strong> {formatDate(selectedTask.updatedAt)}
                </p>

                {selectedTask.priority && (
                  <p>
                    <strong>Priority:</strong> {selectedTask.priority}
                  </p>
                )}

                <hr />

                <div>
                  <h3 className="mb-2 font-semibold">AI Summary</h3>
                   <div className="rounded bg-gray-100 p-4">
                    {selectedTask ? (
                            // key={selectedTask.id} forces the hook to remount and restart
                            // the stream cleanly when the user picks a different task
                            <TaskSummary key={selectedTask.id} taskId={selectedTask.id} />
                             ) : (
                            <p className="text-sm text-gray-500">
                                Select a task to stream its AI-generated summary from the backend.
                            </p>
                            )}
                    </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No task selected.</p>
            )}
          </div>)
}