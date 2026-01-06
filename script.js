// ==========================
// CONFIGURAÇÕES
// ==========================
const months = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];
let currentMonth = new Date().getMonth();
let transactions = JSON.parse(localStorage.getItem('my_finances')) || [];
let editId = null;

const monthFilter = document.getElementById('monthFilter');
const tbody = document.querySelector('#table-entries tbody');

const txtReceita = document.getElementById('txt-receita');
const txtDespesa = document.getElementById('txt-despesa');
const txtSaldo   = document.getElementById('txt-saldo');

const balanceCanvas  = document.getElementById('balanceChart');
const categoryCanvas = document.getElementById('categoryChart');

const btnAdd = document.querySelector('.btn-add');

let balanceChart = null;
let categoryChart = null;

// ==========================
// FILTRO DE MESES
// ==========================
months.forEach((month, index) => {
    const btn = document.createElement('button');
    btn.textContent = month;
    btn.className = 'month-btn';
    if (index === currentMonth) btn.classList.add('active');

    btn.onclick = () => {
        currentMonth = index;
        document.querySelectorAll('.month-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        render();
    };

    monthFilter.appendChild(btn);
});

// ==========================
// ADICIONAR / ATUALIZAR
// ==========================
function addEntry() {
    const desc  = document.getElementById('f-desc').value.trim();
    const valor = parseFloat(document.getElementById('f-valor').value);
    const data  = document.getElementById('f-data').value;
    const tipo  = document.getElementById('f-tipo').value;
    const cat   = document.getElementById('f-cat').value;

    if (!desc || isNaN(valor) || !data) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    if (editId) {
        const index = transactions.findIndex(t => t.id === editId);
        transactions[index] = { id: editId, desc, valor, data, tipo, cat };
        editId = null;
        btnAdd.textContent = 'ADICIONAR';
    } else {
        transactions.push({
            id: Date.now(),
            desc,
            valor,
            data,
            tipo,
            cat
        });
    }

    localStorage.setItem('my_finances', JSON.stringify(transactions));
    clearForm();
    render();
}

// ==========================
// EDITAR
// ==========================
function editEntry(id) {
    const t = transactions.find(t => t.id === id);

    document.getElementById('f-desc').value = t.desc;
    document.getElementById('f-valor').value = t.valor;
    document.getElementById('f-data').value = t.data;
    document.getElementById('f-tipo').value = t.tipo;
    document.getElementById('f-cat').value = t.cat;

    editId = id;
    btnAdd.textContent = 'ATUALIZAR';
}

// ==========================
// EXCLUIR
// ==========================
function deleteEntry(id) {
    if (!confirm("Deseja excluir este lançamento?")) return;
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem('my_finances', JSON.stringify(transactions));
    render();
}

// ==========================
// RENDER
// ==========================
function render() {
    tbody.innerHTML = '';

    const filtered = transactions
        .filter(t => new Date(t.data).getMonth() === currentMonth)
        .sort((a, b) => new Date(a.data) - new Date(b.data));

    let totalR = 0;
    let totalD = 0;
    const catTotals = {};

    filtered.forEach(t => {
        if (t.tipo === 'receita') {
            totalR += t.valor;
        } else {
            totalD += t.valor;
            catTotals[t.cat] = (catTotals[t.cat] || 0) + t.valor;
        }

        tbody.innerHTML += `
            <tr>
                <td>${new Date(t.data).toLocaleDateString('pt-BR')}</td>
                <td>${t.desc}</td>
                <td>${t.cat}</td>
                <td>R$ ${t.valor.toFixed(2)}</td>
                <td><span class="tag ${t.tipo}">${t.tipo}</span></td>
                <td>
                    <button onclick="editEntry(${t.id})">✏️</button>
                    <button onclick="deleteEntry(${t.id})">🗑️</button>
                </td>
            </tr>
        `;
    });

    txtReceita.textContent = `R$ ${totalR.toFixed(2)}`;
    txtDespesa.textContent = `R$ ${totalD.toFixed(2)}`;
    txtSaldo.textContent   = `R$ ${(totalR - totalD).toFixed(2)}`;

    updateCharts(filtered, catTotals);
}

// ==========================
// GRÁFICOS
// ==========================
function updateCharts(data, catTotals) {
    if (balanceChart) balanceChart.destroy();
    if (categoryChart) categoryChart.destroy();

    balanceChart = new Chart(balanceCanvas, {
        type: 'line',
        data: {
            labels: data.map(t => new Date(t.data).getDate()),
            datasets: [{
                label: 'Evolução Diária',
                data: data.map(t => t.tipo === 'receita' ? t.valor : -t.valor),
                borderColor: '#22a6b3',
                fill: true,
                tension: 0.4
            }]
        }
    });

    categoryChart = new Chart(categoryCanvas, {
        type: 'doughnut',
        data: {
            labels: Object.keys(catTotals),
            datasets: [{
                data: Object.values(catTotals),
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

// ==========================
// UTIL
// ==========================
function clearForm() {
    document.getElementById('f-desc').value = '';
    document.getElementById('f-valor').value = '';
    document.getElementById('f-data').valueAsDate = new Date();
}

// ==========================
clearForm();
render();
