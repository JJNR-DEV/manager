import swal from 'sweetalert';

import { FormRefFields } from '../../../interfaces';

export const emptyFields = (name: string) => {
  // actually required for RegEx
  // eslint-disable-next-line no-useless-escape
  const whiteSpaces = new RegExp('^\s+$');

  if(name ===  '') {
    swal('Could not submit!', 'Name is required', 'error');
    return false;
  } else if(whiteSpaces.test(name)) {
    swal('Could not submit!', 'Please fill in Name', 'error');
    return false;
  } else {
    return true;
  }
}

export const foodTypeValidation = (inputs: {
  foodCarbs?: number,
  foodFat?: number,
  foodProtein?: number
}, fields: FormRefFields
) => {
  const allInputs = Object.keys(inputs);

  if(!allInputs.includes('foodCarbs')){
    fields.foodCarbsField.current!.style.borderColor = 'red';
    swal('Could not submit!', 'Please provide in grams the carbohydrates amount', 'error');
    return false;
  } else if(!allInputs.includes('foodFat')){
    fields.foodFatField.current!.style.borderColor = 'red';
    swal('Could not submit!', 'Please provide in grams the fat amount', 'error');
    return false;
  } else if(!allInputs.includes('foodProtein')){
    fields.foodProteinField.current!.style.borderColor = 'red';
    swal('Could not submit!', 'Please provide in grams the protein amount', 'error');
    return false;
  } else {
    return true;
  }
};

export const workTypeValidation = (inputs: {
  workDeadline?: string | number | Date
}) => {
  if(!Object.keys(inputs).includes('workDeadline')) {
    swal('Could not submit!', 'Please provide a deadline date', 'error');
    return false;
  } else {
    const currentDate = new Date();
    const dateProvided = new Date(inputs.workDeadline!);

    if(isNaN(dateProvided.getTime())) {
      swal('Could not submit!', 'Please provide a valid date following the correct format', 'error');
      return false;
    } else if(currentDate.getTime() > dateProvided.getTime()) {
      swal('Could not submit!', 'The date provided is prior to today', 'error');
      return false;
    } else {
      return true;
    }
  }
};
