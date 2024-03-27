import { usePlugin, renderWidget, RNPlugin, useLocalStorageState } from '@remnote/plugin-sdk';
import { pomodoroPlayAlarmKey, pomodoroStateKey, tomatoHeight } from '../lib/consts';
import React, { useRef } from 'react';
import { TomatoIcon } from '../components/tomato';
import { PomodoroState, startBreak, startLongPomodoro } from '../lib/state';
import { savePomodoro } from '../lib/savePomodoro';

async function openOptionsMenu(plugin: RNPlugin) {
  const os = await plugin.app.getOperatingSystem();
  if (os === 'android' || os === 'ios') {
  } else {
    await plugin.window.openFloatingWidget(
      'options',
      { top: tomatoHeight + 5, left: 0 },
      'rn-queue__widget-toolbar div[data-plugin-id="remnote-queue-pomodoro"]'
    );
  }
}

export const Pomodoro = () => {
  const plugin = usePlugin();
  const [state, setState] = useLocalStorageState<PomodoroState | undefined>(
    pomodoroStateKey,
    undefined
  );
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAlarm = async () => {
    const shouldPlay = !!(await plugin.settings.getSetting(pomodoroPlayAlarmKey));
    if (audioRef.current && shouldPlay) {
      audioRef.current.play();
    }
  };

  React.useEffect(() => {
    startLongPomodoro(plugin);
  }, []);

  React.useEffect(() => {
    const ivl = setInterval(() => {
      if (state?.state === 'ticking') {
        setState({ ...state, minutesLeft: state?.minutesLeft - 1 });
      }
    }, 1000 * 10);
    return () => clearInterval(ivl);
  }, [state]);

  React.useEffect(() => {
    if (state?.minutesLeft === 0) {
      if (state.type === 'long') {
        playAlarm();
        savePomodoro({ plugin, ...state });
      }
      // begin next
      if (state?.type === 'break') {
        startLongPomodoro(plugin);
      } else if (state?.type === 'long') {
        startBreak(plugin);
      }
    }
  }, [state?.minutesLeft]);

  return (
    <div
      onClick={() => {
        openOptionsMenu(plugin);
      }}
      className="flex items-center justify-end select-none"
      style={{
        height: tomatoHeight,
      }}
    >
      <audio ref={audioRef} src={plugin.rootURL + 'alarm.mp3'} />
      <TomatoIcon state={state}></TomatoIcon>
    </div>
  );
};

renderWidget(Pomodoro);
