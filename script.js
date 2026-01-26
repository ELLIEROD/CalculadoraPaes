/* ===========================================================
   CONFIGURAÇÃO DE LINHAS E PRODUTOS (EDITE AS DATAS AQUI)
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

/* ===========================================================
   LÓGICA DE NAVEGAÇÃO E CÁLCULO DE MÉDIAS
   =========================================================== */
const inputFields = {
  'frio1': 'frio2',
  'frio2': 'frio3',
  'frio3': 'frio4',
  'frio4': 'frio5',
  'frio5': 'frio6',
  'frio6': 'quente1',
  'quente1': 'quente2',
  'quente2': 'quente3',
  'quente3': 'quente4',
  'quente4': 'quente5',
  'quente5': 'quente6',
  'quente6': 'calcularMedias'
};

const buttonCalcular = document.getElementById('calcularMedias');
const allInputFields = document.querySelectorAll('input[type="number"]');
const resultadosDiv = document.querySelector('.resultados');
const mediaFriosSpan = document.getElementById('mediaFrios');
const mediaQuentesSpan = document.getElementById('mediaQuentes');
const deltaSpan = document.getElementById('delta');

// Aplica a lógica de navegação vertical e teclado otimizado (Mobile Fix)
allInputFields.forEach(input => {
  input.setAttribute('inputmode', 'decimal');

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      
      const nextId = inputFields[this.id];
      if (nextId) {
        const nextElement = document.getElementById(nextId);
        if (nextElement) {
          // O segredo para mobile: micro-atraso
          setTimeout(() => {
            nextElement.focus();
            if (nextElement.tagName === 'INPUT') {
              nextElement.select(); 
            }
          }, 20);
        }
      }
    }
  });
});

buttonCalcular.addEventListener('click', calcularMedias);

function calcularMedias() {
  const valoresFrios = [...Array(6)].map((_, i) => parseFloat(document.getElementById(`frio${i + 1}`).value));
  const valoresQuentes = [...Array(6)].map((_, i) => parseFloat(document.getElementById(`quente${i + 1}`).value));

  if (valoresFrios.some(isNaN) || valoresQuentes.some(isNaN)) {
    alert("Por favor, insira 6 valores numéricos válidos para cada lista.");
    mediaFriosSpan.textContent = '';
    mediaQuentesSpan.textContent = '';
    deltaSpan.textContent = '';
    deltaSpan.classList.remove('delta-vermelho', 'delta-azul');
    resultadosDiv.style.display = 'none';
    return;
  }

  const mediaFrios = valoresFrios.reduce((sum, num) => sum + num, 0) / 6;
  const mediaQuentes = valoresQuentes.reduce((sum, num) => sum + num, 0) / 6;
  const delta = mediaQuentes - mediaFrios;

  mediaFriosSpan.textContent = mediaFrios.toFixed(1);
  mediaQuentesSpan.textContent = mediaQuentes.toFixed(1);
  deltaSpan.textContent = delta.toFixed(1);
  resultadosDiv.style.display = 'block';

  deltaSpan.classList.remove('delta-vermelho', 'delta-azul');
  if (delta < 25.0 || delta > 28.0) {
    deltaSpan.classList.add('delta-vermelho');
  } else {
    deltaSpan.classList.add('delta-azul');
  }
}

function zerarTudo() {
  for (let i = 1; i <= 6; i++) {
    document.getElementById(`frio${i}`).value = '';
    document.getElementById(`quente${i}`).value = '';
  }
  mediaFriosSpan.textContent = '';
  mediaQuentesSpan.textContent = '';
  deltaSpan.textContent = '';
  deltaSpan.classList.remove('delta-vermelho', 'delta-azul');
  resultadosDiv.style.display = 'none';
  document.getElementById('frio1').focus();
}

function zerarQuentes() {
  for (let i = 1; i <= 6; i++) {
    document.getElementById(`quente${i}`).value = '';
  }
  const valoresFrios = [...Array(6)].map((_, i) => parseFloat(document.getElementById(`frio${i + 1}`).value));
  if (valoresFrios.some(isNaN)) {
    mediaFriosSpan.textContent = '';
    resultadosDiv.style.display = 'none';
  } else {
    const mediaFrios = valoresFrios.reduce((sum, num) => sum + num, 0) / 6;
    mediaFriosSpan.textContent = mediaFrios.toFixed(1);
    resultadosDiv.style.display = 'block';
  }
  mediaQuentesSpan.textContent = '';
  deltaSpan.textContent = '';
  deltaSpan.classList.remove('delta-vermelho', 'delta-azul');
  document.getElementById('quente1').focus();
}

