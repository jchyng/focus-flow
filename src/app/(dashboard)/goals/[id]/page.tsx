"use client";

import {
  ArrowLeft,
  Timer,
  Calendar,
  Plus,
  Pencil,
  Trash,
  MoreHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Status, StatusInfo, Task, Priority, PriorityInfo } from "@/types/goal";
import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";
import { useModal } from "@/contexts/ModalContext";
import { Input, Modal, Select } from "@/components";

function Header({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => router.push("/goals")}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-base-content">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn btn-primary gap-2">
          <Timer size={20} />
          작업 시작하기
        </button>
        <div className="dropdown dropdown-end">
          <button tabIndex={0} className="btn btn-ghost btn-circle">
            <MoreHorizontal size={20} />
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 z-[1]"
          >
            <li>
              <button onClick={() => alert("수정 기능은 구현 예정입니다.")}>
                <Pencil size={16} /> 수정
              </button>
            </li>
            <li>
              <button
                className="text-error"
                onClick={() => alert("삭제 기능은 구현 예정입니다.")}
              >
                <Trash size={16} /> 삭제
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

interface GoalInfoProps {
  description: string;
  progress: number;
  startDate: string;
  endDate: string;
}

function GoalInfo({
  description,
  progress,
  startDate,
  endDate,
}: GoalInfoProps) {
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

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card bg-base-100 shadow-sm border-2 border-base-300 rounded-xl hover:shadow-md transition-all duration-200 h-[130px] flex flex-col justify-between cursor-move"
    >
      <div className="card-body p-3 pb-2 flex flex-col gap-2">
        <div className="flex justify-between items-center mb-1">
          <h3
            className="card-title text-base font-bold block truncate max-w-[70%] whitespace-nowrap overflow-hidden cursor-pointer hover:text-primary"
            onClick={() => alert("작업 상세 모달은 구현 예정입니다.")}
          >
            {task.title}
          </h3>
          <div
            className={`${
              PriorityInfo[task.priority].className
            } text-xs px-2 py-0.5 rounded-full`}
          >
            {PriorityInfo[task.priority].text}
          </div>
        </div>
        <p className="text-base-content/60 line-clamp-2 overflow-hidden">
          {task.description}
        </p>
        {task.startDate && task.endDate && (
          <div className="flex items-center gap-1 text-xs text-base-content/50 mt-auto">
            <Calendar size={14} />
            <span>
              {task.startDate} ~ {task.endDate}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: Status;
}

function TaskColumn({ title, tasks, status }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });
  const { open } = useModal();

  const handleAddTask = (status: Status) => {
    // alert(
    //   `작업 추가 모달은 나중에 구현 예정입니다. (상태: ${StatusInfo[status].text})`
    // );
    open("TaskModal");
  };

  return (
    <div
      ref={setNodeRef}
      className={`${StatusInfo[status].bgClassName} border border-base-300 rounded-2xl p-5 min-w-[270px] flex flex-col gap-3 shadow-sm`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${StatusInfo[status].dotColor}`}
          ></span>
          <span
            className={`font-bold text-base ${StatusInfo[status].titleClassName}`}
          >
            {title}
          </span>
        </div>
        <span className="badge badge-ghost badge-sm px-2 py-0.5 rounded-full font-medium text-xs">
          {tasks.length}
        </span>
      </div>
      <div className="text-xs text-base-content/50 mb-2 pl-1">
        {StatusInfo[status].description}
      </div>
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          <button
            onClick={() => handleAddTask(status)}
            className="w-full p-3 border-2 border-dashed border-base-content/20 rounded-xl transition-colors flex items-center justify-center gap-2 text-base-content/50 hover:border-base-content/50 hover:text-base-content/80"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">작업 추가</span>
          </button>
        </div>
      </SortableContext>
    </div>
  );
}

interface TaskBoardProps {
  tasks: Task[];
}

function TaskBoard({ tasks: initialTasks }: TaskBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const todoTasks = tasks.filter((task) => task.status === Status.TODO);
  const doingTasks = tasks.filter((task) => task.status === Status.DOING);
  const doneTasks = tasks.filter((task) => task.status === Status.DONE);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // 카드가 다른 카드 위에 드롭된 경우
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) {
      // 같은 컬럼 내에서 순서 변경
      if (overTask.status === tasks.find((t) => t.id === taskId)?.status) {
        const oldIndex = tasks.findIndex((t) => t.id === taskId);
        const newIndex = tasks.findIndex((t) => t.id === overId);

        setTasks((prevTasks) => {
          const newTasks = [...prevTasks];
          const [movedTask] = newTasks.splice(oldIndex, 1);
          newTasks.splice(newIndex, 0, movedTask);
          return newTasks;
        });
        return;
      }

      // 다른 컬럼으로 이동
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: overTask.status } : task
        )
      );
      return;
    }

    // 카드가 컬럼에 드롭된 경우
    const newStatus = overId as Status;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-3 gap-4">
        <TaskColumn title="대기중" tasks={todoTasks} status={Status.TODO} />
        <TaskColumn title="진행중" tasks={doingTasks} status={Status.DOING} />
        <TaskColumn title="완료" tasks={doneTasks} status={Status.DONE} />
      </div>
      {typeof window !== "undefined" &&
        createPortal(
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>,
          document.body
        )}
      <Modal
        name="TaskModal"
        actionName={"추가"}
        onAction={() => console.log("작업 추가 기능은 구현 예정입니다.")}
        onClose={() =>
          console.log("작업 추가 모달 닫기 기능은 구현 예정입니다.")
        }
      >
        <Input
          label={"제목"}
          required
          placeholder="작업 제목을 입력해 주세요"
        />
        <Input
          label={"설명"}
          type="textarea"
          placeholder="작업에 대한 설명을 입력해 주세요"
        />
        <Select
          label={"상태"}
          required
          options={[
            { value: Status.TODO, label: "할 일" },
            { value: Status.DOING, label: "진행 중" },
            { value: Status.DONE, label: "완료" },
          ]}
          value={Status.TODO}
        />
        <Select
          label={"우선순위"}
          required
          options={[
            { value: Priority.LOW, label: "☕ 여유" },
            { value: Priority.MEDIUM, label: "💡 중요" },
            { value: Priority.HIGH, label: "🚨 긴급" },
          ]}
          value={Status.TODO}
        />
        <Input label={"시작일"} type="date" />
        <Input label={"종료일"} type="date" />
      </Modal>
    </DndContext>
  );
}

export default function GoalDetailPage() {
  // TODO: 실제 데이터로 교체
  const goal = {
    title: "프로젝트 완성하기",
    description:
      "프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기 ",
    progress: 60,
    startDate: "2024-03-01",
    endDate: "2025-06-15",
    tasks: [
      {
        id: "1",
        title:
          "프론트엔드 개발 프론트엔드 개발 프론트엔드 개발프론트엔드 개발프론트엔드 개발",
        description:
          "React와 TypeScript를 사용하여 프론트엔드 구현 React와 TypeScript를 사용하여 프론트엔드 구현 React와 TypeScript를 사용하여 프론트엔드 구현 React와 TypeScript를 사용하여 프론트엔드 구현",
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
      {
        id: "4",
        title: "배포 예정",
        description: "배포 예정 작업",
        status: Status.TODO,
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
