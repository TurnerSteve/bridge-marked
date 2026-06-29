import { describe, expect, it } from 'vitest';
import { parseBridgeBlock } from '../src/parser.js';

describe('parseBridgeBlock', () => {
  it('parses a single hand block', () => {
    const data = parseBridgeBlock('hand', 'North: AKQ.432.876.J543');
    expect(data).toEqual({
      label: 'North',
      cards: { S: 'AKQ', H: '432', D: '876', C: 'J543' }
    });
  });

  it('parses multiple hands with title and perRow', () => {
    const data = parseBridgeBlock('hands', 'title: Example\nperRow: 2\nNorth: AKQ.432.876.J543\nSouth: 543.AKQ.987.32');
    expect(data).toEqual({
      title: 'Example',
      perRow: 2,
      hands: [
        { label: 'North', cards: { S: 'AKQ', H: '432', D: '876', C: 'J543' } },
        { label: 'South', cards: { S: '543', H: 'AKQ', D: '987', C: '32' } }
      ]
    });
  });

  it('parses a deal block with annotation and bidding', () => {
    const raw = 'label: Example deal\nboard: 5\nN: AKQ.432.876.J543\nE: 654.A987.QJ2.65\nS: J987.KQJ.543.987\nW: 32.65.AK9.AKQT2\n1NT pass 3NT pass\npass pass\nann: 1NT | 15-17 balanced';
    const data = parseBridgeBlock('deal', raw);
    expect(data).toEqual({
      label: 'Example deal',
      boardNumber: 5,
      hands: {
        North: { S: 'AKQ', H: '432', D: '876', C: 'J543' },
        East: { S: '654', H: 'A987', D: 'QJ2', C: '65' },
        South: { S: 'J987', H: 'KQJ', D: '543', C: '987' },
        West: { S: '32', H: '65', D: 'AK9', C: 'AKQT2' }
      },
      bidding: [
        { north: '1NT', east: 'pass', south: '3NT', west: 'pass' },
        { north: 'pass', east: 'pass', south: '', west: '' }
      ],
      annotations: [{ bid: '1NT', meaning: '15-17 balanced' }]
    });
  });

  it('parses auction blocks with seats and next bids', () => {
    const raw = 'label: Stayman\nseats: NS\nN: AKQ.J432.876.J54\nS: J987.KQ5.A43.A98\n1NT 2C\n?\nnext: 2D | No 4-card major\nnext: 2H | 4+ hearts';
    const data = parseBridgeBlock('auction', raw);
    expect(data).toEqual({
      label: 'Stayman',
      seats: 'NS',
      rounds: [
        { north: '1NT', east: '', south: '2C', west: '' },
        { north: '?', east: '', south: '', west: '' }
      ],
      hand1: { S: 'AKQ', H: 'J432', D: '876', C: 'J54' },
      hand2: { S: 'J987', H: 'KQ5', D: 'A43', C: 'A98' },
      nextBids: [
        { bid: '2D', meaning: 'No 4-card major' },
        { bid: '2H', meaning: '4+ hearts' }
      ]
    });
  });
});
