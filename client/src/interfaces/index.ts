export interface Task {
  id?: string
  name: string
  description: string
  taskType: string
  specialInput: {
    foodCarbs?: number
    foodFat?: number
    foodProtein?: number
    workDeadline?: string | number | Date
  } | null
  price: null | number
  concluded: boolean
  userOrigin: string
};

export interface Subtask {
  done: boolean
  name: string
  price: number | null
  subtaskId?: string
};

export interface SubtaskParentElements {
  parentId: string
  parentName: string
  parentUserOrigin: string
};
