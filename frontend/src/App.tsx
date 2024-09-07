import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, List, ListItem, ListItemText, TextField, Button, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { backend } from 'declarations/backend';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Stock {
  symbol: string;
  price: number;
}

const App: React.FC = () => {
  const [marketData, setMarketData] = useState<number[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [marketDataResponse, stockListResponse] = await Promise.all([
          backend.getMarketData(),
          backend.getStockList()
        ]);
        setMarketData(marketDataResponse);
        setStocks(stockListResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(() => {
      backend.updatePrices();
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleBuy = async () => {
    if (selectedStock && quantity > 0) {
      setLoading(true);
      try {
        const result = await backend.buyStock(selectedStock, BigInt(quantity));
        alert(result);
      } catch (error) {
        console.error('Error buying stock:', error);
      }
      setLoading(false);
    }
  };

  const handleSell = async () => {
    if (selectedStock && quantity > 0) {
      setLoading(true);
      try {
        const result = await backend.sellStock(selectedStock, BigInt(quantity));
        alert(result);
      } catch (error) {
        console.error('Error selling stock:', error);
      }
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Market Index',
        data: marketData,
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Market Overview</Typography>
            {loading ? <CircularProgress /> : <Line data={chartData} />}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Watchlist</Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <List>
                {stocks.map((stock) => (
                  <ListItem key={stock.symbol}>
                    <ListItemText primary={stock.symbol} secondary={`$${stock.price.toFixed(2)}`} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>Trade</Typography>
            <TextField
              select
              label="Stock"
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              fullWidth
              margin="normal"
            >
              {stocks.map((stock) => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol}
                </option>
              ))}
            </TextField>
            <TextField
              type="number"
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              fullWidth
              margin="normal"
            />
            <Button onClick={handleBuy} variant="contained" fullWidth sx={{ mt: 2 }}>
              Buy
            </Button>
            <Button onClick={handleSell} variant="outlined" fullWidth sx={{ mt: 1 }}>
              Sell
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
