export const useSocket = <T>(type: EventType | EventType[], callback: (event: MessageEvent<T>) => void | Promise<void>) =>
{
    const eventTypes = Array.isArray(type) ? type : [type];

    const { eventSource } = useEventSource("/api/_ws", eventTypes, {
        autoConnect: true,
        autoReconnect: true,
        immediate: true,
    });

    eventTypes.forEach((eventType) =>
    {
        eventSource.value?.addEventListener(eventType, async (event) =>
        {
            await callback(event);
        });
    });

    onUnmounted(() =>
    {
        console.log("Unmounting socket");
        eventTypes.forEach((eventType) =>
        {
            eventSource.value?.removeEventListener(eventType, callback);
        });
        eventSource.value?.close();
    });

    return { eventSource };
};
