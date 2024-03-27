import { usePlugin } from '@remnote/plugin-sdk';
import { tomatoHeight } from '../lib/consts';
import { PomodoroState } from '../lib/state';
import clsx from 'clsx';

interface TomatoIconProps {
  state: PomodoroState | undefined;
}

export function TomatoIcon(props: TomatoIconProps) {
  const plugin = usePlugin();
  const minutes = props.state
    ? (props.state?.minutesLeft || 0) < 10
      ? `0${props.state?.minutesLeft}`
      : props.state?.minutesLeft
    : null;
  return (
    <div
      className="relative flex items-center"
      style={{
        width: 50,
      }}
    >
      <img
        style={{
          height: tomatoHeight,
        }}
        src={plugin.rootURL + 'empty-tomato.png'}
      ></img>
      {props.state?.state === 'ticking' ? (
        <div
          className="absolute text-center"
          style={{
            left: 26.5,
            bottom: 10,
          }}
        >
          <span className={clsx('text-[11px]', props.state?.type === 'break' && 'text-green-50')}>
            {minutes}
          </span>
        </div>
      ) : (
        <div
          className="absolute text-center"
          style={{
            left: 28,
            bottom: 8,
          }}
        >
          <span className="text-[11px]">
            <img
              style={{
                height: 11,
              }}
              src={plugin.rootURL + 'pause.png'}
            ></img>
          </span>
        </div>
      )}
    </div>
  );
}
