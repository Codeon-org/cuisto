export type AccessDeniedOptions = {
    statusCode?: number;
    statusMessage?: string;
};

export interface IVoter
{
    satisfies(subject: string, attribute: string, user: string): Promise<boolean>;
}
