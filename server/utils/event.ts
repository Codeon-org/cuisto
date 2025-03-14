import type { IncomingMessage, ServerResponse } from "http";

const connections = new Set<{ stream: ServerResponse<IncomingMessage> }>();

export const addConnection = (stream: ServerResponse<IncomingMessage>) =>
{
    connections.add({ stream });
};

export const removeConnection = (stream: ServerResponse<IncomingMessage>) =>
{
    for (const conn of connections)
    {
        if (conn.stream === stream)
        {
            connections.delete(conn);
            break;
        }
    }
};

export const broadcast = (event: EventType, message: unknown) =>
{
    const payload = `event: ${event}\ndata: ${JSON.stringify(message)}\n\n`;
    for (const { stream } of connections)
    {
        stream.write(payload);
    }
};
