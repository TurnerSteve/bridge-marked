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
	seats?: string;
	rounds: BiddingRound[];
	annotations?: { bid: string; meaning: string }[];
	nextBids?: { bid: string; meaning: string }[];
	nextBidsLabel?: string;
}

const DEALER_NAME: Record<string, string> = {
	N: 'North', E: 'East', S: 'South', W: 'West'
};

const HEADER_H = 22;
const ROW_H = 18;

function seatColumns(seats?: string): Array<{ key: string; label: string; w: number }> {
	const normalized = (seats ?? '').toUpperCase();
	if (normalized === 'NS') {
		return [
			{ key: 'N', label: 'N', w: 46 },
			{ key: 'S', label: 'S', w: 46 }
		];
	}
	if (normalized === 'EW') {
		return [
			{ key: 'W', label: 'W', w: 46 },
			{ key: 'E', label: 'E', w: 46 }
		];
	}
	return [
		{ key: 'N', label: 'N', w: 46 },
		{ key: 'E', label: 'E', w: 46 },
		{ key: 'S', label: 'S', w: 46 },
		{ key: 'W', label: 'W', w: 46 }
	];
}

function colX(idx: number, cols: Array<{ key: string; label: string; w: number }>): number {
	let x = 0;
	for (let i = 0; i < idx; i++) x += cols[i].w;
	return x;
}

function renderDetailTable(input: { offsetX: number; y: number; width: number; title: string; headerLeft: string; headerRight: string; rows: { left: string; right: string }[] }): { svg: string; height: number } {
	const { offsetX, y, width, title, headerLeft, headerRight, rows } = input;
	const titleH = 18;
	const headerH = 22;
	const rowH = 18;
	const bodyH = rows.length * rowH;
	const height = titleH + headerH + bodyH + 12;
	const leftW = 56;
	const rightW = width - leftW;

	const titleEl = `  <text x="${offsetX + 8}" y="${y + 13}" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="#374151">${x(title)}</text>`;
	const headerEl = `  <rect x="${offsetX}" y="${y + titleH}" width="${width}" height="${headerH}" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="0.5"/>` +
		`  <text x="${offsetX + leftW / 2}" y="${y + titleH + headerH - 6}" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#374151" text-anchor="middle">${x(headerLeft)}</text>` +
		`  <text x="${offsetX + leftW + rightW / 2}" y="${y + titleH + headerH - 6}" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#374151" text-anchor="middle">${x(headerRight)}</text>`;
	const rowsEl = rows.map((row, ri) => {
		const ry = y + titleH + headerH + ri * rowH;
		return (
			`  <rect x="${offsetX}" y="${ry}" width="${width}" height="${rowH}" fill="${ri % 2 === 0 ? 'white' : '#f9fafb'}" stroke="#e5e7eb" stroke-width="0.5"/>` +
			`  <text x="${offsetX + 8}" y="${ry + rowH - 4}" font-family="'Courier New',monospace" font-size="11" fill="#374151">${x(row.left)}</text>` +
			`  <text x="${offsetX + leftW + 8}" y="${ry + rowH - 4}" font-family="Arial,sans-serif" font-size="11" fill="#374151">${x(row.right)}</text>`
		);
		}).join('');

	return {
		height,
		svg: `  <g>${titleEl}${headerEl}${rowsEl}</g>`
	};
}

export function renderBiddingSvg(input: BiddingInput): string {
	const rounds = input.rounds ?? [];
	const cols = seatColumns(input.seats);
	const labelH = (input.label || input.dealer) ? 18 : 0;
	const totalW = cols.reduce((s, c) => s + c.w, 0);
	const totalH = labelH + HEADER_H + rounds.length * ROW_H + 2;

	const labelParts: string[] = [];
	if (input.label) labelParts.push(x(input.label));
	if (input.dealer) labelParts.push(`Dealer: ${x(DEALER_NAME[input.dealer] ?? input.dealer)}`);

	const detailWidth = input.annotations?.length || input.nextBids?.length ? 220 : 0;
	const detailGap = detailWidth ? 18 : 0;
	const detailTables: Array<{ svg: string; height: number }> = [];
	if (input.annotations?.length) {
		detailTables.push(renderDetailTable({
			offsetX: 0,
			y: 0,
			width: detailWidth,
			title: 'Auction explanation',
			headerLeft: 'Alert',
			headerRight: 'Meaning',
			rows: input.annotations.map(a => ({ left: a.bid, right: a.meaning }))
		}));
	}
	if (input.nextBids?.length) {
		detailTables.push(renderDetailTable({
			offsetX: 0,
			y: 0,
			width: detailWidth,
			title: input.nextBidsLabel ?? 'Continuations',
			headerLeft: 'Bid',
			headerRight: 'Description',
			rows: input.nextBids.map(n => ({ left: n.bid, right: n.meaning }))
		}));
	}
	const detailsHeight = detailTables.length ? Math.max(...detailTables.map(t => t.height)) : 0;
	const detailTotalWidth = detailTables.length ? detailTables.length * detailWidth + (detailTables.length - 1) * detailGap : 0;
	const height = Math.max(totalH, detailsHeight);
	const fullWidth = totalW + (detailTables.length ? detailGap : 0) + detailTotalWidth;
	const titleEl = labelParts.length
		? `  <text x="8" y="13" font-family="Arial,sans-serif" font-size="11" ` +
		  `font-weight="bold" fill="#6b7280">${labelParts.join(' · ')}</text>`
		: '';

	// Header row
	const headerCells = cols.map((col, i) => {
		const cx = colX(i, cols);
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
		const values = cols.map((col) => {
			const map: Record<string, string> = { N: 'north', E: 'east', S: 'south', W: 'west' };
			return round[map[col.key] as keyof BiddingRound] || '—';
		});
		return cols.map((col, ci) => {
			const cx = colX(ci, cols);
			return (
				`  <rect x="${cx}" y="${ry}" width="${col.w}" height="${ROW_H}" ` +
				`fill="${bg}" stroke="#e5e7eb" stroke-width="0.5"/>` +
				`  <text x="${cx + col.w / 2}" y="${ry + ROW_H - 4}" ` +
				`font-family="'Courier New',monospace" font-size="11" ` +
				`fill="#374151" text-anchor="middle">${x(values[ci])}</text>`
			);
		}).join('\n');
	}).join('\n');

	const detailsSvg = detailTables.map((table, i) => {
		const isFirst = i === 0;
		const isLast = i === detailTables.length - 1;
		const offsetX = totalW + detailGap + i * (detailWidth + detailGap) + (isFirst ? 8 : 0) + (isLast ? -8 : 0);
		return `  <g transform="translate(${offsetX}, 0)">${table.svg}</g>`;
	}).join('\n');

	return [
		`<svg xmlns="http://www.w3.org/2000/svg" width="${fullWidth}" height="${height}" class="bridge-bidding-svg">`,
		titleEl,
		headerCells,
		dataCells,
		detailsSvg,
		'</svg>'
	].filter(Boolean).join('\n');
}
