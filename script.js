// Store for tokens
let tokens = [];
let activeTokenId = null;

// Theme management
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    } else if (prefersDarkScheme.matches) {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', newTheme);
});

// Initialize price chart
const ctx = document.getElementById('priceChart').getContext('2d');
let priceChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Token Price',
            data: [],
            borderColor: '#3498db',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#fff'
                }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#fff'
                }
            }
        },
        animation: {
            duration: 1000
        },
        plugins: {
            legend: {
                labels: {
                    color: '#fff'
                }
            }
        }
    }
});

// Save tokens to localStorage
function saveTokens() {
    localStorage.setItem('tokens', JSON.stringify(tokens));
    localStorage.setItem('activeTokenId', activeTokenId);
}

// Load tokens from localStorage
function loadTokens() {
    const savedTokens = localStorage.getItem('tokens');
    const savedActiveTokenId = localStorage.getItem('activeTokenId');
    
    if (savedTokens) {
        tokens = JSON.parse(savedTokens);
        // Convert date strings back to Date objects
        tokens.forEach(token => {
            token.history = token.history.map(h => ({
                date: new Date(h.date),
                price: h.price
            }));
        });
        activeTokenId = savedActiveTokenId;
        updateTokensList();
        if (activeTokenId) {
            updatePriceChart(parseInt(activeTokenId));
        }
    } else {
        initializeDefaultTokens();
    }
}

// Initialize default tokens
function initializeDefaultTokens() {
    // Initialize TON token
    const tonToken = {
        id: Date.now(),
        name: 'The Open Network',
        symbol: 'TON',
        supply: 5000000000, // 5 billion TON
        price: 3.04, // Current price in USD
        history: []
    };
    
    // Generate historical price data for TON
    const tonBasePrice = 3.04;
    for (let i = 0; i < 30; i++) {
        tonToken.history.push({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
            price: tonBasePrice * (1 + (Math.random() - 0.5) * 0.1)
        });
    }
    
    // Initialize FPIBANK token
    const fpibankToken = {
        id: Date.now() + 1,
        name: 'FPI Bank',
        symbol: 'FPIBANK',
        supply: 1000000000, // 1 billion FPIBANK
        price: 0.005147, // Current price in USD
        history: []
    };
    
    // Generate historical price data for FPIBANK
    const fpibankBasePrice = 0.005147;
    for (let i = 0; i < 30; i++) {
        fpibankToken.history.push({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
            price: fpibankBasePrice * (1 + (Math.random() - 0.5) * 0.1)
        });
    }
    
    tokens.push(tonToken);
    tokens.push(fpibankToken);
    setActiveToken(tonToken.id); // Set TON as active by default
    updateTokensList();
    saveTokens();
}

// Initialize theme and tokens when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    loadTokens();
});

// Token creation form handler
document.getElementById('tokenForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const tokenName = document.getElementById('tokenName').value;
    const tokenSymbol = document.getElementById('tokenSymbol').value;
    const initialSupply = parseFloat(document.getElementById('initialSupply').value);
    
    createToken(tokenName, tokenSymbol, initialSupply);
    this.reset();
});

// Create new token
function createToken(name, symbol, supply) {
    const token = {
        id: Date.now(),
        name,
        symbol: symbol.toUpperCase(),
        supply,
        price: Math.random() * 100, // Random initial price
        history: []
    };
    
    // Generate some historical price data
    for (let i = 0; i < 30; i++) {
        token.history.push({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
            price: token.price * (1 + (Math.random() - 0.5) * 0.1)
        });
    }
    
    tokens.push(token);
    updateTokensList();
    saveTokens();
}

// Update tokens list in the UI
function updateTokensList() {
    const tokensList = document.querySelector('.tokens-list');
    tokensList.innerHTML = '';
    
    tokens.forEach(token => {
        const marketCap = token.price * token.supply;
        const tokenCard = document.createElement('div');
        tokenCard.className = `token-card ${token.id === activeTokenId ? 'active' : ''}`;
        tokenCard.innerHTML = `
            <h3>${token.name} (${token.symbol})</h3>
            <p>Supply: ${token.supply.toLocaleString()}</p>
            <p>Current Price: $${token.price.toFixed(6)}</p>
            <p>Market Cap: $${marketCap.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
            <p class="last-update">Last update: ${new Date().toLocaleTimeString()}</p>
        `;
        
        tokenCard.addEventListener('click', () => setActiveToken(token.id));
        tokensList.appendChild(tokenCard);
    });
}

// Trading functionality
const tradeAmount = document.getElementById('tradeAmount');
const buyButton = document.getElementById('buyButton');
const sellButton = document.getElementById('sellButton');
const tradeTotal = document.getElementById('tradeTotal');
const priceImpact = document.getElementById('priceImpact');

// Load wallet balances from localStorage
function loadWalletBalances() {
    return JSON.parse(localStorage.getItem('walletBalances') || '{}');
}

// Save wallet balances to localStorage
function saveWalletBalances(balances) {
    localStorage.setItem('walletBalances', JSON.stringify(balances));
}

