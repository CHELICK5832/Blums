import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DEFAULT_TOKENS = ["BTC", "ETH", "XRP", "SOL", "TON", "LINK", "TRX"];

export default function CryptoExchange() {
  const [tokens, setTokens] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("tokens"));
      if (Array.isArray(stored) && stored.length) return stored;
    } catch {}
    return DEFAULT_TOKENS;
  });
  const [selectedToken, setSelectedToken] = useState("BTC");
  const [wallet, setWallet] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("wallet"));
      if (stored && typeof stored.USD === "number") return stored;
    } catch {}
    return { USD: 1000, ...Object.fromEntries(DEFAULT_TOKENS.map(t => [t, 0])) };
  });
  const [chartData, setChartData] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("chartData"));
      if (stored) return stored;
    } catch {}
    return Object.fromEntries(DEFAULT_TOKENS.map(t => [t, [{ value: 100 }]]));
  });
  const [alerts, setAlerts] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("alerts"));
      if (Array.isArray(stored)) return stored;
    } catch {}
    return [];
  });
  const [newToken, setNewToken] = useState("");
  const [amount, setAmount] = useState(1); // Состояние для хранения количества

  useEffect(() => {
    const interval = setInterval(() => {
      updateChart();
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedToken]);

  useEffect(() => {
    localStorage.setItem("wallet", JSON.stringify(wallet));
    localStorage.setItem("chartData", JSON.stringify(chartData));
    localStorage.setItem("alerts", JSON.stringify(alerts));
    localStorage.setItem("tokens", JSON.stringify(tokens));
  }, [wallet, chartData, alerts, tokens]);

  const updateChart = () => {
    const delta = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random());
    const last = chartData[selectedToken].slice(-1)[0].value;
    const next = parseFloat((last * (1 + delta / 100)).toFixed(2));
    const newData = [...chartData[selectedToken], { value: next }].slice(-20);
    setChartData({ ...chartData, [selectedToken]: newData });

    if (Math.abs(delta) >= 1.25) {
      setAlerts([...alerts, `${selectedToken} изменился на ${delta.toFixed(2)}%`]);
    }
  };

  const handleTrade = (type) => {
    const price = chartData[selectedToken].slice(-1)[0].value;
    const updatedWallet = { ...wallet };
    if (type === "buy" && wallet.USD >= price * amount) {
      updatedWallet.USD -= price * amount;
      updatedWallet[selectedToken] += amount;
      setChartData({
        ...chartData,
        [selectedToken]: [...chartData[selectedToken], { value: parseFloat((price * 1.01).toFixed(2)) }].slice(-20),
      });
    } else if (type === "sell" && wallet[selectedToken] >= amount) {
      updatedWallet.USD += price * amount;
      updatedWallet[selectedToken] -= amount;
      setChartData({
        ...chartData,
        [selectedToken]: [...chartData[selectedToken], { value: parseFloat((price * 0.98).toFixed(2)) }].slice(-20),
      });
    }
    setWallet(updatedWallet);
  };

  const handleAddToken = () => {
    const token = newToken.trim().toUpperCase();
    if (token && !tokens.includes(token)) {
      setTokens([...tokens, token]);
      setWallet({ ...wallet, [token]: 0 });
      setChartData({ ...chartData, [token]: [{ value: 100 }] });
      setNewToken("");
    }
  };

  const handleRemoveToken = (token) => {
    if (!DEFAULT_TOKENS.includes(token)) {
      const updatedTokens = tokens.filter(t => t !== token);
      const { [token]: _, ...restWallet } = wallet;
      const { [token]: __, ...restChart } = chartData;
      setTokens(updatedTokens);
      setWallet(restWallet);
      setChartData(restChart);
      if (selectedToken === token && updatedTokens.length) {
        setSelectedToken(updatedTokens[0]);
      }
    }
  };

  const currentPrice = chartData[selectedToken]?.slice(-1)[0].value || 0;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex md:flex-col gap-2 md:w-1/6">
          {tokens.map((token) => (
            <div key={token} className="flex items-center gap-1">
              <Button onClick={() => setSelectedToken(token)} variant="ghost" className="text-white border border-gray-700">
                {token}
              </Button>
              {!DEFAULT_TOKENS.includes(token) && (
                <Button onClick={() => handleRemoveToken(token)} className="text-red-500 px-2">×</Button>
              )}
            </div>
          ))}
          <div className="mt-2">
            <input
              className="bg-gray-800 text-white px-2 py-1 w-full mb-1"
              placeholder="Новый токен"
              value={newToken}
              onChange={(e) => setNewToken(e.target.value)}
            />
            <Button onClick={handleAddToken} className="w-full bg-blue-700 hover:bg-blue-800">Добавить</Button>
          </div>
        </div>

        <div className="md:w-5/6 flex flex-col gap-4">
          <Card className="bg-gray-900">
            <CardContent className="flex justify-center text-2xl py-4">
              USD Баланс: ${typeof wallet.USD === 'number' ? wallet.USD.toFixed(2) : '0.00'}
            </CardContent>
          </Card>

          <div className="text-center py-2">
            <h2 className="text-xl font-semibold">{selectedToken} - ${currentPrice.toFixed(2)}</h2>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData[selectedToken]}>
              <XAxis hide dataKey="index" />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#00ff99" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, e.target.value))}
                className="bg-gray-800 text-white px-2 py-1 w-24"
              />
              <Button onClick={() => handleTrade("buy")} className="bg-green-600 hover:bg-green-700">Купить</Button>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, e.target.value))}
                className="bg-gray-800 text-white px-2 py-1 w-24"
              />
              <Button onClick={() => handleTrade("sell")} className="bg-red-600 hover:bg-red-700">Продать</Button>
            </div>
          </div>

          <Card className="bg-gray-900">
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {tokens.map((token) => (
                <div key={token} className="text-sm">{token}: {wallet[token]}</div>
              ))}
            </CardContent>
          </Card>

          <div className="text-sm text-yellow-500 space-y-1">
            {alerts.slice(-5).map((alert, idx) => (
              <div key={idx}>{alert}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
