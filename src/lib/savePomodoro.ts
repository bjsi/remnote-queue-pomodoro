import { RNPlugin, Rem } from '@remnote/plugin-sdk';
import {
  pomodoroDateCode,
  pomodoroLengthCode,
  pomodoroPowerupCode,
  pomodoroStartedCode,
} from './consts';

interface Pomodoro {
  rem: Rem;
  startedAt: number;
  length: number;
}

export async function getDailyDocReferenceForDate(plugin: RNPlugin, date: Date) {
  const dailyDoc = await plugin.date.getDailyDoc(date);
  if (!dailyDoc) {
    return;
  }
  const dateRef = await plugin.richText.rem(dailyDoc).value();
  return dateRef;
}

export async function savePomodoro(args: {
  plugin: RNPlugin;
  length: number;
  startedAt: number;
}): Promise<Pomodoro> {
  const { plugin, length, startedAt } = args;
  const rem = (await plugin.rem.createRem())!;
  await rem.setText([`${args.length} minute pomodoro`]);
  await rem?.addPowerup(pomodoroPowerupCode);
  const startedDate = new Date(startedAt);
  await rem?.setPowerupProperty(pomodoroPowerupCode, pomodoroStartedCode, [
    startedDate.toLocaleTimeString(),
  ]);
  const dateReference = await getDailyDocReferenceForDate(plugin, startedDate);
  await rem?.setPowerupProperty(pomodoroPowerupCode, pomodoroDateCode, dateReference!);
  await rem?.setPowerupProperty(pomodoroPowerupCode, pomodoroLengthCode, [length.toString()]);
  return {
    rem,
    startedAt: Date.now(),
    length,
  };
}
