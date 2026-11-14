const produtos = [
  { nome: "Kits de Reparação", semParceria: 12000, comParceria: 7500 },
  { nome: "Ramen", semParceria: 27000, comParceria: 22000 },
  { nome: "Energético", semParceria: 15000, comParceria: 10000 },
  { nome: "Reparações nos Elevadores", semParceria: 15000, comParceria: 0 }
];

const tabelaPrecos = document.getElementById("tabela-precos");
const btnLimparPrecos = document.getElementById("btn-limpar-precos");

function formatarMoeda(valor) {
  return "€" + valor.toLocaleString("pt-PT");
}

if (tabelaPrecos) {
  produtos.forEach((prod, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${prod.nome}</strong></td>
      <td>
        <input type="number" min="0" value="0" data-index="${i}" class="input-qtd-preco">
      </td>
      <td id="sub-sem-${i}" class="price-normal">€0</td>
      <td id="sub-com-${i}" class="price-discount">€0</td>
    `;
    tabelaPrecos.appendChild(tr);
  });

  tabelaPrecos.addEventListener("input", (e) => {
    if (e.target.classList.contains("input-qtd-preco")) {
      calcularTotais();
    }
  });
}

function calcularTotais() {
  let totalSem = 0;
  let totalCom = 0;

  document.querySelectorAll(".input-qtd-preco").forEach((input) => {
    const qtd = parseInt(input.value) || 0;
    const index = input.dataset.index;
    const prod = produtos[index];
    if (!prod) return;

    const subSem = qtd * prod.semParceria;
    const subCom = qtd * prod.comParceria;

    const tdSem = document.getElementById(`sub-sem-${index}`);
    const tdCom = document.getElementById(`sub-com-${index}`);
    if (tdSem) tdSem.textContent = formatarMoeda(subSem);
    if (tdCom) tdCom.textContent = formatarMoeda(subCom);

    totalSem += subSem;
    totalCom += subCom;
  });

  const elTotalSem = document.getElementById("total-sem-parceria");
  const elTotalCom = document.getElementById("total-com-parceria");
  if (elTotalSem) elTotalSem.textContent = formatarMoeda(totalSem);
  if (elTotalCom) elTotalCom.textContent = formatarMoeda(totalCom);
}

if (btnLimparPrecos) {
  btnLimparPrecos.addEventListener("click", () => {
    document.querySelectorAll(".input-qtd-preco").forEach((input) => {
      input.value = 0;
    });
    calcularTotais();
  });
}
