const receitas = [
  { nome: "Caixa de ferramentas", producao: 1, ingredientes: { "Sucata de metal": 8, "Ferro": 3, "Plástico": 2 } }, //[cite: 8]
  { nome: "Kit de Reparação", producao: 2, ingredientes: { "Sucata de metal": 8, "Borracha": 4, "Plástico": 3 } }, //[cite: 8]
  { nome: "Kit de Pintura", producao: 2, ingredientes: { "Plástico": 4, "Vidro": 2 } }, //[cite: 8]
  { nome: "Peças de Performance", producao: 1, ingredientes: { "Sucata de metal": 8, "Cobre": 4, "Plástico": 2 } }, //[cite: 8]
  { nome: "Peças Estéticas", producao: 2, ingredientes: { "Plástico": 8, "Sucata de metal": 3 } }, //[cite: 8]
  { nome: "Kit de Stancer", producao: 1, ingredientes: { "Sucata de metal": 6, "Ferro": 2, "Plástico": 2 } }, //[cite: 8]
  { nome: "Conjunto de Rodas", producao: 1, ingredientes: { "Borracha": 10, "Sucata de metal": 4, "Plástico": 2 } }, //[cite: 8]
  { nome: "Controlador de Iluminação", producao: 1, ingredientes: { "Cobre": 5, "Plástico": 5, "Vidro": 1 } }, //[cite: 8]
  { nome: "Kit de Fumo de Pneus", producao: 1, ingredientes: { "Borracha": 6, "Plástico": 2 } }, //[cite: 9]
  { nome: "Kit de Extras", producao: 1, ingredientes: { "Plástico": 8, "Sucata de metal": 3 } }, //[cite: 9]
  { nome: "Tablet do Mecânico", producao: 1, ingredientes: { "Placa de circuito": 1, "Plástico": 4, "Vidro": 2 } }, //[cite: 9]
  { nome: "Óleo de Motor", producao: 3, ingredientes: { "Plástico": 2, "Borracha": 1 } }, //[cite: 9]
  { nome: "Filtro de Ar", producao: 2, ingredientes: { "Plástico": 2, "Borracha": 1 } }, //[cite: 9]
  { nome: "Vela de Ignição", producao: 4, ingredientes: { "Cobre": 2, "Sucata de metal": 1 } }, //[cite: 9]
  { nome: "Pneu de Substituição", producao: 1, ingredientes: { "Borracha": 12, "Plástico": 2 } }, //[cite: 9]
  { nome: "Embraiagem de Substituição", producao: 1, ingredientes: { "Sucata de metal": 8, "Ferro": 3, "Plástico": 2 } }, //[cite: 10]
  { nome: "Peças de Suspensão", producao: 1, ingredientes: { "Ferro": 5, "Sucata de metal": 5, "Plástico": 2 } }, //[cite: 10]
  { nome: "Pastilha de Travão", producao: 1, ingredientes: { "Sucata de metal": 6, "Ferro": 2, "Plástico": 2 } }, //[cite: 10]
  { nome: "Líquido Refrigerante EV", producao: 2, ingredientes: { "Plástico": 3, "Vidro": 1 } }, //[cite: 10]
  { nome: "Pneus à Prova de Bala", producao: 1, ingredientes: { "Borracha": 16, "Ferro": 8, "Plástico": 4 } }, //[cite: 11]
  { nome: "Motor Elétrico", producao: 1, ingredientes: { "Bloco de Motor B+": 1, "Placa de circuito": 2, "Cobre": 6 } }, //[cite: 11]
  { nome: "Bateria Elétrica", producao: 1, ingredientes: { "Módulo ECU B+": 1, "Condensador industrial": 1, "Cobre": 4 } } //[cite: 11]
];

const tabelaFabricacao = document.getElementById("tabela-fabricacao");
const tabelaTotais = document.getElementById("tabela-totais");
const btnLimpar = document.getElementById("btn-limpar");

// Renderizar Tabela Inicial
receitas.forEach((r, i) => {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td><strong>${r.nome}</strong></td>
    <td>
      <input type="number" min="0" value="0" data-index="${i}" class="input-qtd">
    </td>
    <td id="res-${i}">-</td>
  `;

  tabelaFabricacao.appendChild(tr);
});

// Event Listener Centralizado para Inputs
tabelaFabricacao.addEventListener("input", (e) => {
  if (e.target.classList.contains("input-qtd")) {
    const index = e.target.dataset.index;
    const qtd = parseInt(e.target.value) || 0;
    atualizarLinhaReceita(index, qtd);
    atualizarTotais();
  }
});

function atualizarLinhaReceita(index, qtdDesejada) {
  const tdResultado = document.getElementById(`res-${index}`);

  if (qtdDesejada <= 0) {
    tdResultado.innerHTML = "-";
    return;
  }

  const receita = receitas[index];
  const lotes = Math.ceil(qtdDesejada / receita.producao);

  const badgesHTML = Object.entries(receita.ingredientes)
    .map(([ing, qtdBase]) => `<span class="ingredient-badge">${lotes * qtdBase}x ${ing}</span>`)
    .join(" ");

  tdResultado.innerHTML = badgesHTML;
}

function atualizarTotais() {
  const totais = {};
  const inputs = document.querySelectorAll(".input-qtd");

  inputs.forEach((input) => {
    const quantidade = parseInt(input.value) || 0;
    if (quantidade <= 0) return;

    const receita = receitas[input.dataset.index];
    const lotes = Math.ceil(quantidade / receita.producao);

    for (const [ingrediente, qtdBase] of Object.entries(receita.ingredientes)) {
      totais[ingrediente] = (totais[ingrediente] || 0) + (lotes * qtdBase);
    }
  });

  tabelaTotais.innerHTML = "";
  const listaTotais = Object.entries(totais).sort((a, b) => a[0].localeCompare(b[0]));

  if (listaTotais.length === 0) {
    tabelaTotais.innerHTML = '<tr><td colspan="2" class="empty-msg">Nenhum item selecionado</td></tr>';
    return;
  }

  listaTotais.forEach(([ingrediente, qtd]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ingrediente}</td>
      <td><strong class="total-highlight">${qtd}</strong></td>
    `;
    tabelaTotais.appendChild(tr);
  });
}

// Botão Limpar
if (btnLimpar) {
  btnLimpar.addEventListener("click", () => {
    document.querySelectorAll(".input-qtd").forEach(input => input.value = 0);
    receitas.forEach((_, i) => document.getElementById(`res-${i}`).innerHTML = "-");
    atualizarTotais();
  });
}
