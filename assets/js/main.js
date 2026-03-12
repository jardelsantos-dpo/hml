async function loadComponent(elementId, filePath) {
    try {
        // Adicionamos um console.log para debugar no navegador (F12)
        console.log(`Tentando carregar: ${filePath}`);
        
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        const content = await response.text();
        document.getElementById(elementId).innerHTML = content;
        
        // Dispara um evento para avisar que o componente carregou
        // Isso é útil se você tiver scripts que dependem do Header (como o dark mode)
        document.dispatchEvent(new Event('componentLoaded'));
        
    } catch (error) {
        console.error("Erro crítico ao carregar componente:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Usar caminhos relativos à raiz do projeto
    loadComponent("header-placeholder", "./components/header.html");
    loadComponent("footer-placeholder", "./components/footer.html");
});