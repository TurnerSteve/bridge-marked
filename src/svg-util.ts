/**
 * SVG rendering utilities for bridge hands, deals, and bidding.
 * Extracted from bridge-forge/sidecar-bridge-render/src/svg.ts
 */

export function x(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export const SUIT_COLOR: Record<string, string> = {
	S: '#1d4ed8', // blue-700
	H: '#dc2626', // red-600
	D: '#ea580c', // orange-600
	C: '#111827'  // near-black
};

export const SUIT_GLYPH: Record<string, string> = {
	S: '♠', H: '♥', D: '♦', C: '♣'
};

export type Hand = { S: string; H: string; D: string; C: string };

// Courier New 12px metrics:
//   ASCII chars (ranks, spaces): ~7.2px advance width
//   Unicode suit glyphs (♠♥♦♣): ~12px (wider than ASCII at this size)
const ASCII_W = 7.2;
const GLYPH_W = 12;
const SPACE_W = 7.2;
const PAD_L = 7;   // left offset where text starts (inside the rect)

export function handWidth(hand: Hand, label: string): number {
	const suits: Array<keyof Hand> = ['S', 'H', 'D', 'C'];
	// Each row: suit glyph + space + cards string (no spaces between ranks)
	const maxCards = Math.max(...suits.map(s => (hand[s] || '—').length));
	const textW = GLYPH_W + SPACE_W + maxCards * ASCII_W;
	// Label uses Arial 11px bold — approximate at 7px/char
	const labelW = label.length * 7;
	return Math.ceil(Math.max(textW, labelW) + PAD_L);
}

export function handElements(
	ox: number,
	oy: number,
	hand: Hand,
	label: string,
	w?: number,
	h = 90
): string {
	const width = w ?? handWidth(hand, label);
	const suits: Array<keyof Hand> = ['S', 'H', 'D', 'C'];
	const rowH = Math.floor((h - 22) / 4);

	const rows = suits.map((s, i) => {
		const ry = oy + 22 + i * rowH + rowH - 4;
		const cards = hand[s] || '—';
		return `  <text x="${ox + PAD_L}" y="${ry}" font-family="'Courier New',monospace" font-size="12">` +
			`<tspan fill="${SUIT_COLOR[s]}" font-weight="bold">${SUIT_GLYPH[s]}</tspan>` +
			`<tspan fill="#374151"> ${x(cards)}</tspan></text>`;
	}).join('\n');

	return (
		`  <rect x="${ox}" y="${oy}" width="${width}" height="${h}" rx="5" ` +
		`fill="white" stroke="#e2e8f0" stroke-width="1"/>\n` +
		`  <text x="${ox + PAD_L}" y="${oy + 14}" font-family="Arial,sans-serif" ` +
		`font-size="11" font-weight="bold" fill="#111827">${x(label)}</text>\n` +
		rows
	);
}
