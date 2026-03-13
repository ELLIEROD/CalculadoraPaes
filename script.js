/* ===========================================================
   CONFIGURAÇÃO DE DADOS (LINHAS, PRODUTOS E MÁQUINAS)
   =========================================================== */
const dadosProducao = {
  "linha20k": {
    nome: "Linha 20k",
    produtos: {
      "pppi": { label: "PP e PI", validade: 50, retirada: 30 },
      "artesanos": { label: "Artesanos", validade: 35, retirada: 23 },
      "aparas": { label: "Aparas", validade: 15, retirada: 12 }
    }
  },
  "linha3": {
    nome: "Linha 3",
    produtos: {
      "paesEspeciais": { label: "Pães Especiais", validade: 35, retirada: 23 }, 
      "paesintegraise12graos": { label: "Pão Integral Zero e 12 Grãos 350g", validade: 28, retirada: 19 },
      "aparas": { label: "Aparas", validade: 15, retirada: 12 }
    }
  },
  "bolleria": {
    nome: "Bolleria",
    produtos: {
      "brioche": { label: "Brioche", validade: 60, retirada: 45 }, 
      "artesanos": { label: "Artesanos", validade: 35, retirada: 23 },
      "aparas": { label: "Aparas", validade: 15, retirada: 12 }
    }
  }
};

const maquinasPorLinha = {
    "linha20k": [1, 2, 3, 4, 5, 6],
    "linha3": [1, 2, 3],
    "bolleria": [1, 2, 3, 4]
};

const mesesAbrev = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

/* ===========================================================
   ELEMENTOS DO DOM
   =========================================================== */
const seletorLinha = document.getElementById("seletorLinha");
const seletorProduto = document.getElementById("seletorProduto");
const seletorMaquina = document.getElementById("seletorMaquina");
const seletorUnidade = document.getElementById("seletorUnidade");

const dataHojeCompacta = document.getElementById("dataHojeCompacta");
const dataJulianaSpan = document.getElementById("dataJuliana");
const dataValidadeSpan = document.getElementById("dataValidade");
const dataRetiradaSpan = document.getElementById("dataRetirada");

const loteLinhaSuperior = document.getElementById("loteLinhaSuperior");
const loteLinhaInferior = document.getElementById("loteLinhaInferior");
const loteRetiradaGrande = document.getElementById("loteRetiradaGrande");

const abaData = document.getElementById("abaData");
const abaLote = document.getElementById("abaLote");

/* ===========================================================
   LÓGICA DE NAVEGAÇÃO E CÁLCULO DE MÉDIAS
   =========================================================== */
const inputFields = {
  'frio1': 'frio2', 'frio2': 'frio3', 'frio3': 'frio4', 'frio4': 'frio5', 'frio5': 'frio6', 'frio6': 'quente1',
  'quente1': 'quente2', 'quente2': 'quente3', 'quente3': 'quente4', 'quente4': 'quente5', 'quente5': 'quente6', 'quente6': 'calcularMedias'
};

document.querySelectorAll('input[type="number"]').forEach(input => {
  input.setAttribute('inputmode', 'decimal');
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const nextId = inputFields[this.id];
      if (nextId) {
        const nextEl = document.getElementById(nextId);
        setTimeout(() => { nextEl.focus(); if(nextEl.tagName === 'INPUT') nextEl.select(); }, 20);
      }
    }
  });
});

document.getElementById('calcularMedias').addEventListener('click', calcularMedias);

function calcularMedias() {
    const obterValores = (pref) => [...Array(6)].map((_, i) => parseFloat(document.getElementById(`${pref}${i+1}`).value)).filter(v => !isNaN(v));
    const frios = obterValores('frio');
    const quentes = obterValores('quente');

    if (frios.length < 6 || quentes.length < 6) {
        alert("Preencha todos os 6 valores em cada coluna.");
        return;
    }

    const mFrio = frios.reduce((a, b) => a + b, 0) / 6;
    const mQuente = quentes.reduce((a, b) => a + b, 0) / 6;
    const delta = mQuente - mFrio;

    document.getElementById('mediaFrios').textContent = mFrio.toFixed(1);
    document.getElementById('mediaQuentes').textContent = mQuente.toFixed(1);
    const dSpan = document.getElementById('delta');
    dSpan.textContent = delta.toFixed(1);
    document.querySelector('.resultados').style.display = 'block';
    dSpan.className = (delta < 25.0 || delta > 28.0) ? 'delta-vermelho' : 'delta-azul';
}

