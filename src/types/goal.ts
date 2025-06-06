export enum Status {
  TODO = "todo",
  DOING = "doing",
  DONE = "done",
}

export const StatusText = {
  [Status.TODO]: "대기중",
  [Status.DOING]: "진행중",
  [Status.DONE]: "완료",
};

export enum Priority {
  NONE = "none",
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export const PriorityText = {
  [Priority.NONE]: "없음",
  [Priority.LOW]: "낮음",
  [Priority.MEDIUM]: "보통",
  [Priority.HIGH]: "높음",
};

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
