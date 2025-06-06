"use client";

import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

enum Period {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

enum SortOption {
  PROGRESS = "progress",
  CREATED = "created",
  DUE = "due",
}

const SortOptionText: Record<SortOption, string> = {
  [SortOption.PROGRESS]: "진행률순",
  [SortOption.CREATED]: "생성일순",
  [SortOption.DUE]: "마감일순",
};

enum FilterStatus {
  ALL = "all",
  DOING = "doing",
  DONE = "done",
}

const FilterStatusText: Record<FilterStatus, string> = {
  [FilterStatus.ALL]: "전체",
  [FilterStatus.DOING]: "진행중",
  [FilterStatus.DONE]: "완료",
};

function formatYearMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

function Header() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-base-content">목표 관리</h1>
      <button
        className="btn btn-primary gap-2"
        onClick={() => alert("모달 추가 예정")}
      >
        <Plus /> 목표 추가
      </button>
    </div>
  );
}

interface PeriodSelectionProps {
  period: Period;
  onPeriodChange: (period: Period) => void;
  yearMonth: string;
  onYearMonthChange: (yearMonth: string) => void;
}

function PeriodSelector({
  period,
  onPeriodChange,
  yearMonth,
  onYearMonthChange,
}: PeriodSelectionProps) {
  const handlePrevMonth = () => {
    const [year, month] = yearMonth.split("-").map(Number);
    const date = new Date(year, month - 2); // month is 0-based
    onYearMonthChange(formatYearMonth(date));
  };

  const handleNextMonth = () => {
    const [year, month] = yearMonth.split("-").map(Number);
    const date = new Date(year, month); // month is 0-based
    onYearMonthChange(formatYearMonth(date));
  };

  return (
    <div className="flex items-center gap-4">
      <div className="join">
        <input
          className="join-item btn btn-outline"
          type="radio"
          name="period"
          aria-label="주간"
          checked={period === Period.WEEKLY}
          onChange={() => onPeriodChange(Period.WEEKLY)}
        />
        <input
          className="join-item btn btn-outline"
          type="radio"
          name="period"
          aria-label="월간"
          checked={period === Period.MONTHLY}
          onChange={() => onPeriodChange(Period.MONTHLY)}
        />
      </div>

      {period === Period.MONTHLY && (
        <div className="flex items-center gap-2">
          <button
            className="btn btn-square btn-outline btn-sm"
            onClick={handlePrevMonth}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="w-24 text-center font-medium">
            {yearMonth.replace("-", "년 ") + "월"}
          </span>
          <button
            className="btn btn-square btn-outline btn-sm"
            onClick={handleNextMonth}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

interface StatusSelectionProps {
  status: keyof typeof FilterStatus;
  onStatusChange: (status: keyof typeof FilterStatus) => void;
}

function StatusSelector({ status, onStatusChange }: StatusSelectionProps) {
  return (
    <select
      className="select select-bordered w-32"
      value={status}
      onChange={(e) =>
        onStatusChange(e.target.value as keyof typeof FilterStatus)
      }
    >
      {Object.entries(FilterStatusText).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

interface SortSelectionProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

function SortSelector({ sortBy, onSortChange }: SortSelectionProps) {
  return (
    <select
      className="select select-bordered w-32"
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value as SortOption)}
    >
      {Object.entries(SortOptionText).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

function LookupOptionsBar() {
  const [period, setPeriod] = useState<Period>(Period.WEEKLY);
  const currentDate = new Date();
  const [yearMonth, setYearMonth] = useState<string>(
    formatYearMonth(currentDate)
  );
  const [status, setStatus] = useState<keyof typeof FilterStatus>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.PROGRESS);

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <PeriodSelector
            period={period}
            onPeriodChange={setPeriod}
            yearMonth={yearMonth}
            onYearMonthChange={setYearMonth}
          />

          <div className="flex items-center gap-4">
            <StatusSelector status={status} onStatusChange={setStatus} />
            <SortSelector sortBy={sortBy} onSortChange={setSortBy} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <Header />
      <LookupOptionsBar />
    </div>
  );
}
