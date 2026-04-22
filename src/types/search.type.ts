export type Operator = '>=' | '>' | '=' | '<' | '<=';

export type SearchStatPayload = [
  effectId: number,
  operator: Operator,
  amount: number,
];
export interface SearchPayload {
  types: number[];
  stats: SearchStatPayload[];
  page?: number;
  pageSize?: number;
}

export interface ItemEffect {
  id: number;
  label: string;
  amount: number;
  applies_to: number;
}

export interface MapEntity {
  id: number;
  name: string;
}

export interface Monster {
  id: number;
  name: string;
  level: number;
  map: MapEntity;
}

export interface Item {
  id: number;
  name: string;
  type_label: string;
  sell: number;
  process: number;
  process_amount: number;
  badge?: string | null;
  effects?: ItemEffect[];
  monsters?: Monster[];
}
