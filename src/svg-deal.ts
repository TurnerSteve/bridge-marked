/**
 * SVG rendering for a bridge deal (all 4 hands in compass layout).
 * Extracted from bridge-forge/sidecar-bridge-render/src/deal.ts
 */

import { handElements, type Hand } from './svg-util.js';
import { x } from './svg-util.js';

export interface DealInput {
	label?: string;
	dealer?: string;
	view?: string;
	hands: {
		North: Hand;
		South: Hand;
		East: Hand;
		West: Hand;
	};
}

function normalizeDealView(view?: string): 'all' | 'ns' | 'ew' {
	const raw = (view ?? 'all').toLowerCase();
	if (raw === 'ns') return 'ns';
	if (raw === 'ew') return 'ew';
	return 'all';
}

export function renderDealSvg(input: DealInput): string {
	const HW = 155, HH = 90;
	const gapX = 30, gapY = 12;
	const labelH = 18;
	const view = normalizeDealView(input.view);

	let totalW = 0;
	let totalH = 0;
	let northX = 0;
	let northY = 0;
	let row2Y = 0;
	let southY = 0;
	let westX = 0;
	let eastX = 0;
	let y = 0;

	if (view === 'ns') {
		totalW = HW;
		totalH = labelH + HH * 2 + gapY + 8;
		northX = 0;
		northY = labelH;
		southY = northY + HH + gapY;
	} else if (view === 'ew') {
		totalW = HW * 2 + gapX;
		totalH = labelH + HH + 8;
		westX = 0;
		eastX = HW + gapX;
		y = labelH;
	} else {
		// Layout: North centered over W/E row
		const row2W = HW * 2 + gapX;  // 340
		northX = Math.round((row2W - HW) / 2);  // 92
		northY = labelH;
		row2Y = northY + HH + gapY;
		southY = row2Y + HH + gapY;
		totalW = row2W;
		totalH = southY + HH + 8;
	}

	const labelParts: string[] = [];
	if (input.label) labelParts.push(x(input.label));
	if (input.dealer) labelParts.push(`Dealer: ${x(input.dealer)}`);
	const titleEl = labelParts.length
		? `  <text x="${totalW / 2}" y="13" font-family="Arial,sans-serif" font-size="11" ` +
		  `font-weight="bold" fill="#6b7280" text-anchor="middle">${labelParts.join(' · ')}</text>`
		: '';

	const parts = [
		`<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" class="bridge-deal-svg">`,
		titleEl
	];

	if (view === 'ns') {
		parts.push(handElements(northX, northY, input.hands.North, 'North', HW, HH));
		parts.push(handElements(northX, southY, input.hands.South, 'South', HW, HH));
	} else if (view === 'ew') {
		parts.push(handElements(westX, y, input.hands.West, 'West', HW, HH));
		parts.push(handElements(eastX, y, input.hands.East, 'East', HW, HH));
	} else {
		parts.push(handElements(northX, northY, input.hands.North, 'North', HW, HH));
		parts.push(handElements(0, row2Y, input.hands.West, 'West', HW, HH));
		parts.push(handElements(HW + gapX, row2Y, input.hands.East, 'East', HW, HH));
		parts.push(handElements(northX, southY, input.hands.South, 'South', HW, HH));
	}
	parts.push('</svg>');

	return parts.filter(Boolean).join('\n');
}
