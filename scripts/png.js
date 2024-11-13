// Função para capturar o conteúdo do container e gerar o PNG
async function generatePNG() {
    try {
        const container = document.getElementById('resultSection'); // Elemento a ser capturado
        const canvas = await html2canvas(container, { 
            scale: 2, // Aumenta a qualidade da imagem
            scrollX: 0,
            scrollY: 0,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight
        });

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
