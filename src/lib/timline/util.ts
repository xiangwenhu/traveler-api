import { Timeline } from "../../types/ice";

export function getTransitionEffect(transitions: Timeline.SubTypeTransition[],
    options: Omit<Timeline.EffectTransition, "Type" | "SubType">): Timeline.EffectTransition {
    const index = Math.round(Math.random() * transitions.length);

    const subType = transitions[index] || transitions[0] || 'swap';

    return {
        Type: Timeline.EffectType.Transition,
        SubType: subType,
        Name: `transitions.${subType}`,
        ...options
    }
}

export function getTimeValue(val: number | string) {
    return +(+val).toFixed(3);
}