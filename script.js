/* ===========================================================
   CONFIGURAÇÃO DE DADOS (LINHAS, PRODUTOS E MÁQUINAS)
   =========================================================== */
const dadosProducao = {
  "linha20k": {
    nome: "Linha 20k",
    produtos: {
      "pppi": { label: "PP e PI", validade: 50, retirada: 35, envio: 10 },
      "artesanos": { label: "Artesanos", validade: 35, retirada: 23, envio: 9 },
      "aparas": { label: "Aparas", validade: 15, retirada: 12, envio: 0 }
    }
  },
  "linha3": {
    nome: "Linha 3",
    produtos: {
      "paesEspeciais": { label: "Pães Especiais", validade: 35, retirada: 23, envio: 10 }, 
      "paesintegraise12graos": { label: "Pão Integral Zero e 12 Grãos 350g", validade: 28, retirada: 19, envio: 10 },
      "aparas": { label: "Aparas", validade: 15, retirada: 12, envio: 0 }
    }
  },
  "bolleria": {
    nome: "Bolleria",
    produtos: {
      "brioche": { label: "Brioche", validade: 60, retirada: 45, envio: 10 }, 
      "artesanos": { label: "Artesanos", validade: 35, retirada: 23, envio: 10 },
      "aparas": { label: "Aparas", validade: 15, retirada: 12, envio: 0 }
    }
  }
};

const maquinasPorLinha = {
    "linha20k": ["01", "02", "03", "04", "05", "06"],
    "linha3": ["01", "02", "03"],
    "bolleria": ["01", "02", "03", "04"]
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
const dataEnvioSpan = document.getElementById("dataEnvio");

const loteLinhaSuperior = document.getElementById("loteLinhaSuperior");
const loteLinhaInferior = document.getElementById("loteLinhaInferior");
const loteRetiradaGrande = document.getElementById("loteRetiradaGrande");
const loteEnvioGrande = document.getElementById("loteEnvioGrande");

const abaData = document.getElementById("abaData");
const abaLote = document.getElementById("abaLote");

/* ===========================================================
   LÓGICA DE NAVEGAÇÃO E CÁLCULO DE MÉDIAS
   =========================================================== */
const inputFields = {
  'frio1': 'frio2', 'frio2': 'frio3', 'frio3': 'frio4', 'frio4': 'frio5', 'frio5': 'frio6', 'frio6': 'quente1',
  'quente1': 'quente2', 'quente2': 'quente3', 'quente3': 'quente4', 'quente4': 'quente5', 'quente5': 'quente6', 'quente6': 'calcularMedias'
};

// Cria automaticamente o mapeamento inverso para voltar os campos
const previousFields = {};
Object.keys(inputFields).forEach(currentId => {
  const nextId = inputFields[currentId];
  previousFields[nextId] = currentId;
});

document.querySelectorAll('input[type="number"]').forEach(input => {
  input.setAttribute('inputmode', 'decimal');
  
  input.addEventListener('keydown', function (e) {
    const isEnter = e.key === 'Enter';
    const isTab = e.key === 'Tab';

    if (isEnter || isTab) {
      e.preventDefault(); 
      let targetId = null;

      if (e.shiftKey) {
        targetId = previousFields[this.id];
      } else {
        targetId = inputFields[this.id];
      }

      if (targetId) {
        const nextEl = document.getElementById(targetId);
        if (nextEl) {
          setTimeout(() => { 
            nextEl.focus(); 
            if (nextEl.tagName === 'INPUT' && typeof nextEl.select === 'function') {
              nextEl.select(); 
            }
          }, 20);
        }
      }
    }
  });
});

const btnCalcular = document.getElementById('calcularMedias');
if(btnCalcular) btnCalcular.addEventListener('click', calcularMedias);

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

    if(document.getElementById('mediaFrios')) document.getElementById('mediaFrios').textContent = mFrio.toFixed(1);
    if(document.getElementById('mediaQuentes')) document.getElementById('mediaQuentes').textContent = mQuente.toFixed(1);
    
    const dSpan = document.getElementById('delta');
    if(dSpan) {
      dSpan.textContent = delta.toFixed(1);
      dSpan.className = (delta < 25.0 || delta > 28.0) ? 'delta-vermelho' : 'delta-azul';
    }
    
    const divResultados = document.querySelector('.resultados');
    if(divResultados) divResultados.style.display = 'block';
}

/* ===========================================================
   LÓGICA DE DATAS E LOTE (ABAS LATERAIS)
   =========================================================== */

function popularSelectProdutos() {
    if(!seletorLinha || !seletorProduto) return;
    const linha = seletorLinha.value;
    const prods = dadosProducao[linha]?.produtos;
    if(!prods) return;

    seletorProduto.innerHTML = "";
    for (let chave in prods) {
        let opt = document.createElement("option");
        opt.value = chave; 
        opt.textContent = prods[chave].label;
        seletorProduto.appendChild(opt);
    }
    atualizarMaquinas();
    atualizarCalculosDatas();
}

