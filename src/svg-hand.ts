/**
 * SVG rendering for a single bridge hand.
 * Extracted from bridge-forge/sidecar-bridge-render/src/hand.ts
 */

import { handElements, type Hand } from './svg-util.js';

export interface HandInput {
	label?: string;
	cards: Hand;
}

export function renderHandSvg(input: HandInput): string {
	const label = input.label ?? 'Hand';
	const H = 90;
	const W = Math.max(90, 50 + (input.cards.S.length * 7.2 + 12));
	return (
		`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" class="bridge-hand-svg">\n` +
		handElements(0, 0, input.cards, label, W, H) + '\n' +
		`</svg>`
	);
}
