import { destr } from "destr";

type EventCallbackMap = {
    newUser: string;
};

export const useSocket = <E extends keyof EventCallbackMap>(eventCallbacks: { [K in E]: (payload: EventCallbackMap[K]) => void | Promise<void> }) =>
{
    const config = useRuntimeConfig().public;

    const eventTypes = Object.keys(eventCallbacks) as E[];

    const { eventSource } = useEventSource(config.wsUrl, eventTypes, {
        autoConnect: true,
        autoReconnect: true,
        immediate: true,
    });

    eventTypes.forEach((eventType) =>
    {
        const callback = eventCallbacks[eventType];

        eventSource.value?.addEventListener(eventType as string, async (event) =>
        {
            const data = destr<EventCallbackMap[typeof eventType]>(event.data);

            await callback(data);
        });
    });

    // Cleanup on component unmount
    onUnmounted(() =>
    {
        eventTypes.forEach((eventType) =>
        {
            const callback = eventCallbacks[eventType];
            eventSource.value?.removeEventListener(eventType as string, callback as unknown as EventListener);
        });

        eventSource.value?.close();
    });

    return { eventSource };
};
