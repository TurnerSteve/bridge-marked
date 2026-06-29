// Card notation: PBN-style dot-separated suits (S.H.D.C)
export interface HandCards {
  S: string;
  H: string;
  D: string;
  C: string;
}

export interface BiddingRound {
  north: string;
  east: string;
  south: string;
  west: string;
}

export interface HandData {
  label?: string;
  cards: HandCards;
}

export interface HandsData {
  title?: string;
  perRow?: number;
  hands: { label?: string; cards: HandCards }[];
}

export type DealView = 'all' | 'ns' | 'ew';

export interface DealData {
  label?: string;
  boardNumber?: number;
  dealer?: string;
  view?: DealView;
  showAnnotations?: boolean;
  hands: { North: HandCards; South: HandCards; East: HandCards; West: HandCards };
  bidding?: BiddingRound[];
  annotations?: { bid: string; meaning: string }[];
}

export interface AuctionData {
  label?: string;
  seats?: string;
  boardNumber?: number;
  dealer?: string;
  vul?: string;
  rounds: BiddingRound[];
  hand1?: HandCards;
  hand2?: HandCards;
  annotations?: { bid: string; meaning: string }[];
  annotationPlacement?: 'right' | 'below';
  nextBidsLabel?: string;
  nextBids?: { bid: string; meaning: string }[];
}

export type BridgeBlockType = 'hand' | 'hands' | 'deal' | 'auction' | 'bidding' | 'pairbidding';

export interface BridgeExtensionOptions {
  suitColours?: '4-colour' | '2-colour';
  cssPrefix?: string;
}
