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

// Aplica a lógica de navegação vertical e teclado otimizado
allInputFields.forEach(input => {
  // Otimização para teclado mobile (força teclado numérico com separador decimal)
  input.setAttribute('inputmode', 'decimal');

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault(); // Impede o salto lateral padrão do mobile
      
      const nextId = inputFields[this.id];
      if (nextId) {
        const nextElement = document.getElementById(nextId);
        if (nextElement) {
          nextElement.focus();
          // Seleciona o texto existente para facilitar a correção rápida
          if (nextElement.tagName === 'INPUT') {
            nextElement.select(); 
          }
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

const abaData = document.getElementById("abaData");
const seletorProduto = document.getElementById("seletorProduto");
const dataHojeCompacta = document.getElementById("dataHojeCompacta");
const diaSemanaSpan = document.getElementById("diaSemana");
const dataAtualSpan = document.getElementById("dataAtual");
const dataJulianaSpan = document.getElementById("dataJuliana");
const dataValidadeSpan = document.getElementById("dataValidade");
const dataRetiradaSpan = document.getElementById("dataRetirada");

const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

function atualizarPainelClaves() {
  const hoje = new Date();
  const produto = seletorProduto.value;

  const diaSemana = diasSemana[hoje.getDay()];
  const dd = hoje.getDate().toString().padStart(2, '0');
  const mm = (hoje.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = hoje.getFullYear();
  const diaJuliano = Math.floor((hoje - new Date(hoje.getFullYear(), 0, 0)) / 86400000);

  const validadeDias = produto === "pppi" ? 50 :
                     produto === "artesanos" ? 35 :
                     produto === "aparas" ? 15 : 0;

  const retiradaDias = produto === "pppi" ? 30 :
                     produto === "artesanos" ? 23 :
                     produto === "aparas" ? 12 : 0;

  const dataValidade = new Date(hoje);
  dataValidade.setDate(hoje.getDate() + validadeDias);
  const validadeFormatada = dataValidade.toLocaleDateString("pt-BR");

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

seletorProduto.addEventListener("change", atualizarPainelClaves);
abaData.addEventListener("click", () => {
  abaData.classList.toggle("expandida");
  atualizarPainelClaves();
});

atualizarPainelClaves();

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
