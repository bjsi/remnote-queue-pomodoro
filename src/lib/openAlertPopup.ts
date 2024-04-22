import { RNPlugin } from '@remnote/plugin-sdk';

type AlertType = 'pomodoro' | 'break';

export async function openAlertPopup(plugin: RNPlugin, type: AlertType) {
  await plugin.window.closeAllFloatingWidgets();
  await plugin.window.openFloatingWidget(
    type === 'pomodoro' ? 'pomodoroFinishedPopup' : 'breakFinishedPopup',
    { top: -100, left: 100 },
    'spaced-repetition__bottom'
  );
  setTimeout(async () => {
    await plugin.window.closeAllFloatingWidgets();
  }, 8000);
}
