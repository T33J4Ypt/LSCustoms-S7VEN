const receitas = [
  // Tuning (10 itens)
  { nome: "Kit de Pintura", categoria: "tuning", producao: 2, ingredientes: { "Plástico": 4, "Vidro": 2 } },
  { nome: "Peças de Performance", categoria: "tuning", producao: 1, ingredientes: { "Sucata de metal": 8, "Cobre": 4, "Plástico": 2 } },
  { nome: "Kit de Reparação", categoria: "tuning", producao: 2, ingredientes: { "Sucata de metal": 8, "Borracha": 4, "Plástico": 3 } },
  { nome: "Peças Estéticas", categoria: "tuning", producao: 2, ingredientes: { "Plástico": 8, "Sucata de metal": 3 } },
  { nome: "Kit de Stancer", categoria: "tuning", producao: 1, ingredientes: { "Sucata de metal": 6, "Ferro": 2, "Plástico": 2 } },
  { nome: "Conjunto de Rodas", categoria: "tuning", producao: 1, ingredientes: { "Borracha": 10, "Sucata de metal": 4, "Plástico": 2 } },
  { nome: "Controlador de Iluminação", categoria: "tuning", producao: 1, ingredientes: { "Cobre": 5, "Plástico": 5, "Vidro": 1 } },
  { nome: "Kit de Fumo de Pneus", categoria: "tuning", producao: 1, ingredientes: { "Borracha": 6, "Plástico": 2 } },
  { nome: "Kit de Extras", categoria: "tuning", producao: 1, ingredientes: { "Plástico": 8, "Sucata de metal": 3 } },
  { nome: "Pneu à Prova de Bala", categoria: "tuning", producao: 1, ingredientes: { "Borracha": 16, "Ferro": 8, "Plástico": 4 } },

  // Revisão (9 itens)
  { nome: "Óleo do Motor", categoria: "revisao", producao: 3, ingredientes: { "Plástico": 2, "Borracha": 1 } },
  { nome: "Filtro de Ar", categoria: "revisao", producao: 2, ingredientes: { "Plástico": 2, "Borracha": 1 } },
  { nome: "Vela de Ignição", categoria: "revisao", producao: 4, ingredientes: { "Cobre": 2, "Sucata de metal": 1 } },
  { nome: "Pneu de Sustituição", categoria: "revisao", producao: 1, ingredientes: { "Borracha": 12, "Plástico": 2 } },
  { nome: "Embraiagem de Substituição", categoria: "revisao", producao: 1, ingredientes: { "Sucata de metal": 8, "Ferro": 3, "Plástico": 2 } },
  { nome: "Peças de Suspensão", categoria: "revisao", producao: 1, ingredientes: { "Ferro": 5, "Sucata de metal": 5, "Plástico": 2 } },
  { nome: "Pastilha de Travão", categoria: "revisao", producao: 1, ingredientes: { "Sucata de metal": 6, "Ferro": 2, "Plástico": 2 } },
  { nome: "Liquido Refrigerante EV", categoria: "revisao", producao: 2, ingredientes: { "Plástico": 3, "Vidro": 1 } },
  { nome: "Bateria Elétrica", categoria: "revisao", producao: 1, ingredientes: { "Módulo ECU B+": 1, "Condensador industrial": 1, "Cobre": 4 } },

  // Extras (3 itens)
  { nome: "Caixa de Ferramentas", categoria: "extras", producao: 1, ingredientes: { "Sucata de metal": 8, "Ferro": 3, "Plástico": 2 } },
  { nome: "Tablet do Mecânico", categoria: "extras", producao: 1, ingredientes: { "Placa de circuito": 1, "Plástico": 4, "Vidro": 2 } },
  { nome: "Motor Elétrico", categoria: "extras", producao: 1, ingredientes: { "Bloco de Motor B+": 1, "Placa de circuito": 2, "Cobre": 6 } }
];

function initFabricacao() {
  const corposTabela = {
    tuning: document.getElementById("tabela-tuning"),
    revisao: document.getElementById("tabela-revisao"),
    extras: document.getElementById("tabela-extras")
  };
  const tabelaTotais = document.getElementById("tabela-totais");
  const btnLimpar = document.getElementById("btn-limpar");

  receitas.forEach((r, i) => {
    const tbody = corposTabela[r.categoria];
    if (!tbody) return;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${r.nome}</strong></td>
      <td>
        <input type="number" min="0" value="0" data-index="${i}" class="input-qtd">
      </td>
      <td id="res-${i}">-</td>
    `;
    tbody.appendChild(tr);
  });

  Object.values(corposTabela).forEach((tbody) => {
    if (!tbody) return;
    tbody.addEventListener("input", (e) => {
      if (e.target.classList.contains("input-qtd")) {
        const index = e.target.dataset.index;
        const qtd = parseInt(e.target.value, 10) || 0;
        atualizarLinhaReceita(index, qtd);
        atualizarTotais();
      }
    });
  });

  function atualizarLinhaReceita(index, qtdDesejada) {
    const tdResultado = document.getElementById(`res-${index}`);
    if (!tdResultado) return;

    if (qtdDesejada <= 0) {
      tdResultado.innerHTML = "-";
      return;
    }

    const receita = receitas[index];
    const lotes = Math.ceil(qtdDesejada / receita.producao);

    tdResultado.innerHTML = Object.entries(receita.ingredientes)
      .map(([ing, qtdBase]) => `<span class="ingredient-badge">${lotes * qtdBase}x ${ing}</span>`)
      .join(" ");
  }

  function atualizarTotais() {
    if (!tabelaTotais) return;

    const totais = {};
    document.querySelectorAll(".input-qtd").forEach((input) => {
      const quantidade = parseInt(input.value, 10) || 0;
      if (quantidade <= 0) return;

      const receita = receitas[input.dataset.index];
      if (!receita) return;

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

  if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
      document.querySelectorAll(".input-qtd").forEach((input) => {
        input.value = 0;
      });
      receitas.forEach((_, i) => {
        const td = document.getElementById(`res-${i}`);
        if (td) td.innerHTML = "-";
      });
      atualizarTotais();
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFabricacao);
} else {
  initFabricacao();
}
