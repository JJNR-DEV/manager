import {
  emptyFields,
  foodTypeValidation,
  workTypeValidation
} from './formValidations';

import { Task, FormRefFields } from '../../../interfaces';

export const handleSubmit = (
  e: React.FormEvent<HTMLFormElement>,
  task: Task,
  cb: Function,
  fields: FormRefFields
) => {
  e.preventDefault();
  if (!emptyFields(task.name.toString())) {
    fields.nameField.current!.style.borderColor = 'red';
    return;
  }

  switch (task.taskType) {
    case 'Food':
      const validFoodTypes = foodTypeValidation(task.specialInput!, fields);
      if (validFoodTypes) {
        cb(task);
      }
      break;
    case 'Work':
      const validDeadline = workTypeValidation(task.specialInput!);
      validDeadline ? cb(task) : fields.deadlineField.current!.style.borderColor = 'red';
      break;
    default:
      cb(task);
  }
};