// Calculate price impact based on trade amount
function calculatePriceImpact(amount, token) {
    const tradeValue = amount * token.price;
    const maxImpact = 0.05; // 5% maximum impact
    const impact = Math.min(tradeValue / (token.supply * token.price) * 2, maxImpact);
    return impact;
}

// Update trade info
function updateTradeInfo() {
    const amount = parseFloat(tradeAmount.value) || 0;
    const activeToken = tokens.find(t => t.id === activeTokenId);
    
    if (activeToken) {
        const total = amount * activeToken.price;
        const impact = calculatePriceImpact(amount, activeToken);
        
        tradeTotal.textContent = total.toFixed(2);
        priceImpact.textContent = `${(impact * 100).toFixed(2)}%`;
    }
}

// Handle trade
function handleTrade(isBuy) {
    const amount = parseFloat(tradeAmount.value);
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    const token = tokens.find(t => t.id === activeTokenId);
    if (!token) {
        alert('Please select a token first');
        return;
    }

    // Load balances
    const balances = loadWalletBalances();
    const symbol = token.symbol;
    const currentBalance = balances[symbol] || 0;

    // For sell, check if enough balance
    if (!isBuy && amount > currentBalance) {
        alert('Not enough balance to sell');
        return;
    }

    // Update balance
    balances[symbol] = isBuy
        ? currentBalance + amount
        : currentBalance - amount;
    saveWalletBalances(balances);

    // Calculate impact from trade
    const impact = calculatePriceImpact(amount, token);
    const priceChange = isBuy ? 1 + impact : 1 - impact;
    
    // Update token price
    const oldPrice = token.price;
    token.price = oldPrice * priceChange;
    
    // Add new price point to history
    token.history.push({
        date: new Date(),
        price: token.price
    });
    
    // Keep only last 30 days of history
    if (token.history.length > 30) {
        token.history.shift();
    }
    
    // Update UI
    updateTokensList();
    updatePriceChart(token);
    saveTokens();
    
    // Show trade confirmation
    const action = isBuy ? 'Bought' : 'Sold';
    const priceChangePercent = ((token.price - oldPrice) / oldPrice * 100).toFixed(2);
    const priceChangeDirection = token.price > oldPrice ? '↑' : '↓';
    showTradeConfirmation(
        action, 
        amount, 
        token.symbol, 
        token.price,
        `${priceChangeDirection} ${Math.abs(priceChangePercent)}%`
    );
    
    // Clear input
    tradeAmount.value = '';
    updateTradeInfo();
}

// Show trade confirmation
function showTradeConfirmation(action, amount, symbol, price, priceChange) {
    const indicator = document.createElement('div');
    indicator.className = 'update-indicator trade-confirmation';
    indicator.innerHTML = `
        <div>${action} ${amount} ${symbol}</div>
        <div>Price: $${price.toFixed(6)}</div>
        <div>Change: ${priceChange}</div>
    `;
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        indicator.remove();
    }, 3000);
}

// Event listeners for trading
tradeAmount.addEventListener('input', updateTradeInfo);
buyButton.addEventListener('click', () => handleTrade(true));
sellButton.addEventListener('click', () => handleTrade(false));

// Update trade info when token changes
function setActiveToken(tokenId) {
    activeTokenId = tokenId;
    const token = tokens.find(t => t.id === tokenId);
    if (token) {
        updatePriceChart(token);
        updateTokensList();
        updateTradeInfo();
        saveTokens();
    }
}

// Update price chart for selected token
function updatePriceChart(token) {
    const tokenData = typeof token === 'number' 
        ? tokens.find(t => t.id === token)
        : token;
    
    if (!tokenData) return;
    
    priceChart.data.labels = tokenData.history.map(h => 
        h.date.toLocaleDateString()
    );
    priceChart.data.datasets[0].data = tokenData.history.map(h => h.price);
    priceChart.data.datasets[0].label = `${tokenData.name} Price`;
    priceChart.update();
}

// Add update indicator
function showUpdateIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'update-indicator';
    indicator.textContent = 'Updating prices...';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        indicator.remove();
    }, 2000);
}

// Update price every 30 seconds
setInterval(() => {
    tokens.forEach(token => {
        const oldPrice = token.price;
        // 65% chance of going up, 35% chance of going down
        const randomValue = Math.random();
        const isUp = randomValue < 0.65;
        // Random movement between 0% and 5%
        const randomMovement = Math.random() * 0.05;
        // Apply movement in the chosen direction
        token.price = oldPrice * (1 + (isUp ? randomMovement : -randomMovement));
        
        // Add new price point to history
        token.history.push({
            date: new Date(),
            price: token.price
        });
        
        // Keep only last 30 days of history
        if (token.history.length > 30) {
            token.history.shift();
        }
    });
    
    // Update UI
    updateTokensList();
    if (activeTokenId) {
        const activeToken = tokens.find(t => t.id === activeTokenId);
        if (activeToken) {
            updatePriceChart(activeToken);
        }
    }
    saveTokens();
}, 30000); 