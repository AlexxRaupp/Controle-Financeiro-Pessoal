// =======================
// USUÁRIO LOGADO
// =======================
const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

if (!loggedUser) {
  window.location.href = "login.html";
}

// Chave única por usuário
const financeKey = `finances_${loggedUser.email}`;

// =======================
// CONFIGURAÇÕES INICIAIS
// =======================
const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
let currentMonth = new Date().getMonth();

// Transações SOMENTE do usuário logado
let transactions = JSON.parse(localStorage.getItem(financeKey)) || [];

// Mostrar nome do usuário no topo
const userInfo = document.getElementById("user-info");
if (userInfo) userInfo.innerText = loggedUser.name;

// =======================
// FILTRO DE MESES
// =======================
const filterDiv = document.getElementById('monthFilter');
months.forEach((m, idx) => {
  const btn = document.createElement('button');
  btn.innerText = m;
  btn.className = `month-btn ${idx === currentMonth ? 'active' : ''}`;
  btn.onclick = () => {
    currentMonth = idx;
    document.querySelectorAll('.month-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  };
  filterDiv.appendChild(btn);
});

// =======================
// ADICIONAR LANÇAMENTO
// =======================
function addEntry() {
  const desc = document.getElementById('f-desc').value;
  const valor = parseFloat(document.getElementById('f-valor').value);
  const data = document.getElementById('f-data').value;
  const tipo = document.getElementById('f-tipo').value;
  const cat = document.getElementById('f-cat').value;

  if (!desc || !valor || !data) {
    alert("Preencha todos os campos!");
    return;
  }

  transactions.push({
    id: Date.now(),
    desc,
    valor,
    data,
    tipo,
    cat
  });

  localStorage.setItem(financeKey, JSON.stringify(transactions));
  render();
}

// =======================
// REMOVER LANÇAMENTO
// =======================
function deleteEntry(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem(financeKey, JSON.stringify(transactions));
  render();
}

// =======================
// RENDERIZAÇÃO
// =======================
let chart1, chart2;

function render() {
  const tbody = document.querySelector('#table-entries tbody');
  tbody.innerHTML = '';

  const filtered = transactions.filter(
    t => new Date(t.data).getMonth() === currentMonth
  );

  let totalR = 0, totalD = 0;
  const catData = {};

  filtered
    .sort((a, b) => new Date(a.data) - new Date(b.data))
    .forEach(t => {
      if (t.tipo === 'receita') {
        totalR += t.valor;
      } else {
        totalD += t.valor;
        catData[t.cat] = (catData[t.cat] || 0) + t.valor;
      }

      tbody.innerHTML += `
        <tr>
          <td>${new Date(t.data).toLocaleDateString('pt-BR')}</td>
          <td>${t.desc}</td>
          <td>${t.cat}</td>
          <td>R$ ${t.valor.toFixed(2)}</td>
          <td><span class="tag ${t.tipo}">${t.tipo}</span></td>
          <td>
            <button onclick="deleteEntry(${t.id})" style="border:none; cursor:pointer">
              🗑️
            </button>
          </td>
        </tr>
      `;
    });

  document.getElementById('txt-receita').innerText = `R$ ${totalR.toFixed(2)}`;
  document.getElementById('txt-despesa').innerText = `R$ ${totalD.toFixed(2)}`;
  document.getElementById('txt-saldo').innerText = `R$ ${(totalR - totalD).toFixed(2)}`;

  updateCharts(filtered, catData);
}

// =======================
// GRÁFICOS
// =======================
function updateCharts(filtered, catData) {
  const ctx1 = document.getElementById('balanceChart').getContext('2d');
  const ctx2 = document.getElementById('categoryChart').getContext('2d');

  if (chart1) chart1.destroy();
  if (chart2) chart2.destroy();

  chart1 = new Chart(ctx1, {
    type: 'line',
    data: {
      labels: filtered.map(t => new Date(t.data).getDate()),
      datasets: [{
        label: 'Evolução Diária',
        data: filtered.map(t => t.tipo === 'receita' ? t.valor : -t.valor),
        borderColor: '#22a6b3',
        backgroundColor: 'rgba(34, 166, 179, 0.1)',
        fill: true,
        tension: 0.4
      }]
    }
  });

  chart2 = new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: Object.keys(catData),
      datasets: [{
        data: Object.values(catData),
        backgroundColor: [
          '#eb4d4b',
          '#f0932b',
          '#f9ca24',
          '#badc58',
          '#6ab04c'
        ]
      }]
    }
  });
}

// =======================
// INICIALIZAÇÃO
// =======================
document.getElementById('f-data').valueAsDate = new Date();
render();
