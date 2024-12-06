import _ from "lodash"


export function arrayToRecord<T extends Record<string, any>>(
    arr: T[] = [],
    key: keyof T
): Record<string, T> {
    return arr.reduce((obj: Record<string, T>, cur) => {
        obj[_.get(cur, key)] = cur;
        return obj;
    }, {} as Record<string, T>);
}