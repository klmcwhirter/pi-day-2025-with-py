import { AppStateEnum } from './App';

export const AppDescription = (props) => {
  const [state] = props.state;

  const classlistFor = (
    curr: string,
    section: string,
    isListItem: boolean = false,
  ) => {
    let key = '!text-lg font-semibold not-italic';
    if (isListItem) {
      key += ' underline';
    }
    return {
      [key]: curr == section,
    };
  };

  return (
    <div class='m-4 rounded-lg bg-stone-100 p-2 text-left text-lg italic text-emerald-600 shadow-xl shadow-stone-400'>

      <ul>
        <li class='mt-2'>
          <p>
            <span class='text-md ml-2 bg-stone-100 p-1 not-italic text-purple-700'>
              &pi;
            </span>
            <span
              class='rounded-md p-2'
              classList={classlistFor(state(), AppStateEnum.DIGITS, true)}
            >
              DIGITS
            </span>{' '}
            - shows a canvas where each pixel represents a digit of pi whose pixel color is mapped
            to a pallette of colors corresponding to the digits 0-9.
          </p>
        </li>
        <li class='mt-2'>
          <p>
            <span class='text-md ml-2 bg-stone-100 p-1 not-italic text-purple-700'>
              &pi;
            </span>
            <span
              class='rounded-md p-2'
              classList={classlistFor(state(), AppStateEnum.COMPARE, true)}
            >
              COMPARE
            </span>{' '}
            - shows the differences in the pi digits for 2 different algorithms
          </p>
        </li>
      </ul>
    </div>
  );
};
