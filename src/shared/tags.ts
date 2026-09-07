declare const __VALLOX_PREVIEW__: boolean;
export const CARD_TAG = typeof __VALLOX_PREVIEW__ !== 'undefined' && __VALLOX_PREVIEW__ ? 'vallox-iv-card-v2-preview' : 'vallox-iv-card';
export const EDITOR_TAG = `${CARD_TAG}-editor`;
