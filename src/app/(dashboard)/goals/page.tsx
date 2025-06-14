'use client';

import { Goal, Status } from '@/types/goal';
import { Plus, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { formatYearMonth, calculateDDay } from '@/lib/utils/format';
import { Select } from '@/components';

enum Period {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

enum SortOption {
  PROGRESS = 'progress',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
}

const SortOptionText = {
  [SortOption.PROGRESS]: '진행률순',
  [SortOption.START_DATE]: '시작일순',
  [SortOption.END_DATE]: '종료일순',
};

enum FilterStatus {
  ALL = 'all',
  DOING = 'doing',
  DONE = 'done',
}

const FilterStatusText = {
  [FilterStatus.ALL]: '전체',
  [FilterStatus.DOING]: '진행 중',
  [FilterStatus.DONE]: '완료',
};

function Header() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">목표 관리</h1>
      <button className="btn btn-primary gap-2" onClick={() => alert('모달 구현 Plz')}>
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
    const [year, month] = yearMonth.split('-').map(Number);
    const date = new Date(year, month - 2);
    onYearMonthChange(formatYearMonth(date));
  };

  const handleNextMonth = () => {
    const [year, month] = yearMonth.split('-').map(Number);
    const date = new Date(year, month);
    onYearMonthChange(formatYearMonth(date));
  };

  return (
    <div className="flex items-center gap-4">
      <div role="tablist" className="tabs tabs-box">
        <input
          type="radio"
          name="period"
          role="tab"
          className="tab"
          aria-label="주간"
          checked={period === Period.WEEKLY}
          onChange={() => onPeriodChange(Period.WEEKLY)}
        />
        <input
          type="radio"
          name="period"
          role="tab"
          className="tab"
          aria-label="월간"
          checked={period === Period.MONTHLY}
          onChange={() => onPeriodChange(Period.MONTHLY)}
        />
      </div>

      {period === Period.MONTHLY && (
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost" onClick={handlePrevMonth}>
            <ChevronLeft size={16} />
          </button>
          <span className="w-24 text-center">{yearMonth.replace('-', '년 ') + '월'}</span>
          <button className="btn btn-ghost" onClick={handleNextMonth}>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function LookupOptionsBar() {
  const [period, setPeriod] = useState<Period>(Period.WEEKLY);
  const currentDate = new Date();
  const [yearMonth, setYearMonth] = useState<string>(formatYearMonth(currentDate));
  const [status, setStatus] = useState<FilterStatus>(FilterStatus.ALL);
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.PROGRESS);

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex justify-between gap-4">
          <PeriodSelector
            period={period}
            onPeriodChange={setPeriod}
            yearMonth={yearMonth}
            onYearMonthChange={setYearMonth}
          />

          <div className="flex items-center gap-4">
            <Select
              label="상태"
              labelVisible={false}
              options={Object.entries(FilterStatusText).reduce(
                (acc, [value, text]) => ({
                  ...acc,
                  [value]: { text },
                }),
                {}
              )}
              value={status}
              onChange={(e) => setStatus(e.target.value as FilterStatus)}
            />
            <Select
              label="정렬"
              labelVisible={false}
              options={Object.entries(SortOptionText).reduce(
                (acc, [value, text]) => ({
                  ...acc,
                  [value]: { text },
                }),
                {}
              )}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// TODO: Replace with actual data fetching
const goals: Goal[] = [
  {
    id: '1',
    title:
      '프로젝트 완성하기 프로젝트 완성하기 프로젝트 완성하기 프로젝트 완성하기 프로젝트 완성하기 프로젝트 완성하기',
    description: `프로젝트의 모든 기능을 구현하고 배포하기\n프로젝트의 모든 기능을 구현하고 배포하기\n프로젝트의 모든 기능을 구현하고 배포하기\n프로젝트의 모든 기능을 구현하고 배포하기 `,
    progress: 0,
    startDate: '2024-03-01',
    endDate: '2025-06-30',
    status: Status.TODO,
  },
  {
    id: '2',
    title: '포트폴리오 작성',
    description: '프로젝트 경험과 기술 스택을 정리하여 포트폴리오 작성하기',
    progress: 100,
    startDate: '2024-03-15',
    endDate: '2025-06-03',
    status: Status.DONE,
    completedAt: '2024-04-10',
  },
  {
    id: '3',
    title: '이력서 작성',
    description: '이력서를 작성하여 채용 정보를 확인하기',
    progress: 60,
    startDate: '2024-03-15',
    endDate: '2025-06-10',
    status: Status.DOING,
  },
];

interface GoalCardProps {
  goal: Goal;
}

function GoalCard({ goal }: GoalCardProps) {
  const dDay = calculateDDay(goal.endDate);
  const isCompleted = goal.status === Status.DONE;
  const isNearDeadline = dDay <= 7 && dDay > 0;

  function getDDayBadge() {
    if (isCompleted) {
      return <div className="text-success font-semibold border-0">{goal.completedAt}</div>;
    }

    const dDayText = dDay > 0 ? `D-${dDay}` : dDay < 0 ? `D+${Math.abs(dDay)}` : 'D-Day';
    const badgeColor =
      dDay <= 0 ? 'text-red-400' : isNearDeadline ? 'text-red-400' : 'text-zinc-500';

    return <div className={`font-bold border-0 text-[18px] ${badgeColor}`}>{dDayText}</div>;
  }

  return (
    <div
      className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200 relative ${
        isCompleted
          ? 'after:absolute after:inset-0 after:bg-base-content/5 after:pointer-events-none opacity-65'
          : ''
      }`}
    >
      <div className={`card-body h-[400px] justify-between`}>
        <div className={'flex flex-col gap-3'}>
          <div className="w-full flex justify-between gap-2 mb-1.5">
            <div
              className={`flex items-center justify-start gap-2 text-sm text-base-content/70 mt-0`}
            >
              <Calendar size={16} />
              <span>
                {goal.startDate} ~ {goal.endDate}
              </span>
            </div>
            {getDDayBadge()}
          </div>
          <h2 className="card-title text-lg font-bold block">{goal.title}</h2>

          <pre className="text-base-content/70 whitespace-pre-wrap">{goal.description}</pre>
        </div>

        <div>
          <span className="text-zinc-600 text-[12px] whitespace-nowrap">
            진행률 {goal.progress}%
          </span>
          <div className="flex items-center gap-2 text-sm mt-0.5">
            <progress
              className="progress progress-primary w-full"
              value={goal.progress}
              max="100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => (
        <Link key={goal.id} href={`/goals/${goal.id}`}>
          <GoalCard goal={goal} />
        </Link>
      ))}
    </div>
  );
}

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <Header />
      <LookupOptionsBar />
      <GoalGrid />
    </div>
  );
}
