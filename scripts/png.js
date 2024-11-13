// Função para capturar o conteúdo do container e gerar o PNG
async function generatePNG() {
    try {
        // Seleciona o botão e esconde-o temporariamente
        const button = document.querySelector('button[onclick="generatePNG()"]');
        button.style.display = 'none';

        const container = document.getElementById('resultSection'); // Elemento a ser capturado
        const canvas = await html2canvas(container, { 
            scale: 2,
            scrollX: 0,
            scrollY: 0,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight
        });

        // Restaura a exibição do botão após a captura
        button.style.display = 'block';

        const imageData = canvas.toDataURL('image/png');

        // Cria um link para download da imagem
        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'captura_tela.png';
        link.click();

    } catch (error) {
        console.error("Erro ao gerar o PNG:", error);
    }
}
