export function format<TObject extends Record<string, unknown>, TTemplate extends Record<string, boolean>>(
    object: TObject | TObject[],
    template: TTemplate
): Pick<TObject, Extract<keyof TObject, keyof TTemplate>> | Pick<TObject, Extract<keyof TObject, keyof TTemplate>>[]
{
    if (Array.isArray(object))
    {
        return object.map(item => applyTemplate(item, template));
    }
    return applyTemplate(object, template);
}

function applyTemplate<TObject extends Record<string, unknown>, TTemplate extends Record<string, boolean>>(
    object: TObject,
    template: TTemplate
): Pick<TObject, Extract<keyof TObject, keyof TTemplate>>
{
    const result: Partial<TObject> = {};
    for (const key in template)
    {
        if (template[key] && key in object)
        {
            result[key] = object[key];
        }
    }
    return result as Pick<TObject, Extract<keyof TObject, keyof TTemplate>>;
}
