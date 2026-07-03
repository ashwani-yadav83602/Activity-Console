"use client";

import { useEffect, useState } from "react";
import { STATUS_OPTIONS } from "@/app/tasks/pageHelper";
import { TaskStatus } from "@/types/task";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
};

export const SearchComponent = ({ 
  searchQuery, 
  onSearchChange 
}: { 
  searchQuery: string; 
  onSearchChange: (query: string) => void;
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearchChange(localQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [localQuery, onSearchChange]);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="rounded border px-3 py-2"
      />
    </div>
  );
};

export default function Select({
  value,
  options,
  onChange,
  className = "",
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded border px-3 py-2 ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}