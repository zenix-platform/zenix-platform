function renderTop3() {
  let c = document.getElementById('crypto-ticker-list'); if (!c) return;
  
  // انتخاب ۳ ارز معروف اصلی: بیت‌کوین (BTC)، اتریوم (ETH) و سولانا (SOL)
  const famousCoins = cryptoPool.filter(coin => ['btc', 'eth', 'sol'].includes(coin.id));
  
  c.innerHTML = '';
  famousCoins.forEach(coin => {
    let up = coin.change >= 0, pCls = up ? 'price-up' : 'price-down';
    c.innerHTML += `<div class="crypto-row" id="crypto-row-${coin.id}">
      <div class="crypto-info">
        <div class="crypto-icon" style="background:${coin.color};"><i class="${coin.cls}"></i></div>
        <div>
          <div style="font-weight:bold;color:#f8fafc;">${coin.symbol}</div>
          <div style="font-size:10px;color:#94a3b8;">${coin.name}</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div class="${pCls}">$${coin.price < 1 ? coin.price.toFixed(6) : (coin.price < 10 ? coin.price.toFixed(3) : coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</div>
        <div style="font-size:10px;" class="${pCls}">${up ? '+' : ''}${coin.change.toFixed(2)}%</div>
      </div>
    </div>`;
  });
}
