document.addEventListener("DOMContentLoaded", () => {
    const cryptoList = document.getElementById('crypto-list');
    const searchInput = document.getElementById('search');
    const sortMktCapBtn = document.getElementById('sort-mkt-cap');
    const sortPercentageBtn = document.getElementById('sort-percentage');
    
    let coins = [];
    let sortedByMarketCap = false;
    let sortedByPercentage = false;
  

    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );
        coins = await response.json();
        renderCryptoList(coins);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
  
    
    const renderCryptoList = (coins) => {
      cryptoList.innerHTML = coins.map(coin => `
        <tr>
          <td>
            <img src="${coin.image}" alt="${coin.name}"/>
            ${coin.name} (${coin.symbol.toUpperCase()})
          </td>
          <td>$${coin.current_price.toLocaleString()}</td>
          <td>$${coin.market_cap.toLocaleString()}</td>
          <td class="${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
            ${coin.price_change_percentage_24h.toFixed(2)}%
          </td>
        </tr>
      `).join('');
    };
  
   
    searchInput.addEventListener('input', () => {
      const filteredCoins = coins.filter(coin => 
        coin.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchInput.value.toLowerCase())
      );
      renderCryptoList(filteredCoins);
    });
  
   
    sortMktCapBtn.addEventListener('click', () => {
      sortedByMarketCap = !sortedByMarketCap;
      const sortedCoins = [...coins].sort((a, b) => 
        sortedByMarketCap ? a.market_cap - b.market_cap : b.market_cap - a.market_cap
      );
      renderCryptoList(sortedCoins);
    });
  
   
    sortPercentageBtn.addEventListener('click', () => {
      sortedByPercentage = !sortedByPercentage;
      const sortedCoins = [...coins].sort((a, b) => 
        sortedByPercentage ? a.price_change_percentage_24h - b.price_change_percentage_24h
                           : b.price_change_percentage_24h - a.price_change_percentage_24h
      );
      renderCryptoList(sortedCoins);
    });
  
  
    fetchCryptoData();
  });
  