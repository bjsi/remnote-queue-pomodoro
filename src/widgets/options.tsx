import { renderWidget, useLocalStorageState, usePlugin } from '@remnote/plugin-sdk';
import { pomodoroStateKey } from '../lib/consts';
import {
  PomodoroState,
  pausePomodoro,
  playPomodoro,
  restartPomodoro,
  startBreak,
  startLongPomodoro,
} from '../lib/state';

function OptionItem(props: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onMouseDown={props.onClick}
      className={'p-4 hover:rn-clr-background--hovered ' + props.className || ''}
    >
      {props.children}
    </div>
  );
}

export function Options() {
  const plugin = usePlugin();
  const [state] = useLocalStorageState<PomodoroState | undefined>(pomodoroStateKey, undefined);

  return (
    <div className="border border-solid rounded-lg shadow-md rn-clr-background-primary rn-clr-border-opaque">
      <OptionItem
        className="rounded-t-lg"
        onClick={() => {
          if (state?.state === 'ticking') {
            pausePomodoro(plugin);
          } else if (state?.state === 'stopped') {
            playPomodoro(plugin);
          }
        }}
      >
        {state?.state === 'ticking' ? 'Pause' : 'Start'}
      </OptionItem>
      <OptionItem
        onClick={() => {
          if (state?.type === 'long') {
            startBreak(plugin);
          } else if (state?.type === 'break') {
            startLongPomodoro(plugin);
          }
        }}
      >
        {state?.type === 'long' ? 'Break' : 'Skip Break'}
      </OptionItem>
      <OptionItem
        onClick={() => {
          restartPomodoro(plugin);
        }}
        className="rounded-b-lg"
      >
        Restart
      </OptionItem>
    </div>
  );
}

renderWidget(Options);
