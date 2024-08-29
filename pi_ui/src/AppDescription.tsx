import { AppStateEnum } from './App';

export const AppDescription = (props) => {
  const [state] = props.state;

  const classlistFor = (
    curr: string,
    section: string,
    isListItem: boolean = false,
  ) => {
    let key = '!text-base font-semibold not-italic';
    if (isListItem) {
      key += ' underline';
    }
    return {
      [key]: curr == section,
    };
  };

  return (
    <div class='m-1 rounded-lg bg-stone-100 p-2 text-left text-base italic text-emerald-600 shadow-xl shadow-stone-400'>

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
        <li class='mt-2'>
          <p>
            <span class='text-md ml-2 bg-stone-100 p-1 not-italic text-purple-700'>
              &pi;
            </span>
            <span
              class='rounded-md p-2'
              classList={classlistFor(state(), AppStateEnum.HISTOGRAM, true)}
            >
              HISTOGRAM
            </span>{' '}
            - shows the number of times each digit appears in Pi for the selected algorithm
          </p>
        </li>
      </ul>
    </div>
  );
};

export const PiHaiku = () => (
  <div class='mb-4 m-4 p-4 rounded-lg text-lg font-semibold bg-stone-50 text-stone-400 shadow-inner shadow-emerald-700'>
    <div class='hover:text-emerald-300'>
      <p>Three one four.</p>
      <p>Pi.</p>
      <p>The best number.</p>
    </div>
    <br />
    <div class='hover:text-emerald-300'>
      <p>Today is Pi Day.</p>
      <p>Three point one four one five nine</p>
      <p>Joy is warm pot pi.</p></div>
  </div>
);
