"use client";

import { ArrowLeft, Timer, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { Status, StatusText, Task, Priority } from "@/types/goal";

function Header({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => router.back()}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-base-content">{title}</h1>
      </div>
      <button className="btn btn-primary gap-2">
        <Timer size={20} />
        작업 시작하기
      </button>
    </div>
  );
}

function GoalInfo({
  description,
  progress,
  startDate,
  endDate,
}: {
  description: string;
  progress: number;
  startDate: string;
  endDate: string;
}) {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-base-content/70">
            <Calendar size={20} />
            <span>
              {startDate} ~ {endDate}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base-content/70">진행률</span>
            <span className="font-medium">{progress}%</span>
          </div>
        </div>

        <div className="w-full bg-base-200 rounded-full h-2 mb-6">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-base-content/80 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  function getStatusBadgeClass(status: Status): string {
    switch (status) {
      case Status.TODO:
        return "badge badge-ghost";
      case Status.DOING:
        return "badge badge-warning badge-soft";
      case Status.DONE:
        return "badge badge-success badge-soft";
      default:
        return "badge badge-ghost";
    }
  }

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{task.title}</h3>
          <div className={getStatusBadgeClass(task.status)}>
            {StatusText[task.status]}
          </div>
        </div>
        <p className="text-base-content/70 text-sm line-clamp-2 mt-1">
          {task.description}
        </p>
        {task.startDate && task.endDate && (
          <div className="flex items-center gap-2 text-sm text-base-content/70 mt-2">
            <Calendar size={16} />
            <span>
              {task.startDate} ~ {task.endDate}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskBoard({ tasks }: { tasks: Task[] }) {
  const todoTasks = tasks.filter((task) => task.status === Status.TODO);
  const doingTasks = tasks.filter((task) => task.status === Status.DOING);
  const doneTasks = tasks.filter((task) => task.status === Status.DONE);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">대기중</h2>
        <div className="space-y-4">
          {todoTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">진행중</h2>
        <div className="space-y-4">
          {doingTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">완료</h2>
        <div className="space-y-4">
          {doneTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GoalDetailPage() {
  // TODO: 실제 데이터로 교체
  const goal = {
    title: "프로젝트 완성하기",
    description: "프로젝트의 모든 기능을 구현하고 배포하기",
    progress: 60,
    startDate: "2024-03-01",
    endDate: "2025-06-15",
    tasks: [
      {
        id: "1",
        title: "프론트엔드 개발",
        description: "React와 TypeScript를 사용하여 프론트엔드 구현",
        status: Status.DOING,
        priority: Priority.HIGH,
        startDate: "2024-03-01",
        endDate: "2024-04-01",
      },
      {
        id: "2",
        title: "백엔드 개발",
        description: "Node.js와 Express를 사용하여 백엔드 구현",
        status: Status.TODO,
        priority: Priority.MEDIUM,
        startDate: "2024-04-01",
        endDate: "2024-05-01",
      },
      {
        id: "3",
        title: "배포",
        description: "AWS를 사용하여 애플리케이션 배포",
        status: Status.DONE,
        priority: Priority.LOW,
        startDate: "2024-05-01",
        endDate: "2024-05-15",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <Header title={goal.title} />
      <GoalInfo
        description={goal.description}
        progress={goal.progress}
        startDate={goal.startDate}
        endDate={goal.endDate}
      />
      <TaskBoard tasks={goal.tasks} />
    </div>
  );
}
