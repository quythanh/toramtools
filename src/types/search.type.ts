export type Operator = '>=' | '>' | '=' | '<' | '<=';

export type SearchStatPayload = [
  effectId: number,
  operator: Operator,
  amount: number,
];
export interface SearchPayload {
  types: number[];
  stats: SearchStatPayload[];
}

export interface ItemEffect {
  item_id: number;
  effect_id: number;
  effect_label: string;
  amount: number;
  applies_to: number;
}

export interface Item {
  id: number;
  name: string;
  type_id: number;
  type_label: string;
  sell: number;
  process: number;
  process_amount: number;
  badge: string;
  note: string;
  effects: ItemEffect[];
}
