import { formatDate, formatStatus, formatType } from "@/app/tasks/pageHelper";
import { Task } from "@/types/task";

export const Table = ({ tasks, selectedTask, setSelectedTask,filteredTasks }: { tasks: Task[]; selectedTask: Task | null; setSelectedTask: (task: Task) => void; filteredTasks: Task[] }) => {
  return (
    <table className="w-full border-collapse">
                 <thead>
                   <tr className="border-b bg-gray-50">
                     <th className="p-3 text-left">Task</th>
                     <th className="p-3 text-left">Type</th>
                     <th className="p-3 text-left">Status</th>
                     <th className="p-3 text-left">Assignee</th>
                     <th className="p-3 text-left">Updated</th>
                   </tr>
                 </thead>
   
                 <tbody>
                   {filteredTasks.length === 0 ? (
                     <tr>
                       <td colSpan={5} className="p-6 text-center text-gray-500">
                         No tasks match your filters.
                       </td>
                     </tr>
                   ) : (
                     filteredTasks.map((task) => (
                       <tr
                         key={task.id}
                         onClick={() => setSelectedTask(task)}
                         className={`cursor-pointer border-b hover:bg-gray-50 ${
                           selectedTask?.id === task.id ? "bg-blue-50" : ""
                         }`}
                       >
                         <td className="p-3 font-medium">{task.title}</td>
                         <td className="p-3">{formatType(task.type)}</td>
                         <td className="p-3">{formatStatus(task.status)}</td>
                         <td className="p-3">
                           {task.assignee?.name ?? "Unassigned"}
                         </td>
                         <td className="p-3">{formatDate(task.updatedAt)}</td>
                       </tr>
                     ))
                   )}
                 </tbody>
                 </table>
          );
        };