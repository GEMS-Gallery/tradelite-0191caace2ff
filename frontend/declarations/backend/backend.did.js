export const idlFactory = ({ IDL }) => {
  const Stock = IDL.Record({ 'price' : IDL.Float64, 'symbol' : IDL.Text });
  return IDL.Service({
    'buyStock' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Text], []),
    'getMarketData' : IDL.Func([], [IDL.Vec(IDL.Float64)], ['query']),
    'getStockList' : IDL.Func([], [IDL.Vec(Stock)], ['query']),
    'sellStock' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Text], []),
    'updatePrices' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
