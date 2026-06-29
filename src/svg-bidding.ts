/**
 * SVG rendering for bridge bidding tables.
 * Extracted from bridge-forge/sidecar-bridge-render/src/bidding.ts
 */

import { x } from './svg-util.js';

export interface BiddingRound {
	north: string;
	south: string;
	east: string;
	west: string;
}

export interface BiddingInput {
	label?: string;
	dealer?: string;
	rounds: BiddingRound[];
}

const DEALER_NAME: Record<string, string> = {
	N: 'North', E: 'East', S: 'South', W: 'West'
};

// Column widths: 4 seats
const COLS = [
	{ key: 'N',   label: 'N',   w: 46 },
	{ key: 'E',   label: 'E',   w: 46 },
	{ key: 'S',   label: 'S',   w: 46 },
	{ key: 'W',   label: 'W',   w: 46 }
];

const TOTAL_W = COLS.reduce((s, c) => s + c.w, 0); // 184
const HEADER_H = 22;
const ROW_H = 18;

function colX(idx: number): number {
	let x = 0;
	for (let i = 0; i < idx; i++) x += COLS[i].w;
	return x;
}

export function renderBiddingSvg(input: BiddingInput): string {
	const rounds = input.rounds ?? [];
	const labelH = (input.label || input.dealer) ? 18 : 0;
	const totalH = labelH + HEADER_H + rounds.length * ROW_H + 2;

	const labelParts: string[] = [];
	if (input.label) labelParts.push(x(input.label));
	if (input.dealer) labelParts.push(`Dealer: ${x(DEALER_NAME[input.dealer] ?? input.dealer)}`);
	const titleEl = labelParts.length
		? `  <text x="${TOTAL_W / 2}" y="13" font-family="Arial,sans-serif" font-size="11" ` +
		  `font-weight="bold" fill="#6b7280" text-anchor="middle">${labelParts.join(' · ')}</text>`
		: '';

	// Header row
	const headerCells = COLS.map((col, i) => {
		const cx = colX(i);
		return (
			`  <rect x="${cx}" y="${labelH}" width="${col.w}" height="${HEADER_H}" ` +
			`fill="#f3f4f6" stroke="#e5e7eb" stroke-width="0.5"/>` +
			`  <text x="${cx + col.w / 2}" y="${labelH + HEADER_H - 6}" ` +
			`font-family="Arial,sans-serif" font-size="11" font-weight="bold" ` +
			`fill="#374151" text-anchor="middle">${x(col.label)}</text>`
		);
	}).join('\n');

	// Data rows
	const dataCells = rounds.map((round, ri) => {
		const ry = labelH + HEADER_H + ri * ROW_H;
		const bg = ri % 2 === 0 ? 'white' : '#f9fafb';
		const values = ['N', 'E', 'S', 'W'].map((k) => {
			const map: Record<string, string> = { N: 'north', E: 'east', S: 'south', W: 'west' };
			return round[map[k] as keyof BiddingRound] || '—';
		});
		return COLS.map((col, ci) => {
			const cx = colX(ci);
			return (
				`  <rect x="${cx}" y="${ry}" width="${col.w}" height="${ROW_H}" ` +
				`fill="${bg}" stroke="#e5e7eb" stroke-width="0.5"/>` +
				`  <text x="${cx + col.w / 2}" y="${ry + ROW_H - 4}" ` +
				`font-family="'Courier New',monospace" font-size="11" ` +
				`fill="#374151" text-anchor="middle">${x(values[ci])}</text>`
			);
		}).join('\n');
	}).join('\n');

	return [
		`<svg xmlns="http://www.w3.org/2000/svg" width="${TOTAL_W}" height="${totalH}" class="bridge-bidding-svg">`,
		titleEl,
		headerCells,
		dataCells,
		'</svg>'
	].filter(Boolean).join('\n');
}
