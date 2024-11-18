// Exibe o nome do arquivo ao selecionar
document.getElementById('fileInput').addEventListener('change', (e) => {
    const fileName = e.target.files[0]?.name || 'Nenhum arquivo selecionado';
    document.querySelector('.file').textContent = fileName;
});

// Função para enviar e processar o arquivo
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        console.log('Nenhum arquivo selecionado.');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        console.log("Enviando arquivo para a API...");
        const response = await fetch('https://data-extract-api.vercel.app/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error(`Erro ao processar o arquivo: ${response.statusText}`);

        console.log("Arquivo enviado com sucesso!");
        const data = await response.json(); // Recebe diretamente o array de dados

        // Exibe a seção `.result`
        document.getElementById('resultSection').classList.add('result-visible');
        scrollToResultSection(); // Rola até a seção de resultados

        // Exibe os dados na tabela
        const tableBody = document.getElementById('filteredBranchesBody');
        tableBody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            const filialCell = document.createElement('td');
            filialCell.textContent = row.Filial;
            const desvioCell = document.createElement('td');
            desvioCell.textContent = row.Desvio; // Já formatado com "R$"
            tr.appendChild(filialCell);
            tr.appendChild(desvioCell);
            tableBody.appendChild(tr);
        });

        // Converte os valores de desvio para números para o gráfico
        const labels = data.map(row => row.Filial);
        const desvios = data.map(row => parseFloat(
            row.Desvio.replace('R$', '').replace(/\./g, '').replace(',', '.')
        )); // Converte para números corretamente
        displayChart(labels, desvios);

    } catch (error) {
        console.error('Erro ao enviar o arquivo:', error);
    }
});

// Função para rolar automaticamente para a seção `.result`
function scrollToResultSection() {
    const resultSection = document.getElementById('resultSection');
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// Função para exibir o gráfico com formatação de valores em "k"
function displayChart(labels, desvios) {
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Desvio R$',
                data: desvios,
                backgroundColor: 'rgba(222, 22, 22)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    right:50,
                }
            },
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { display: false },
                    border: { display: false },
                    ticks: {
                        callback: function(value) {
                            // Formata valores em "k" quando maior que 1000
                            return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toLocaleString('pt-BR');
                        }
                    }
                },
                y: {
                    grid: { display: false },
                    border: { display: false }
                }
            },
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: value => {
                        // Formatação de valores nas barras, com "k" quando >= 1000
                        return value >= 1000 ? `R$ ${(value / 1000).toFixed(1)}k` : `R$ ${value.toLocaleString('pt-BR')}`;
                    },
                    color: '#000'
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}
