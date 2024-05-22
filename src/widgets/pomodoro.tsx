import {
  usePlugin,
  renderWidget,
  RNPlugin,
  useLocalStorageState,
  useRunAsync,
} from '@remnote/plugin-sdk';
import { pomodoroPlayAlarmKey, pomodoroStateKey, tomatoHeight } from '../lib/consts';
import React, { useRef } from 'react';
import { TomatoIcon } from '../components/tomato';
import { PomodoroState, startBreak, startLongPomodoro } from '../lib/state';
import { savePomodoro } from '../lib/savePomodoro';
import clsx from 'clsx';
import { openAlertPopup } from '../lib/openAlertPopup';

async function openOptionsMenu(plugin: RNPlugin) {
  const os = await plugin.app.getOperatingSystem();
  if (os === 'android' || os === 'ios') {
    await plugin.widget.openPopup('optionsPopup', undefined, true);
  } else {
    await plugin.window.openFloatingWidget(
      'optionsFloatingWidget',
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

  const [tabVisible, setTabVisible] = React.useState(true);
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      setTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const intervalRef = React.useRef<number | undefined>();
  React.useEffect(() => {
    if (state?.state === 'ticking' && tabVisible) {
      // @ts-ignore
      intervalRef.current = setInterval(() => {
        setState({ ...state, minutesLeft: state.minutesLeft - 1 });
      }, 1000 * 60);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state, tabVisible]);

  React.useEffect(() => {
    if (state?.minutesLeft != null && state.minutesLeft <= 0) {
      playAlarm();
      if (state.type === 'long') {
        openAlertPopup(plugin, 'pomodoro');
        savePomodoro({ plugin, ...state });
        startBreak(plugin);
      }
      // begin next
      else if (state?.type === 'break') {
        openAlertPopup(plugin, 'break');
        startLongPomodoro(plugin);
      }
    }
  }, [state?.minutesLeft]);

  const os = useRunAsync(async () => await plugin.app.getOperatingSystem(), []);

  return (
    <div
      onClick={() => {
        openOptionsMenu(plugin);
      }}
      className={clsx(
        'flex items-center justify-end select-none',
        os === 'ios' || os === 'android' ? 'justify-center' : 'justify-end'
      )}
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