function atualizarMaquinas() {
    if(!seletorLinha || !seletorMaquina) return;
    const linha = seletorLinha.value;
    seletorMaquina.innerHTML = "";
    if(maquinasPorLinha[linha]) {
      maquinasPorLinha[linha].forEach(m => {
          let opt = document.createElement("option");
          opt.value = m; opt.textContent = `Máquina ${m}`;
          seletorMaquina.appendChild(opt);
      });
    }
    gerarStringLote();
}

function atualizarCalculosDatas() {
    const hoje = new Date();
    const linhaVal = seletorLinha ? seletorLinha.value : "";
    const prodVal = seletorProduto ? seletorProduto.value : "";
    
    if (!dadosProducao[linhaVal]?.produtos[prodVal]) return;
    const info = dadosProducao[linhaVal].produtos[prodVal];

    // Data Juliana
    const inicio = new Date(hoje.getFullYear(), 0, 0);
    const diff = hoje - inicio;
    const diaJuliano = Math.floor(diff / (1000 * 60 * 60 * 24));
    if(dataJulianaSpan) dataJulianaSpan.textContent = diaJuliano.toString().padStart(3, '0');

    // Validade, Retirada e Envio
    const dVal = new Date(hoje); dVal.setDate(hoje.getDate() + info.validade);
    const dRet = new Date(hoje); dRet.setDate(hoje.getDate() + info.retirada);
    const dEnv = new Date(hoje); dEnv.setDate(hoje.getDate() + info.envio); 
    
    if(dataHojeCompacta) dataHojeCompacta.textContent = hoje.toLocaleDateString("pt-BR");
    if(document.getElementById("dataAtual")) document.getElementById("dataAtual").textContent = hoje.toLocaleDateString("pt-BR");
    if(dataValidadeSpan) dataValidadeSpan.textContent = dVal.toLocaleDateString("pt-BR");
    if(dataRetiradaSpan) dataRetiradaSpan.textContent = dRet.getDate().toString().padStart(2, '0') + " " + (dRet.getMonth()+1).toString().padStart(2, '0');
    if(dataEnvioSpan) dataEnvioSpan.textContent = dEnv.getDate().toString().padStart(2, '0') + " " + (dEnv.getMonth()+1).toString().padStart(2, '0');
    
    gerarStringLote();
}

function gerarStringLote() {
    const hoje = new Date();
    const linhaVal = seletorLinha ? seletorLinha.value : "";
    const prodVal = seletorProduto ? seletorProduto.value : "";
    const unidade = seletorUnidade ? seletorUnidade.value : "";
    const maq = seletorMaquina ? seletorMaquina.value : "";
    
    if (!dadosProducao[linhaVal]?.produtos[prodVal]) return;

    const info = dadosProducao[linhaVal].produtos[prodVal];
    const dVal = new Date(hoje); dVal.setDate(hoje.getDate() + info.validade);

    // Linha Superior: VAL 02 MAI 26
    const strVal = `VAL ${dVal.getDate().toString().padStart(2, '0')} ${mesesAbrev[dVal.getMonth()]} ${dVal.getFullYear().toString().slice(-2)}`;
    
    // Linha Inferior: L + UNIDADE + NUM_LINHA + JULIANA + HORA + MAQ
    const numLinha = linhaVal === "linha20k" ? "4" : (linhaVal === "linha3" ? "3" : "1");
    const juliana = dataJulianaSpan ? dataJulianaSpan.textContent : "000";
    const hora = hoje.getHours().toString().padStart(2, '0') + hoje.getMinutes().toString().padStart(2, '0');
    const strLote = `L${unidade}${numLinha}${juliana}${hora}${maq}`;

    // Retirada e Envio para o quadro grande
    const dRet = new Date(hoje); dRet.setDate(hoje.getDate() + info.retirada);
    const strRetiradaGrande = `DR ${dRet.getDate().toString().padStart(2, '0') + (dRet.getMonth()+1).toString().padStart(2, '0')}`;
    const dEnv = new Date(hoje); dEnv.setDate(hoje.getDate() + info.envio);
    const strEnvioGrande = `DE ${dEnv.getDate().toString().padStart(2, '0') + (dEnv.getMonth()+1).toString().padStart(2, '0')}`;

    if(loteLinhaSuperior) loteLinhaSuperior.textContent = strVal;
    if(loteLinhaInferior) loteLinhaInferior.textContent = strLote;
    if(loteRetiradaGrande) loteRetiradaGrande.textContent = strRetiradaGrande;
    if(loteEnvioGrande) loteEnvioGrande.textContent = strEnvioGrande;
}

