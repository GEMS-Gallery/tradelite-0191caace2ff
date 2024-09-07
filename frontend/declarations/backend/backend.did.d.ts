import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Stock { 'price' : number, 'symbol' : string }
export interface _SERVICE {
  'buyStock' : ActorMethod<[string, bigint], string>,
  'getMarketData' : ActorMethod<[], Array<number>>,
  'getStockList' : ActorMethod<[], Array<Stock>>,
  'sellStock' : ActorMethod<[string, bigint], string>,
  'updatePrices' : ActorMethod<[], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
