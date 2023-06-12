document.addEventListener('DOMContentLoaded', function() {
  // Seleciona os elementos do DOM
  const citacaoText = document.getElementById('citacao'); // Elemento de exibição da citação
  const autorText = document.getElementById('autor'); // Elemento de exibição do autor
  const gerarButton = document.getElementById('gerarButton'); // Botão de geração de citação
  const previousCitacoesContainer = document.getElementById('previousCitacoes'); // Container das citações anteriores

  // Adiciona um ouvinte de evento de clique ao botão de geração de citação
  gerarButton.addEventListener('click', function() {
    fetchCitacao();
  });

  // Função para buscar uma nova citação da API
  function fetchCitacao() {
    const apiUrl = 'https://api.quotable.io/random?tags=love';

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const citacao = data.content;
        const autor = data.author;

        // Atualiza o texto da citação e do autor no DOM
        citacaoText.textContent = citacao;
        autorText.textContent = `- ${autor}`;

        // Armazena a citação gerada no armazenamento local
        storeCitacao(citacao, autor);

        // Atualiza a exibição das últimas citações geradas
        updatePreviousCitacoes();
      })
      .catch(error => {
        console.log('Erro:', error);
        citacaoText.textContent = 'Ocorreu um erro ao buscar a citação. Por favor, tente novamente mais tarde.';
        autorText.textContent = '';
      });
  }

  // Função para armazenar a citação no armazenamento local
  function storeCitacao(citacao, autor) {
    let storedCitacoes = getStoredCitacoes();

    storedCitacoes.push({ citacao, autor });

    if (storedCitacoes.length > 3) {
      storedCitacoes.shift(); // Remove a primeira citação caso o limite seja excedido
    }

    localStorage.setItem('previousCitacoes', JSON.stringify(storedCitacoes));
  }

  // Função para obter as citações armazenadas
  function getStoredCitacoes() {
    const storedCitacoes = JSON.parse(localStorage.getItem('previousCitacoes'));

    return storedCitacoes ? storedCitacoes : [];
  }

  // Função para atualizar a exibição das citações anteriores
  function updatePreviousCitacoes() {
    const storedCitacoes = getStoredCitacoes();

    previousCitacoesContainer.innerHTML = ''; // Limpa o conteúdo anterior

    storedCitacoes.forEach(citacao => {
      const { citacao: cita, autor } = citacao;

      // Cria elementos HTML para exibir a citação e o autor
      const citacaoElement = document.createElement('div');
      const citacaoTextElement = document.createElement('p');
      const autorElement = document.createElement('p');

      // Define o conteúdo e a classe dos elementos
      citacaoTextElement.textContent = cita;
      autorElement.classList.add('autor');
      autorElement.textContent = `- ${autor}`;

      // Adiciona os elementos ao container das citações anteriores
      citacaoElement.appendChild(citacaoTextElement);
      citacaoElement.appendChild(autorElement);
      previousCitacoesContainer.appendChild(citacaoElement);
    });
  }

  // Limpa as últimas citações armazenadas quando a página é carregada
  localStorage.removeItem('previousCitacoes');

});
