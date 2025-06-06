"use client";

import { Goal, Status, StatusText } from "@/types/goal";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle2,
} from "lucide-react";
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
      <div role="tablist" className="tabs tabs-box">
        <input
          type="radio"
          name="period"
          role="tab"
          className="tab text-primary"
          aria-label="주간"
          checked={period === Period.WEEKLY}
          onChange={() => onPeriodChange(Period.WEEKLY)}
        />
        <input
          type="radio"
          name="period"
          role="tab"
          className="tab text-primary"
          aria-label="월간"
          checked={period === Period.MONTHLY}
          onChange={() => onPeriodChange(Period.MONTHLY)}
        />
      </div>

      {period === Period.MONTHLY && (
        <div className="flex items-center gap-2">
          <button
            className="btn btn-square btn-sm btn-ghost"
            onClick={handlePrevMonth}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="w-24 text-center font-medium">
            {yearMonth.replace("-", "년 ") + "월"}
          </span>
          <button
            className="btn btn-square btn-sm btn-ghost"
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
      className="select select-bordered w-32 focus:outline-none"
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
      className="select select-bordered w-32 focus:outline-none"
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

// TODO: Replace with actual data fetching
const goals: Goal[] = [
  {
    id: "1",
    title: "프로젝트 완성하기",
    description: "프로젝트의 모든 기능을 구현하고 배포하기",
    progress: 60,
    startDate: "2024-03-01",
    endDate: "2025-06-15",
    status: Status.DOING,
  },
  {
    id: "2",
    title: "포트폴리오 작성",
    description: "프로젝트 경험과 기술 스택을 정리하여 포트폴리오 작성하기",
    progress: 100,
    startDate: "2024-03-15",
    endDate: "2025-06-03",
    status: Status.DONE,
    completedAt: "2024-04-10",
  },
];

interface GoalCardProps {
  goal: Goal;
}

function getStatusBadgeClass(status: Status): string {
  switch (status) {
    case Status.TODO:
      return "badge badge-ghost";
    case Status.DOING:
      return "badge badge-info badge-soft";
    case Status.DONE:
      return "badge badge-success badge-soft";
    default:
      return "badge badge-ghost";
  }
}

function GoalCard({ goal }: GoalCardProps) {
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title text-lg">{goal.title}</h2>
          <div className={getStatusBadgeClass(goal.status)}>
            {StatusText[goal.status]}
          </div>
        </div>

        <p className="text-base-content/70 line-clamp-2">{goal.description}</p>

        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <Calendar size={16} />
            <span>
              {goal.startDate} ~ {goal.endDate}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{goal.progress}%</span>
          </div>
          <progress
            className="progress progress-primary w-full"
            value={goal.progress}
            max="100"
          />
        </div>

        <div className="h-6 mt-2">
          {goal.completedAt && (
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 size={16} />
              <span>Completed on {goal.completedAt}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GoalGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-18">
        <Header />
        <LookupOptionsBar />
      </div>
      <GoalGrid />
    </div>
  );
}
