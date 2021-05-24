import { MutableRefObject } from 'react';

export interface Task {
  id?: string
  name: string
  description: string
  taskType: string
  specialInput: {
    foodCarbs?: number
    foodFat?: number
    foodProtein?: number
    workDeadline?: string | Date
  } | null
  price: null | number
  concluded: boolean
  userOrigin: string
  lastUpdatedBy?: null | string
  outsideViewer?: null | string
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

export interface FormRefFields {
  nameField: MutableRefObject<null> | { current: HTMLInputElement }
  deadlineField: MutableRefObject<null> | { current: HTMLInputElement }
  foodCarbsField: MutableRefObject<null> | { current: HTMLInputElement }
  foodFatField: MutableRefObject<null> | { current: HTMLInputElement }
  foodProteinField: MutableRefObject<null> | { current: HTMLInputElement }
}
