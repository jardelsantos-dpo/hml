// Função para aplicar o tema salvo ou a preferência do sistema
function aplicarTema() {
    const temaSalvo = localStorage.getItem('theme');
    const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (temaSalvo === 'dark' || (!temaSalvo && prefereEscuro)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Função para alternar entre os modos
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Inicializa a aplicação do tema
aplicarTema();