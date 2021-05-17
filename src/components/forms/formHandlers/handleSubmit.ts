import {
  emptyFields,
  foodTypeValidation,
  workTypeValidation
} from './formValidations';
import { Task } from '../../../interfaces';

export const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>,
  task: Task,
  cb: Function
) => {
  e.preventDefault();
  if (!emptyFields(task.name.toString())) return;

  switch (task.taskType) {
    case 'Food':
      const validFoodTypes = foodTypeValidation(task.specialInput!);
      if (validFoodTypes) {
        await cb(task);
      }
      break;
    case 'Work':
      const validDeadline = workTypeValidation(task.specialInput!);
      if (validDeadline) {
        await cb(task);
      }
      break;
    default:
      await cb(task);
  }
};
