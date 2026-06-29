import { parseBridgeBlock } from './src/parser.js';
import { renderAuction } from './src/renderer.js';
const raw = `label: Stayman
seats: NS
N: AKQ.J432.876.J54
S: J987.KQ5.A43.A98
1NT 2C
?
ann: 1NT | 15-17 balanced
next: 2D | No 4-card major`;
const data = parseBridgeBlock('auction', raw);
console.log('parsed=', JSON.stringify(data, null, 2));
console.log('rendered=', renderAuction(data));
