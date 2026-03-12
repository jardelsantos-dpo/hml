// Função para carregar componentes HTML
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Erro ao carregar ${filePath}`);
        const content = await response.text();
        document.getElementById(elementId).innerHTML = content;
        
        // Avisa ao sistema que o header/footer terminou de carregar
        document.dispatchEvent(new Event('componentLoaded'));
    } catch (error) {
        console.error(error);
    }
}

// Lógica de Tema (Dark Mode)
function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    // 1. Aplica o tema imediatamente para evitar o "flash" branco
    applyTheme();

    // 2. Carrega os componentes
    loadComponent("header-placeholder", "./components/header.html");
    loadComponent("footer-placeholder", "./components/footer.html");
});

// Re-aplica o tema ou lógica de ícones após o Header ser injetado
document.addEventListener('componentLoaded', () => {
    applyTheme();
});