export enum Status {
  TODO = 'todo',
  DOING = 'doing',
  DONE = 'done',
}

export const StatusInfo = {
  [Status.TODO]: {
    text: '대기',
    description: '진행할 작업',
    className: 'badge-neutral',
  },
  [Status.DOING]: {
    text: '진행',
    description: '현재 진행 중인 작업',
    className: 'badge-warning',
  },
  [Status.DONE]: {
    text: '완료',
    description: '완료된 작업',
    className: 'badge-success',
  },
} as const;

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export const PriorityInfo = {
  [Priority.LOW]: {
    text: '🐢여유',
    className: 'badge badge-ghost badge-soft',
  },
  [Priority.MEDIUM]: {
    text: '💡중요',
    className: 'badge badge-warning badge-soft',
  },
  [Priority.HIGH]: {
    text: '🚨긴급',
    className: 'badge badge-error badge-soft',
  },
} as const;

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  startDate?: string;
  endDate?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  startDate: string;
  endDate: string;
  completedAt?: string;
  status: Status;
  tasks?: Task[];
}