/* ===========================================================
   RELÓGIO E EVENTOS
   =========================================================== */
let diaAtualNaMemoria = new Date().getDate();

function atualizarRelogio() {
    const agora = new Date();
    const h = agora.toLocaleTimeString("pt-BR");
    if(document.getElementById("horaEsquerda")) document.getElementById("horaEsquerda").textContent = h;
    if(document.getElementById("horaDireita")) document.getElementById("horaDireita").textContent = h;
    
    if (agora.getDate() !== diaAtualNaMemoria) {
        diaAtualNaMemoria = agora.getDate(); 
        atualizarCalculosDatas();
    } 
    else if(agora.getSeconds() === 0) {
        gerarStringLote(); 
    }
}
setInterval(atualizarRelogio, 1000);

// Eventos de Interface
if(seletorLinha) seletorLinha.addEventListener("change", popularSelectProdutos);
if(seletorProduto) seletorProduto.addEventListener("change", atualizarCalculosDatas);
if(seletorMaquina) seletorMaquina.addEventListener("change", gerarStringLote);
if(seletorUnidade) seletorUnidade.addEventListener("change", gerarStringLote);

// Abrir/Fechar Painéis
if(abaData) {
  abaData.addEventListener("click", (e) => {
      if(e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') return;
      abaData.classList.toggle("expandida");
  });
}

if(abaLote) {
  abaLote.addEventListener("click", (e) => {
      if(e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') return;
      abaLote.classList.toggle("expandida");
      if (abaLote.classList.contains("expandida")) gerarStringLote();
  });
}

// Dark Mode
const btnDarkMode = document.getElementById('toggleDarkMode');
if(btnDarkMode) {
  btnDarkMode.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
  });
}

// Inicialização das funções
popularSelectProdutos();
atualizarRelogio();

/* ===========================================================
   FUNÇÕES DE LIMPEZA (ZERAR)
   =========================================================== */

function zerarTudo() {
    for (let i = 1; i <= 6; i++) {
        const elFrio = document.getElementById(`frio${i}`);
        const elQuente = document.getElementById(`quente${i}`);
        if(elFrio) elFrio.value = '';
        if(elQuente) elQuente.value = '';
    }
    if(document.getElementById('mediaFrios')) document.getElementById('mediaFrios').textContent = '';
    if(document.getElementById('mediaQuentes')) document.getElementById('mediaQuentes').textContent = '';
    const dSpan = document.getElementById('delta');
    if(dSpan) {
      dSpan.textContent = '';
      dSpan.classList.remove('delta-vermelho', 'delta-azul');
    }
    const divRes = document.querySelector('.resultados');
    if(divRes) divRes.style.display = 'none';
    
    const primeiroInput = document.getElementById('frio1');
    if(primeiroInput) primeiroInput.focus();
}

function zerarQuentes() {
    for (let i = 1; i <= 6; i++) {
        const elQuente = document.getElementById(`quente${i}`);
        if(elQuente) elQuente.value = '';
    }
    
    const valoresFrios = [...Array(6)].map((_, i) => parseFloat(document.getElementById(`frio${i + 1}`)?.value));
    
    if (valoresFrios.some(isNaN)) {
        if(document.getElementById('mediaFrios')) document.getElementById('mediaFrios').textContent = '';
        const divRes = document.querySelector('.resultados');
        if(divRes) divRes.style.display = 'none';
    } else {
        const mediaFrios = valoresFrios.reduce((sum, num) => sum + num, 0) / 6;
        if(document.getElementById('mediaFrios')) document.getElementById('mediaFrios').textContent = mediaFrios.toFixed(1);
    }

    if(document.getElementById('mediaQuentes')) document.getElementById('mediaQuentes').textContent = '';
    const dSpan = document.getElementById('delta');
    if(dSpan) {
      dSpan.textContent = '';
      dSpan.classList.remove('delta-vermelho', 'delta-azul');
    }
    
    const primeiroQuente = document.getElementById('quente1');
    if(primeiroQuente) primeiroQuente.focus();
}

const btnZerarTudo = document.getElementById('btnZerarTudo');
const btnZerarQuentes = document.getElementById('btnZerarQuentes');

if(btnZerarTudo) btnZerarTudo.addEventListener('click', zerarTudo);
if(btnZerarQuentes) btnZerarQuentes.addEventListener('click', zerarQuentes);

/* ===========================================================
   CONTROLE DA SPLASH SCREEN (AUTOOEXECUTÁVEL E SEGURA)
   =========================================================== */
(function() {
  setTimeout(function() {
    var splash = document.getElementById('splash-screen');
    if (splash) {
      splash.style.opacity = '0';
      setTimeout(function() {
        splash.style.display = 'none';
      }, 500);
    }
  }, 2000); // 2 segundos de exibição
})();
