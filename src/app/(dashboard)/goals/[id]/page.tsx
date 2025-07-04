'use client';

import {
  ArrowLeft,
  Timer,
  Calendar,
  Plus,
  Pencil,
  Trash,
  MoreHorizontal,
  Check,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Status, StatusInfo, Task, Priority, PriorityInfo } from '@/types/goal';
import { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
  DragOverEvent,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createPortal } from 'react-dom';

function Header({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button className="btn btn-ghost btn-circle" onClick={() => router.push('/goals')}>
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
              <button onClick={() => alert('수정 기능은 구현 예정입니다.')}>
                <Pencil size={16} /> 수정
              </button>
            </li>
            <li>
              <button onClick={() => alert('수정 기능은 구현 예정입니다.')}>
                <Check size={16} /> 완료
              </button>
            </li>
            <li>
              <button className="text-error" onClick={() => alert('삭제 기능은 구현 예정입니다.')}>
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

function GoalInfo({ description, progress, startDate, endDate }: GoalInfoProps) {
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

        <pre className="text-base-content/80 leading-relaxed whitespace-pre-wrap">
          {description}
        </pre>
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
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
      className="card bg-base-100 shadow-sm border-2 border-base-300 rounded-xl hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-move"
    >
      <div
        className="card-body p-3 pb-2 flex flex-col gap-2"
        onClick={() => alert('작업 상세 모달은 구현 예정입니다.')}
      >
        <h3 className="card-title text-sm font-bold block truncate max-w-[70%] whitespace-nowrap overflow-hidden cursor-pointer hover:text-primary">
          {task.title}
        </h3>
        <div className="flex items-center gap-4 mt-1">
          {task.startDate && task.endDate && (
            <div className="flex items-center gap-1 text-xs text-base-content/50">
              <Calendar size={14} />
              <span>
                {task.startDate} ~ {task.endDate}
              </span>
            </div>
          )}
          <div
            className={`badge badge-soft ${
              PriorityInfo[task.priority].className
            } badge-xs text-xs px-2 rounded-full`}
          >
            {PriorityInfo[task.priority].text}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: Status;
  overId?: string | number | null;
  activeTaskId?: string;
}

function TaskColumn({ title, tasks, status, overId, activeTaskId }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });
  const [showInput, setShowInput] = useState(false);
  const [inputTitle, setInputTitle] = useState('');
  const inputRef = useRef<HTMLDivElement>(null);

  const handleAddTask = () => setShowInput(true);
  const handleSubmit = () => {
    if (!inputTitle.trim()) return;
    alert('저장!');
    setInputTitle('');
    setShowInput(false);
  };

  useEffect(() => {
    if (!showInput) return;
    function handleClick(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowInput(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showInput]);

  const getTaskStatusClassName = () => {
    switch (status) {
      case Status.TODO:
        return {
          dotColor: 'bg-base-content/50',
          titleClassName: 'text-base-content/70 text-[12px]',
        };
      case Status.DOING:
        return {
          titleClassName: 'text-warning text-[12px]',
          dotColor: 'bg-warning/80',
        };
      case Status.DONE:
        return { titleClassName: 'text-success', dotColor: 'bg-success/80' };
      default:
        return {
          dotColor: 'bg-base-content/50',
          titleClassName: 'text-base-content/70 text-[12px]',
        };
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`bg-base-100 border border-base-300 rounded-2xl p-5 min-w-[270px] flex flex-col justify-between gap-3 shadow-sm h-full`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${getTaskStatusClassName().dotColor}`}></span>
          <span className={`font-bold text-base ${getTaskStatusClassName().titleClassName}`}>
            {title}
          </span>
        </div>
        <span className="badge badge-ghost badge-sm px-2 py-0.5 rounded-full font-medium text-xs">
          {tasks.length}
        </span>
      </div>
      <div className="text-xs text-base-content/50 mb-2 pl-1">{StatusInfo[status].description}</div>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 flex-1">
          {tasks.map((task) => (
            <div key={task.id} className="relative">
              {overId === task.id && activeTaskId !== task.id && (
                <div className="absolute -top-2 left-0 w-full h-2 flex items-center z-10">
                  <div className="w-full h-1 rounded bg-blue-400" />
                </div>
              )}
              <TaskCard task={task} />
            </div>
          ))}
          {overId === status && (
            <div className="w-full h-2 flex items-center">
              <div className="w-full h-1 rounded bg-blue-400" />
            </div>
          )}
        </div>
        <div className="mt-24">
          {showInput ? (
            <div
              ref={inputRef}
              className="flex items-center gap-2 w-full px-2 py-1 mt-1 mb-0 bg-transparent"
              style={{ border: 'none', borderRadius: '8px' }}
            >
              <button
                className="p-0 m-0 bg-transparent border-none shadow-none outline-none flex items-center justify-center"
                style={{ minWidth: 32, height: 32 }}
                onClick={handleSubmit}
              >
                <Plus size={20} className="text-base-content/50" />
              </button>
              <input
                className="flex-1 bg-transparent border-none text-base h-8 px-2"
                style={{
                  fontSize: '16px',
                  lineHeight: '1.5',
                  minHeight: '40px',
                  height: '40px',
                  padding: '0 8px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  boxShadow: 'none',
                }}
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit();
                }}
                autoFocus
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.boxShadow = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          ) : (
            <button
              onClick={handleAddTask}
              className="w-full px-2 py-1 mt-1 mb-0 bg-transparent flex items-center gap-2 text-base-content/50 hover:text-base-content/80"
              style={{
                border: 'none',
                borderRadius: '8px',
                minHeight: 40,
                justifyContent: 'flex-start',
              }}
            >
              <Plus size={20} className="text-base-content/50" />
              <span className="text-base font-normal">Add item</span>
            </button>
          )}
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
  const [overId, setOverId] = useState<string | number | null>(null);

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

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setOverId(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) {
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

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? { ...task, status: overTask.status } : task))
      );
      return;
    }

    const newStatus = overId as Status;
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-3 gap-4">
        <TaskColumn
          title="대기중"
          tasks={todoTasks}
          status={Status.TODO}
          overId={overId}
          activeTaskId={activeTask?.id}
        />
        <TaskColumn
          title="진행중"
          tasks={doingTasks}
          status={Status.DOING}
          overId={overId}
          activeTaskId={activeTask?.id}
        />
        <TaskColumn
          title="완료"
          tasks={doneTasks}
          status={Status.DONE}
          overId={overId}
          activeTaskId={activeTask?.id}
        />
      </div>
      {typeof window !== 'undefined' &&
        createPortal(
          <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}

export default function GoalDetailPage() {
  // TODO: 실제 데이터로 교체
  const goal = {
    title: '프로젝트 완성하기',
    description: `프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기
      프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기
      프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기
      프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기 프로젝트의 모든 기능을 구현하고 배포하기`,
    progress: 60,
    startDate: '2024-03-01',
    endDate: '2025-06-15',
    tasks: [
      {
        id: '1',
        title: '프론트엔드 개발 프론트엔드 개발 프론트엔드 개발프론트엔드 개발프론트엔드 개발',
        description:
          'React와 TypeScript를 사용하여 프론트엔드 구현 React와 TypeScript를 사용하여 프론트엔드 구현 React와 TypeScript를 사용하여 프론트엔드 구현 React와 TypeScript를 사용하여 프론트엔드 구현',
        status: Status.DOING,
        priority: Priority.HIGH,
        startDate: '2024-03-01',
        endDate: '2024-04-01',
      },
      {
        id: '2',
        title: '백엔드 개발',
        description: 'Node.js와 Express를 사용하여 백엔드 구현',
        status: Status.TODO,
        priority: Priority.MEDIUM,
        startDate: '2024-04-01',
        endDate: '2024-05-01',
      },
      {
        id: '3',
        title: '배포',
        description: 'AWS를 사용하여 애플리케이션 배포',
        status: Status.DONE,
        priority: Priority.LOW,
        startDate: '2024-05-01',
        endDate: '2024-05-15',
      },
      {
        id: '4',
        title: '배포 예정',
        description: '배포 예정 작업',
        status: Status.TODO,
        priority: Priority.LOW,
        startDate: '2024-05-01',
        endDate: '2024-05-15',
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