/* ===========================================================
   LÓGICA DE DATAS E LOTE (ABAS LATERAIS)
   =========================================================== */

function popularSelectProdutos() {
    const linha = seletorLinha.value;
    const prods = dadosProducao[linha].produtos;
    seletorProduto.innerHTML = "";
    for (let chave in prods) {
        let opt = document.createElement("option");
        opt.value = chave; opt.textContent = prods[chave].label;
        seletorProduto.appendChild(opt);
    }
    atualizarMaquinas();
    atualizarCalculosDatas();
}

function atualizarMaquinas() {
    const linha = seletorLinha.value;
    seletorMaquina.innerHTML = "";
    maquinasPorLinha[linha].forEach(m => {
        let opt = document.createElement("option");
        opt.value = m; opt.textContent = `Máquina ${m}`;
        seletorMaquina.appendChild(opt);
    });
    gerarStringLote();
}

function atualizarCalculosDatas() {
    const hoje = new Date();
    const linhaVal = seletorLinha.value;
    const prodVal = seletorProduto.value;
    
    if (!dadosProducao[linhaVal]?.produtos[prodVal]) return;
    const info = dadosProducao[linhaVal].produtos[prodVal];

    // Data Juliana
    const inicio = new Date(hoje.getFullYear(), 0, 0);
    const diff = hoje - inicio;
    const diaJuliano = Math.floor(diff / (1000 * 60 * 60 * 24));
    dataJulianaSpan.textContent = diaJuliano.toString().padStart(3, '0');

    // Validade e Retirada
    const dVal = new Date(hoje); dVal.setDate(hoje.getDate() + info.validade);
    const dRet = new Date(hoje); dRet.setDate(hoje.getDate() + info.retirada);
    
    dataHojeCompacta.textContent = hoje.toLocaleDateString("pt-BR");
    document.getElementById("dataAtual").textContent = hoje.toLocaleDateString("pt-BR");
    dataValidadeSpan.textContent = dVal.toLocaleDateString("pt-BR");
    dataRetiradaSpan.textContent = dRet.getDate().toString().padStart(2, '0') + " " + (dRet.getMonth()+1).toString().padStart(2, '0');
    
    // Integração: Atualiza o lote sempre que a data/produto mudar
    gerarStringLote();
}

function gerarStringLote() {
    const hoje = new Date();
    const linhaVal = seletorLinha.value;
    const prodVal = seletorProduto.value;
    const unidade = seletorUnidade.value;
    const maq = seletorMaquina.value;
    
    if (!dadosProducao[linhaVal]?.produtos[prodVal]) return;

    const info = dadosProducao[linhaVal].produtos[prodVal];
    const dVal = new Date(hoje); dVal.setDate(hoje.getDate() + info.validade);

    // Linha Superior: VAL 02 MAI 26
    const strVal = `VAL ${dVal.getDate().toString().padStart(2, '0')} ${mesesAbrev[dVal.getMonth()]} ${dVal.getFullYear().toString().slice(-2)}`;
    
    // Linha Inferior: L + UNIDADE + NUM_LINHA + JULIANA + HORA + MAQ
    const numLinha = linhaVal === "linha20k" ? "4" : (linhaVal === "linha3" ? "3" : "1");
    const juliana = dataJulianaSpan.textContent;
    const hora = hoje.getHours().toString().padStart(2, '0') + hoje.getMinutes().toString().padStart(2, '0');
    const strLote = `L${unidade}${numLinha}${juliana}${hora}${maq}`;

    // Retirada para o quadro grande
    const dRet = new Date(hoje); dRet.setDate(hoje.getDate() + info.retirada);
    const strRetiradaGrande = dRet.getDate().toString().padStart(2, '0') + (dRet.getMonth()+1).toString().padStart(2, '0');

    loteLinhaSuperior.textContent = strVal;
    loteLinhaInferior.textContent = strLote;
    loteRetiradaGrande.textContent = strRetiradaGrande;
}

