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

function toggleMenu() {
    const nav = document.getElementById('mobile-nav');
    nav.classList.toggle('active');
}

// Fecha o menu ao clicar em um link (opcional)
document.addEventListener('click', (e) => {
    const nav = document.getElementById('mobile-nav');
    if (nav && !nav.contains(e.target) && !e.target.closest('button')) {
        nav.classList.remove('active');
    }
});

// Função para destacar o link da página atual
function highlightCurrentPage() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // Remove classes de destaque anteriores para garantir limpeza
        link.classList.remove('text-brand-primary', 'font-bold');

        // Se o link for igual ao caminho atual, adiciona o destaque
        if (linkPath === currentPath) {
            link.classList.add('text-brand-primary', 'font-bold');
        }
    });
}

// Modifique o seu EventListener existente para incluir a chamada
document.addEventListener('componentLoaded', () => {
    // ... suas outras chamadas (como aplicarTema) ...
    highlightCurrentPage();
});

// --- LÓGICA DA GALERIA ---

const fotos = [
    { url: 'https://images.unsplash.com/photo-1541599540903-216a46ca1ad0', caption: 'Border Collie na praia', categoria: 'caes' },
    { url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e', caption: 'Bulldog Francês estiloso', categoria: 'caes' },
    { url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7', caption: 'Golden Retriever', categoria: 'caes' },
    { url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8', caption: 'Golden Retriever', categoria: 'caes' },
    { url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b', caption: 'Passeio em grupo', categoria: 'passeios' },
    { url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', caption: 'Gato curioso', categoria: 'gatos' },
    { url: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6', caption: 'Corrida no parque', categoria: 'passeios' },
    { url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee', caption: 'Cavalier King Charles', categoria: 'caes' }
];

let fotosFiltradas = [...fotos];

function renderGallery() {
    const grid = document.getElementById('grid-galeria');
    if (!grid) return; // Segurança caso não esteja na index
    
    grid.style.opacity = '0';
    
    setTimeout(() => {
        grid.innerHTML = fotosFiltradas.map(foto => `
            <div class="group relative overflow-hidden rounded-2xl cursor-pointer aspect-square" 
                 onclick="openLightbox('${foto.url}', '${foto.caption}')">
                <img src="${foto.url}?auto=format&fit=crop&q=80&w=400" 
                     alt="${foto.caption}" 
                     class="w-full h-full object-cover transition duration-500 group-hover:scale-110">
                <div class="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <i class="fas fa-search-plus text-white text-2xl"></i>
                </div>
            </div>
        `).join('');
        grid.style.opacity = '1';
    }, 300);
}

function filterGallery(categoria) {
    // 1. Atualizar Botões Visualmente
    const botoes = document.querySelectorAll('.filter-btn');
    botoes.forEach(btn => {
        // Remove a classe ativa de todos
        btn.classList.remove('active-filter', 'border-brand-primary');
        btn.classList.add('border-gray-200', 'dark:border-gray-700');
    });

    // Adiciona a classe ativa apenas no botão clicado usando o evento do navegador
    const botaoClicado = event.currentTarget;
    botaoClicado.classList.add('active-filter', 'border-brand-primary');
    botaoClicado.classList.remove('border-gray-200', 'dark:border-gray-700');

    // 2. Filtrar Dados (Aqui corrigimos o problema de 'caes' vs 'cães')
    if (categoria === 'todos') {
        fotosFiltradas = [...fotos];
    } else {
        fotosFiltradas = fotos.filter(f => f.categoria === categoria);
    }
    
    renderGallery();
}

// Funções de Lightbox
function openLightbox(url, caption) {
    const lightbox = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = url + '?auto=format&fit=crop&q=80&w=1200';
    document.getElementById('lightbox-caption').innerText = caption;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.add('hidden');
}

// Iniciar a galeria quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('grid-galeria')) {
        renderGallery();
    }
});