function atualizarRelogio() {
  const agora = new Date();
  const horas = agora.getHours().toString().padStart(2, '0');
  const minutos = agora.getMinutes().toString().padStart(2, '0');
  const segundos = agora.getSeconds().toString().padStart(2, '0');
  const horaAtual = `${horas}:${minutos}:${segundos}`;

  const esquerda = document.getElementById("horaEsquerda");
  const direita = document.getElementById("horaDireita");

  if (esquerda) esquerda.textContent = horaAtual;
  if (direita) direita.textContent = horaAtual;
}

setInterval(atualizarRelogio, 1000);
atualizarRelogio();

/* ===========================================================
   LÓGICA DO PAINEL DE CLAVES (SELETORES DINÂMICOS)
   =========================================================== */
const abaData = document.getElementById("abaData");
const seletorLinha = document.getElementById("seletorLinha");
const seletorProduto = document.getElementById("seletorProduto");

const dataHojeCompacta = document.getElementById("dataHojeCompacta");
const diaSemanaSpan = document.getElementById("diaSemana");
const dataAtualSpan = document.getElementById("dataAtual");
const dataJulianaSpan = document.getElementById("dataJuliana");
const dataValidadeSpan = document.getElementById("dataValidade");
const dataRetiradaSpan = document.getElementById("dataRetirada");

const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

// Preenche o Select de Produtos baseado na Linha escolhida
function popularSelectProdutos() {
  const linhaSelecionada = seletorLinha.value;
  const listaProdutos = dadosProducao[linhaSelecionada].produtos;

  // Limpa as opções atuais
  seletorProduto.innerHTML = "";

  // Cria as novas opções
  for (let chave in listaProdutos) {
    const option = document.createElement("option");
    option.value = chave;
    option.textContent = listaProdutos[chave].label;
    seletorProduto.appendChild(option);
  }
  
  // Atualiza os cálculos imediatamente após mudar a lista
  atualizarCalculosDatas();
}

function atualizarCalculosDatas() {
  const hoje = new Date();
  
  const linhaVal = seletorLinha.value;
  const prodVal = seletorProduto.value;
  
  // Proteção contra leitura de dados inexistentes durante troca
  if (!dadosProducao[linhaVal] || !dadosProducao[linhaVal].produtos[prodVal]) return;

  const dados = dadosProducao[linhaVal].produtos[prodVal];
  const validadeDias = dados.validade;
  const retiradaDias = dados.retirada;

  const diaSemana = diasSemana[hoje.getDay()];
  const dd = hoje.getDate().toString().padStart(2, '0');
  const mm = (hoje.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = hoje.getFullYear();
  
  // Cálculo Data Juliana
  const start = new Date(hoje.getFullYear(), 0, 0);
  const diff = hoje - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const diaJuliano = Math.floor(diff / oneDay);

  // Cálculo Validade
  const dataValidade = new Date(hoje);
  dataValidade.setDate(hoje.getDate() + validadeDias);
  const validadeFormatada = dataValidade.toLocaleDateString("pt-BR");

  // Cálculo Retirada (Formato DD MM)
  const dataRetirada = new Date(hoje);
  dataRetirada.setDate(hoje.getDate() + retiradaDias);
  const retiradaFormatada = dataRetirada.getDate().toString().padStart(2, '0') + " " +
                            (dataRetirada.getMonth() + 1).toString().padStart(2, '0');

  dataHojeCompacta.textContent = `${dd}/${mm}/${yyyy}`;
  diaSemanaSpan.textContent = diaSemana;
  dataAtualSpan.textContent = `${dd}/${mm}/${yyyy}`;
  dataJulianaSpan.textContent = diaJuliano.toString().padStart(3, '0').slice(-3);
  dataValidadeSpan.textContent = validadeFormatada;
  dataRetiradaSpan.textContent = retiradaFormatada;
}

// Event Listeners dos seletores
seletorLinha.addEventListener("change", popularSelectProdutos);
seletorProduto.addEventListener("change", atualizarCalculosDatas);

// Lógica de abrir/fechar o painel
abaData.addEventListener("click", (e) => {
  // Impede que o painel feche se o usuário clicar dentro dos seletores
  if(e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') return;
  
  abaData.classList.toggle("expandida");
  if (abaData.classList.contains("expandida")) {
      atualizarCalculosDatas(); 
  }
});

/* ===========================================================
   DARK MODE & SERVICE WORKER
   =========================================================== */
const toggleButton = document.getElementById('toggleDarkMode');
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
}

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

// Inicializa o painel na primeira carga
popularSelectProdutos();
atualizarCalculosDatas();
