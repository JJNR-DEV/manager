export const handleChange = (userInput: any, setToDo: any, toDo: any) => {
  const inputInfo = userInput.target

  switch (inputInfo.name) {
    case 'toDoName':
      setToDo({ ...toDo, name: inputInfo.value });
      break;
    case 'toDoDesc':
      setToDo({ ...toDo, description: inputInfo.value });
      break;
    case 'toDoType':
      const clearSpecialInput = { ...toDo, specialInput: {} };
      setToDo({ ...clearSpecialInput, taskType: inputInfo.value });
      break;
    case 'otherName':
      setToDo({ ...toDo, taskType: inputInfo.value });
      break;
    case 'toDoPrice':
      setToDo({ ...toDo, price: +inputInfo.value });
      break;
    case 'foodCarbs':
      setToDo({
        ...toDo,
        specialInput: { ...toDo.specialInput, foodCarbs: +inputInfo.value },
      });
      break;
    case 'foodFat':
      setToDo({
        ...toDo,
        specialInput: { ...toDo.specialInput, foodFat: +inputInfo.value },
      });
      break;
    case 'foodProtein':
      setToDo({
        ...toDo,
        specialInput: { ...toDo.specialInput, foodProtein: +inputInfo.value },
      });
      break;
    case 'workDeadline':
      setToDo({
        ...toDo,
        specialInput: { ...toDo.specialInput, workDeadline: inputInfo.value },
      });
      break;
    default:
      return;
  }
};
