"use client";

import { useState, useMemo } from "react";
import { useGetTasksQuery, Task, TaskStatus, TaskType } from "@/lib/services/taskApi";
import { useTaskFeed } from "@/hooks/useTaskFeed";
import { useAppSelector } from "@/lib/redux/hooks";
import { mergeTaskWithLiveUpdates } from "@/lib/utils/mergeTaskWithLiveUpdate";
import { Pagination } from "@/components/Pagination";
import TaskDetails from "@/components/TaskDetail";
import Select, { SearchComponent } from "@/components/commonComponent";
import { Table } from "@/components/TaskTable";
import { PAGE_SIZE, STATUS_OPTIONS, TYPE_OPTIONS } from "./pageHelper";



export default function Tasks() {
  useTaskFeed();
  const livePatches = useAppSelector((state) => state.taskFeed.patches);

  const [page, setPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<TaskType | "all">("all");

  const { data, isLoading, error } = useGetTasksQuery({
    page,
    pageSize: PAGE_SIZE,
  });

  const tasks = useMemo(
    () => (data?.items ?? []).map((task) =>
      mergeTaskWithLiveUpdates(task, livePatches[task.id])
    ),
    [data?.items, livePatches]
  );

const filteredTasks = useMemo(() => {
  const normalizedSearch = search
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

  return tasks.filter((task) => {
    const normalizedTitle = task.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

    const matchesSearch = normalizedTitle.includes(normalizedSearch);

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    const matchesType =
      typeFilter === "all" || task.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });
}, [tasks, search, statusFilter, typeFilter]);

  if (isLoading) return <h2>Loading...</h2>;
  if (error) return <h2>Something went wrong</h2>;

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold">Activity Console</h1>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Panel */}
          <div className="rounded-lg bg-white p-5 shadow lg:col-span-2">
            <div className="mb-4 flex flex-wrap gap-3">
              <SearchComponent searchQuery={search} onSearchChange={setSearch} />
              <Select
                value={statusFilter}
                options={STATUS_OPTIONS}
                onChange={(value) => setStatusFilter(value as TaskStatus | "all")}
              />
              <Select
                value={typeFilter}
                options={TYPE_OPTIONS}
                onChange={(value) => setTypeFilter(value as TaskType | "all")}
              />
            </div>
            <Table
              tasks={tasks}
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
              filteredTasks={filteredTasks}
            />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
          {/* Right Panel */}
          <TaskDetails selectedTask={selectedTask} />
        </div>
      </div>
    </main>
  );
}