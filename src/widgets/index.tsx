import {
  AppEvents,
  declareIndexPlugin,
  PropertyType,
  ReactRNPlugin,
  WidgetLocation,
} from '@remnote/plugin-sdk';
import '../style.css';
import {
  pomodoroBreakTimerKey,
  pomodoroDateCode,
  pomodoroLengthCode,
  pomodoroLongTimerKey,
  pomodoroPlayAlarmKey,
  pomodoroPowerupCode,
  pomodoroStartedCode,
} from '../lib/consts';
import { updatePomodoroState } from '../lib/state';

async function onActivate(plugin: ReactRNPlugin) {
  await plugin.settings.registerBooleanSetting({
    id: pomodoroPlayAlarmKey,
    title: 'Play Alarm Sound',
    defaultValue: true,
  });

  await plugin.settings.registerNumberSetting({
    id: pomodoroLongTimerKey,
    title: 'Long Timer Length (minutes)',
    defaultValue: 25,
  });

  await plugin.settings.registerNumberSetting({
    id: pomodoroBreakTimerKey,
    title: 'Break Timer Length (minutes)',
    defaultValue: 5,
  });

  await plugin.app.registerPowerup({
    name: 'Queue Pomodoro',
    code: pomodoroPowerupCode,
    description: 'Represents a pomodoro session in the queue.',
    options: {
      slots: [
        {
          code: pomodoroDateCode,
          name: 'Date',
          propertyType: PropertyType.DATE,
          onlyProgrammaticModifying: true,
        },
        {
          code: pomodoroLengthCode,
          name: 'Length',
          propertyType: PropertyType.NUMBER,
          onlyProgrammaticModifying: true,
        },
        {
          code: pomodoroStartedCode,
          name: 'Started At',
          propertyType: PropertyType.TEXT,
          onlyProgrammaticModifying: true,
        },
      ],
    },
  });

  plugin.event.addListener(AppEvents.QueueEnter, undefined, () => {
    updatePomodoroState(plugin, undefined);
  });

  await plugin.app.registerWidget('options', WidgetLocation.FloatingWidget, {
    dimensions: { height: 'auto', width: '100%' },
  });

  const os = await plugin.app.getOperatingSystem();
  if (os === 'android' || os === 'ios') {
    await plugin.app.registerWidget('pomodoro', WidgetLocation.QueueBelowTopBar, {
      dimensions: { height: 'auto', width: '100%' },
    });
  } else {
    await plugin.app.registerWidget('pomodoro', WidgetLocation.QueueToolbar, {
      dimensions: { height: 'auto', width: '100%' },
    });
  }
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
