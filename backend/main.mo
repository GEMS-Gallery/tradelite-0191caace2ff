import Int "mo:base/Int";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Float "mo:base/Float";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Random "mo:base/Random";
import Option "mo:base/Option";

actor {
  type Stock = {
    symbol: Text;
    price: Float;
  };

  stable var marketData: [Float] = [120.0, 130.0, 125.0, 135.0, 140.0, 150.0];
  stable var stockList: [Stock] = [
    { symbol = "AAPL"; price = 150.25 },
    { symbol = "GOOGL"; price = 2750.80 },
    { symbol = "MSFT"; price = 305.15 },
    { symbol = "AMZN"; price = 3380.50 },
    { symbol = "META"; price = 330.75 }
  ];

  var lastUpdateTime: Time.Time = Time.now();

  public query func getMarketData(): async [Float] {
    marketData
  };

  public query func getStockList(): async [Stock] {
    stockList
  };

  public func buyStock(symbol: Text, quantity: Nat): async Text {
    // Simulate buy operation
    "Buy order placed for " # symbol # " x" # Nat.toText(quantity)
  };

  public func sellStock(symbol: Text, quantity: Nat): async Text {
    // Simulate sell operation
    "Sell order placed for " # symbol # " x" # Nat.toText(quantity)
  };

  public func updatePrices(): async () {
    let currentTime = Time.now();
    if (currentTime - lastUpdateTime > 60_000_000_000) { // Update every minute
      lastUpdateTime := currentTime;
      let seed = await Random.blob();
      let random = Random.Finite(seed);

      stockList := Array.map<Stock, Stock>(stockList, func(stock) {
        let change = switch (random.coin()) {
          case (?true) 1.0;
          case (?false) -1.0;
          case (null) 0.0;
        };
        let randomFloat = Float.fromInt(Option.get(random.range(8), 0)) / 100.0;
        {
          symbol = stock.symbol;
          price = Float.max(0.01, stock.price + change * randomFloat * stock.price);
        }
      });

      // Update market data
      let newDataPoint = Array.foldLeft<Stock, Float>(stockList, 0, func(acc, stock) { acc + stock.price }) / Float.fromInt(stockList.size());
      marketData := Array.tabulate<Float>(6, func(i) {
        if (i == 5) newDataPoint else marketData[i + 1]
      });
    }
  };
}
