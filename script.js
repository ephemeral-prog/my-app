let investmentChart = null;
let holdChart = null;

document.getElementById('investment-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const type = document.getElementById('investment-type').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const rate = parseFloat(document.getElementById('rate').value) / 100;
  const years = parseFloat(document.getElementById('years').value);
  const waitYears = parseFloat(document.getElementById('waitYears').value);

  let valueAtEndOfInvestment = 0;
  let valueAfterHold = 0;
  let totalPrincipal = 0;

  const yearlyValues = [];
  const yearlyPrincipals = [];
  const yearlyInterests = [];

  // --- 投資期間計算 ---
  if (type === 'lump') {
    totalPrincipal = amount;
    for (let i = 1; i <= years; i++) {
      const total = amount * Math.pow(1 + rate, i);
      yearlyValues.push(total);
      yearlyPrincipals.push(amount);
      yearlyInterests.push(total - amount);
    }
    valueAtEndOfInvestment = yearlyValues.at(-1);

  } else if (type === 'monthly') {
    const monthlyRate = Math.pow(1 + rate, 1 / 12) - 1;
    for (let y = 1; y <= years; y++) {
      const m = y * 12;
      const total = amount * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate);
      const principal = amount * m;
      yearlyValues.push(total);
      yearlyPrincipals.push(principal);
      yearlyInterests.push(total - principal);
    }
    totalPrincipal = amount * years * 12;
    valueAtEndOfInvestment = yearlyValues.at(-1);

  } else if (type === 'yearly') {
    for (let y = 1; y <= years; y++) {
      let total = 0;
      for (let i = 0; i < y; i++) {
        total += amount * Math.pow(1 + rate, y - i);
      }
      const principal = amount * y;
      yearlyValues.push(total);
      yearlyPrincipals.push(principal);
      yearlyInterests.push(total - principal);
    }
    totalPrincipal = amount * years;
    valueAtEndOfInvestment = yearlyValues.at(-1);
  }

  // --- 放置期間計算 ---
  const holdValues = [];
  let current = valueAtEndOfInvestment;
  for (let i = 1; i <= waitYears; i++) {
    current *= (1 + rate);
    holdValues.push(current);
  }

  valueAfterHold = holdValues.at(-1) || valueAtEndOfInvestment;
  const totalGain = valueAtEndOfInvestment - totalPrincipal;
  const finalGain = valueAfterHold - totalPrincipal;

  const format = num => num.toLocaleString('ja-JP', {
    style: 'currency',
    currency: 'JPY'
  });

  // --- 表示結果 ---
  document.getElementById('result-invest').innerHTML = `
    <strong>📈 投資期間終了時のシミュレーション</strong><br>
    ▶️ 元本累計：${format(totalPrincipal)}<br>
    ➕ 運用益：${format(totalGain)}<br>
    💼 総資産：${format(valueAtEndOfInvestment)}
  `;

  document.getElementById('result-hold').innerHTML = waitYears > 0
    ? `<strong>🕒 放置期間 ${waitYears} 年後</strong><br>
       ➕ 運用益：${format(finalGain - totalGain)}（放置中の増加分）<br>
       💼 総資産：${format(valueAfterHold)}`
    : '';

  // --- グラフ① 投資期間 ---
  const investCtx = document.getElementById('investmentChart').getContext('2d');
  const labelsInvest = Array.from({ length: years }, (_, i) => `${i + 1}年目`);

  if (investmentChart) investmentChart.destroy();
  investmentChart = new Chart(investCtx, {
    type: 'bar',
    data: {
      labels: labelsInvest,
      datasets: [
        {
          label: '元本',
          data: yearlyPrincipals,
          backgroundColor: '#4caf50',
          stack: 'stack1'
        },
        {
          label: '運用益',
          data: yearlyInterests,
          backgroundColor: '#2d89ef',
          stack: 'stack1'
        }
      ]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `¥${ctx.raw.toLocaleString()}`
          }
        }
      },
      responsive: true,
      scales: {
        x: { stacked: true },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            callback: v => `¥${v.toLocaleString()}`
          }
        }
      }
    }
  });

  // --- グラフ② 放置期間 ---
  const holdCtx = document.getElementById('holdChart').getContext('2d');
  const labelsHold = Array.from({ length: waitYears }, (_, i) => `放置${i + 1}年目`);

  const holdGains = holdValues.map(v => v - valueAtEndOfInvestment * Math.pow(1 + rate, v === holdValues[0] ? 0 : holdValues.indexOf(v)));

  if (holdChart) holdChart.destroy();
  holdChart = new Chart(holdCtx, {
    type: 'bar',
    data: {
      labels: labelsHold,
      datasets: [
        {
          label: '放置による増加分',
          data: holdGains,
          backgroundColor: '#9e9e9e'
        }
      ]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `¥${ctx.raw.toLocaleString()}`
          }
        }
      },
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: v => `¥${v.toLocaleString()}`
          }
        }
      }
    }
  });
});
