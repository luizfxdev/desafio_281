// Elementos do DOM
const movementInput = document.getElementById('movementInput');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const resultSection = document.getElementById('resultSection');
const calculationDetails = document.getElementById('calculationDetails');
const finalResult = document.getElementById('finalResult');

// Event listeners
calculateBtn.addEventListener('click', calculateDistance);
resetBtn.addEventListener('click', resetCalculation);

// Permite calcular com Enter
movementInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter' && event.ctrlKey) {
    calculateDistance();
  }
});

/**
 * Função principal para calcular a distância percorrida pela nave
 */
function calculateDistance() {
  // Limpar resultados anteriores
  clearResults();

  // Obter e validar entrada
  const inputValue = movementInput.value.trim();
  if (!inputValue) {
    showError('⚠️ Por favor, insira uma sequência de movimentos!');
    return;
  }

  // Processar movimentos
  const movements = parseMovements(inputValue);
  if (!movements) {
    return; // Erro já foi tratado na função parseMovements
  }

  // Calcular distância
  const result = processSpaceshipMovements(movements);

  // Exibir resultado
  displayResults(movements, result);
}

/**
 * Processa os movimentos da entrada do usuário
 * @param {string} input - String com movimentos separados por vírgula
 * @returns {Array|null} - Array de movimentos válidos ou null se inválido
 */
function parseMovements(input) {
  const rawMovements = input.split(',').map(move => move.trim().toLowerCase());
  const validMovements = ['frente', 'trás', 'esquerda', 'direita'];
  const processedMovements = [];

  for (let i = 0; i < rawMovements.length; i++) {
    const movement = rawMovements[i];

    if (!movement) {
      continue; // Pular entradas vazias
    }

    if (!validMovements.includes(movement)) {
      showError(`❌ Movimento inválido: "${movement}". Use apenas: frente, trás, esquerda, direita`);
      return null;
    }

    processedMovements.push(movement);
  }

  if (processedMovements.length === 0) {
    showError('⚠️ Nenhum movimento válido encontrado!');
    return null;
  }

  return processedMovements;
}

/**
 * Função principal que resolve o desafio da nave espacial
 * @param {Array} movements - Array com a sequência de movimentos
 * @returns {Object} - Objeto com detalhes do cálculo e resultado final
 */
function processSpaceshipMovements(movements) {
  let totalDistance = 0;
  const steps = [];

  for (let i = 0; i < movements.length; i++) {
    const movement = movements[i];
    let distanceChange = 0;
    let action = '';

    switch (movement) {
      case 'frente':
        distanceChange = 1;
        action = 'avança (+1)';
        break;
      case 'trás':
        distanceChange = -1;
        action = 'recua (-1)';
        break;
      case 'esquerda':
      case 'direita':
        distanceChange = 0;
        action = 'gira (0)';
        break;
    }

    totalDistance += distanceChange;

    steps.push({
      step: i + 1,
      movement: movement,
      action: action,
      distanceChange: distanceChange,
      totalDistance: totalDistance
    });
  }

  return {
    steps: steps,
    totalDistance: totalDistance,
    movementCount: movements.length
  };
}

/**
 * Exibe os resultados do cálculo na interface
 * @param {Array} movements - Array de movimentos processados
 * @param {Object} result - Resultado do cálculo
 */
function displayResults(movements, result) {
  // Criar detalhes do cálculo
  let calculationHTML = '<div class="calculation-step"><strong>🚀 Análise da Jornada de Zorblax:</strong></div>';
  calculationHTML += `<div class="calculation-step">Movimentos analisados: <span class="step-movement">${result.movementCount}</span></div><br>`;

  result.steps.forEach(step => {
    calculationHTML += `
            <div class="calculation-step">
                <strong>Passo ${step.step}:</strong> 
                <span class="step-movement">"${step.movement}"</span> → 
                <span class="step-action">${step.action}</span> → 
                <span class="step-total">Total: ${step.totalDistance}</span>
            </div>
        `;
  });

  calculationDetails.innerHTML = calculationHTML;

  // Exibir resultado final
  finalResult.innerHTML = `
        🎯 <strong>Distância Total Percorrida:</strong><br>
        <span style="font-size: 1.5em;">${result.totalDistance} unidades</span>
    `;

  // Mostrar seção de resultado com animação
  resultSection.classList.add('show');

  // Scroll suave para o resultado em dispositivos móveis
  if (window.innerWidth <= 768) {
    setTimeout(() => {
      resultSection.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 300);
  }
}

/**
 * Exibe mensagem de erro
 * @param {string} message - Mensagem de erro a ser exibida
 */
function showError(message) {
  calculationDetails.innerHTML = `<div class="error-message">${message}</div>`;
  finalResult.innerHTML = '';
  resultSection.classList.add('show');
}

/**
 * Limpa os resultados da interface
 */
function clearResults() {
  calculationDetails.innerHTML = '';
  finalResult.innerHTML = '';
  resultSection.classList.remove('show');
}

/**
 * Reseta toda a calculadora
 */
function resetCalculation() {
  movementInput.value = '';
  clearResults();
  movementInput.focus();

  // Animação visual de reset
  movementInput.style.transform = 'scale(1.05)';
  setTimeout(() => {
    movementInput.style.transform = 'scale(1)';
  }, 150);
}

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
  // Focar no input ao carregar a página
  movementInput.focus();

  // Configurar placeholder dinâmico (opcional)
  const placeholders = [
    'frente, esquerda, frente, trás, direita',
    'trás, trás, esquerda, frente',
    'direita, frente, frente, esquerda, trás'
  ];

  let placeholderIndex = 0;
  setInterval(() => {
    if (!movementInput.value && document.activeElement !== movementInput) {
      movementInput.placeholder = `Digite os movimentos: ${placeholders[placeholderIndex]}`;
      placeholderIndex = (placeholderIndex + 1) % placeholders.length;
    }
  }, 4000);

  console.log('🛸 Sistema de Controle da Nave Espacial Intergaláctica inicializado!');
  console.log('Zorblax está pronto para a jornada através da Via Láctea! 🚀');
});
