import { createSignal, type Component } from 'solid-js';
import { Footer, Header, NavSwitcher, NavView } from './components';
import { PiAdapterProvider } from './pi/pi.context';
import PyVersionsView from './pi/py-versions';

export const AppStateEnum = {
  DIGITS: 'DIGITS',
  COMPARE: 'COMPARE',
};

const App: Component = () => {
  const stateSignal = createSignal<string>(AppStateEnum.DIGITS);
  return (
    <div class='text-center'>
      <Header />
      <PiAdapterProvider>
        <div class='grid grid-cols-4 gap-2'>
          <NavView state={stateSignal} />
          <NavSwitcher state={stateSignal} />
        </div>
        <Footer>
          <PyVersionsView />
        </Footer>
      </PiAdapterProvider>
    </div>
  );
};

export default App;
