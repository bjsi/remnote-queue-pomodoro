import { renderWidget } from '@remnote/plugin-sdk';
import { AlertPopup } from '../components/alertPopup';

export function BreakFinishedPopup() {
  return <AlertPopup title="🍅 Break Finished!" message="Time to get back to smashing tomatoes!" />;
}

renderWidget(BreakFinishedPopup);
