import { Unique } from './core';
export interface Opcode {
  offset: number;
  type: number;
  op1: number;
  op2: number;
  op3: number;
  size: number;
}

export type VMHandle = Unique<"Handle">;
