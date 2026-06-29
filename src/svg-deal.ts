/**
 * SVG rendering for a bridge deal (all 4 hands in compass layout).
 * Extracted from bridge-forge/sidecar-bridge-render/src/deal.ts
 */

import { handElements, type Hand } from './svg-util.js';
import { x } from './svg-util.js';

export interface DealInput {
	label?: string;
	dealer?: string;
	hands: {
		North: Hand;
		South: Hand;
		East: Hand;
		West: Hand;
	};
}

export function renderDealSvg(input: DealInput): string {
	const HW = 155, HH = 90;
	const gapX = 30, gapY = 12;
	const labelH = 18;

	// Layout: North centered over W/E row
	const row2W = HW * 2 + gapX;  // 340
	const northX = Math.round((row2W - HW) / 2);  // 92

	const northY = labelH;
	const row2Y = northY + HH + gapY;
	const southY = row2Y + HH + gapY;

	const totalW = row2W;
	const totalH = southY + HH + 8;

	const labelParts: string[] = [];
	if (input.label) labelParts.push(x(input.label));
	if (input.dealer) labelParts.push(`Dealer: ${x(input.dealer)}`);
	const titleEl = labelParts.length
		? `  <text x="${totalW / 2}" y="13" font-family="Arial,sans-serif" font-size="11" ` +
		  `font-weight="bold" fill="#6b7280" text-anchor="middle">${labelParts.join(' · ')}</text>`
		: '';

	return [
		`<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" class="bridge-deal-svg">`,
		titleEl,
		handElements(northX, northY, input.hands.North, 'North', HW, HH),
		handElements(0, row2Y, input.hands.West, 'West', HW, HH),
		handElements(HW + gapX, row2Y, input.hands.East, 'East', HW, HH),
		handElements(northX, southY, input.hands.South, 'South', HW, HH),
		'</svg>'
	].filter(Boolean).join('\n');
}
