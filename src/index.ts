/**
 * marked-bridge — A marked extension for rendering bridge content in Markdown.
 *
 * Usage:
 *   import { marked } from 'marked';
 *   import { bridgeExtension } from 'marked-bridge';
 *   marked.use(bridgeExtension());
 */

import type { MarkedExtension, Tokens } from 'marked';
import { parseBridgeBlock } from './parser.js';
import { renderHand, renderHands, renderDeal, renderAuction } from './renderer.js';
import type { HandData, HandsData, DealData, AuctionData, BridgeBlockType, BridgeExtensionOptions } from './types.js';

export { parseBridgeBlock } from './parser.js';
export { renderHand, renderHands, renderDeal, renderAuction } from './renderer.js';
export type { HandCards, HandData, HandsData, DealData, AuctionData, BiddingRound, BridgeBlockType, BridgeExtensionOptions } from './types.js';

const BRIDGE_TYPES = new Set<string>(['hand', 'hands', 'deal', 'auction', 'bidding', 'pairbidding']);

export function bridgeExtension(_options?: BridgeExtensionOptions): MarkedExtension {
  return {
    renderer: {
      code(token: Tokens.Code): string | false {
        const lang = token.lang?.toLowerCase();
        if (!lang || !BRIDGE_TYPES.has(lang)) return false;

        try {
          const type = lang as BridgeBlockType;
          const data = parseBridgeBlock(type, token.text);

          switch (type) {
            case 'hand':
              return renderHand(data as HandData);
            case 'hands':
              return renderHands(data as HandsData);
            case 'deal':
              return renderDeal(data as DealData);
            case 'auction':
            case 'bidding':
            case 'pairbidding':
              return renderAuction(data as AuctionData);
            default:
              return false;
          }
        } catch {
          return `<div class="bridge-error">Failed to render ${lang} block</div>`;
        }
      }
    }
  };
}
