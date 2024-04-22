import { renderWidget } from '@remnote/plugin-sdk';
import { AlertPopup } from '../components/alertPopup';

export function PomodoroCompletePopup() {
  return <AlertPopup title="🎉 Pomodoro Complete" message="Well done! Take a break." />;
}

renderWidget(PomodoroCompletePopup);
