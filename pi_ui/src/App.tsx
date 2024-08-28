import { createSignal, type Component } from 'solid-js';
import { Footer, Header, MainSwitcher, NavView } from './components';
import { PiAdapterProvider } from './pi/pi.context';
import PyVersionsView from './pi/py-versions';

export const AppStateEnum = {
  DIGITS: 'DIGITS',
  COMPARE: 'COMPARE',
  HISTOGRAM: 'HISTOGRAM',
};

const App: Component = () => {
  const stateSignal = createSignal<string>(AppStateEnum.DIGITS);
  return (
    <div class='text-center'>
      <Header />
      <PiAdapterProvider>
        <div class='grid grid-cols-4 gap-2'>
          <NavView state={stateSignal} />
          <MainSwitcher state={stateSignal} />
        </div>
        <Footer>
          <PyVersionsView />
        </Footer>
      </PiAdapterProvider>
    </div>
  );
};

export default App;
