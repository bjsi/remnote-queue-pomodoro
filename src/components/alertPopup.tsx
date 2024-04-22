import { AppEvents, WidgetLocation, useAPIEventListener, usePlugin } from '@remnote/plugin-sdk';

interface AlertPopupProps {
  title: string;
  message: string;
}

export function AlertPopup(props: AlertPopupProps) {
  const plugin = usePlugin();
  useAPIEventListener(AppEvents.QueueCompleteCard, undefined, async () => {
    const { floatingWidgetId } =
      await plugin.widget.getWidgetContext<WidgetLocation.FloatingWidget>();
    await plugin.window.closeFloatingWidget(floatingWidgetId);
  });
  return (
    <div
      onClick={async () => {
        const { floatingWidgetId } =
          await plugin.widget.getWidgetContext<WidgetLocation.FloatingWidget>();
        await plugin.window.closeFloatingWidget(floatingWidgetId);
      }}
      className="p-4 border border-solid rounded-lg shadow-md cursor-pointer rn-clr-background-primary rn-clr-content-primary rn-clr-border-opaque"
      style={{
        width: 260,
      }}
    >
      <div className="text-lg">{props.title}</div>
      <div className="rn-clr-content-secondary">{props.message}</div>
    </div>
  );
}
