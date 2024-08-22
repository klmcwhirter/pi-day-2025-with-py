import { Component, For, Show } from 'solid-js';
import { usePiState } from './pi.context';

const PyVersionsView: Component = () => {
  const piState = usePiState();

  return (
    <div>
      <Show when={piState.stateInitialized()}>
        <For each={piState.version}>
          {(s) => <span class='p-2'>{s}</span>}
        </For>
      </Show>
    </div>
  );
};

export default PyVersionsView;
