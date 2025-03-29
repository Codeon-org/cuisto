import * as math from "mathjs";

export const isFormulaValid = (formula: string, scope: object): boolean =>
{
    try
    {
        math.evaluate(formula, scope);
        return true;
    }
    catch
    {
        return false;
    }
};