/* ===========================================================
   RELÓGIO E EVENTOS
   =========================================================== */
function atualizarRelogio() {
    const h = new Date().toLocaleTimeString("pt-BR");
    if(document.getElementById("horaEsquerda")) document.getElementById("horaEsquerda").textContent = h;
    if(document.getElementById("horaDireita")) document.getElementById("horaDireita").textContent = h;
    if(new Date().getSeconds() === 0) gerarStringLote(); 
}
setInterval(atualizarRelogio, 1000);

// Eventos de Interface
seletorLinha.addEventListener("change", popularSelectProdutos);
seletorProduto.addEventListener("change", atualizarCalculosDatas);
seletorMaquina.addEventListener("change", gerarStringLote);
seletorUnidade.addEventListener("change", gerarStringLote);

// Abrir/Fechar Painéis
abaData.addEventListener("click", (e) => {
    if(e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') return;
    abaData.classList.toggle("expandida");
});

abaLote.addEventListener("click", (e) => {
    if(e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') return;
    abaLote.classList.toggle("expandida");
    if (abaLote.classList.contains("expandida")) gerarStringLote();
});

// Dark Mode
document.getElementById('toggleDarkMode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Inicialização
popularSelectProdutos();
atualizarRelogio();

/* ===========================================================
   FUNÇÕES DE LIMPEZA (ZERAR)
   =========================================================== */

function zerarTudo() {
    // Limpa todos os 12 campos de input
    for (let i = 1; i <= 6; i++) {
        document.getElementById(`frio${i}`).value = '';
        document.getElementById(`quente${i}`).value = '';
    }
    // Reseta a visualização
    document.getElementById('mediaFrios').textContent = '';
    document.getElementById('mediaQuentes').textContent = '';
    const dSpan = document.getElementById('delta');
    dSpan.textContent = '';
    dSpan.classList.remove('delta-vermelho', 'delta-azul');
    document.querySelector('.resultados').style.display = 'none';
    
    // Devolve o foco para o primeiro campo
    document.getElementById('frio1').focus();
}

function zerarQuentes() {
    // Limpa apenas os campos da coluna Quente
    for (let i = 1; i <= 6; i++) {
        document.getElementById(`quente${i}`).value = '';
    }
    
    // Recalcula apenas a média dos frios para manter o painel atualizado
    const valoresFrios = [...Array(6)].map((_, i) => parseFloat(document.getElementById(`frio${i + 1}`).value));
    
    if (valoresFrios.some(isNaN)) {
        document.getElementById('mediaFrios').textContent = '';
        document.querySelector('.resultados').style.display = 'none';
    } else {
        const mediaFrios = valoresFrios.reduce((sum, num) => sum + num, 0) / 6;
        document.getElementById('mediaFrios').textContent = mediaFrios.toFixed(1);
    }

    document.getElementById('mediaQuentes').textContent = '';
    const dSpan = document.getElementById('delta');
    dSpan.textContent = '';
    dSpan.classList.remove('delta-vermelho', 'delta-azul');
    
    // Devolve o foco para o primeiro campo quente
    document.getElementById('quente1').focus();
}

// Vinculando os botões (Caso seu HTML não tenha o 'onclick')
// Se os IDs dos seus botões forem diferentes, ajuste aqui:
const btnZerarTudo = document.getElementById('btnZerarTudo');
const btnZerarQuentes = document.getElementById('btnZerarQuentes');

if(btnZerarTudo) btnZerarTudo.addEventListener('click', zerarTudo);
if(btnZerarQuentes) btnZerarQuentes.addEventListener('click', zerarQuentes);
