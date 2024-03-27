import { RNPlugin } from '@remnote/plugin-sdk';
import { pomodoroBreakTimerKey, pomodoroLongTimerKey, pomodoroStateKey } from './consts';

export interface PomodoroState {
  type: 'break' | 'long';
  state: 'ticking' | 'stopped';
  length: number;
  minutesLeft: number;
  startedAt: number;
}

export async function getPomodoroState(plugin: RNPlugin) {
  return await plugin.storage.getLocal<PomodoroState | undefined>(pomodoroStateKey);
}

export async function updatePomodoroState(plugin: RNPlugin, state: PomodoroState | undefined) {
  await plugin.storage.setLocal(pomodoroStateKey, state);
}

export async function pausePomodoro(plugin: RNPlugin) {
  const state = await getPomodoroState(plugin);
  if (state && state.state === 'ticking') {
    await updatePomodoroState(plugin, { ...state, state: 'stopped' });
  }
}

export async function playPomodoro(plugin: RNPlugin) {
  const state = await getPomodoroState(plugin);
  if (state && state.state === 'stopped') {
    await updatePomodoroState(plugin, { ...state, state: 'ticking' });
  }
}

export async function restartPomodoro(plugin: RNPlugin) {
  const state = await getPomodoroState(plugin);
  if (state) {
    await updatePomodoroState(plugin, { ...state, state: 'ticking', minutesLeft: state.length });
  }
}

export async function startBreak(plugin: RNPlugin) {
  const breakLength = parseInt(await plugin.settings.getSetting(pomodoroBreakTimerKey));
  await updatePomodoroState(plugin, {
    type: 'break',
    state: 'ticking',
    minutesLeft: breakLength,
    startedAt: Date.now(),
    length: breakLength,
  });
}

export async function startLongPomodoro(plugin: RNPlugin) {
  const longLength = parseInt(await plugin.settings.getSetting(pomodoroLongTimerKey));
  await updatePomodoroState(plugin, {
    type: 'long',
    state: 'ticking',
    minutesLeft: longLength,
    startedAt: Date.now(),
    length: longLength,
  });
}
