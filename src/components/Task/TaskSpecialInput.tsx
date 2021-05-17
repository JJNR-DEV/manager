interface Props {
  inputs: {
    foodCarbs?: number
    foodFat?: number
    foodProtein?: number
    workDeadline?: string | number | Date
  } | null
};

const TaskSpecialInput: React.FC<Props> = ({ inputs }) => {
  let toRender = '';

  const renderInputs = () => {
    for (let element in inputs) {
      switch (element) {
        case 'workDeadline':
          toRender =
            toRender +
            `
              <div style="padding: 5px 0">
                <span>Dead Line: </span>
                ${ inputs[element] }
              </div>
            `;
          break;
        case 'foodCarbs':
          toRender =
            toRender +
            `
              <div style="padding: 5px 0">
                <span>Carbohydrates: </span>
                ${ inputs[element] }
              </div>
            `;
          break;
        case 'foodFat':
          toRender =
            toRender +
            `
              <div style="padding: 5px 0">
                <span>Fat: </span>
                ${ inputs[element] }
              </div>
            `;
          break;
        case 'foodProtein':
          toRender =
            toRender +
            `
              <div style="padding: 5px 0">
                <span>Protein: </span>
                ${ inputs[element] }
              </div>
            `;
          break;
        default:
          break;
      }
    }
  };

  renderInputs();

  return (
    <div
      className='specialInputContainer'
      dangerouslySetInnerHTML={{ __html: toRender }}
    />
  );
}

export default TaskSpecialInput;
