let games = [];
let filteredGames = [];
let selectedCategory = 'All';
let searchQuery = '';

console.log('Unblocked Games 81: App Initializing...');

async function init() {
    try {
        const response = await fetch('./games.json');
        if (!response.ok) throw new Error('Failed to fetch games data');
        games = await response.json();
        console.log('Games loaded:', games.length);
        renderHome();
        setupSearch();
    } catch (error) {
        console.error('Initialization Error:', error);
        document.getElementById('mainContent').innerHTML = `
            <div class="text-center py-24 text-gray-500">
                <p>Failed to load games data. Please try again later.</p>
                <p class="text-xs mt-2">${error.message}</p>
            </div>
        `;
    }
}

function renderHome() {
    console.log('Rendering Home View');
    const mainContent = document.getElementById('mainContent');
    const template = document.getElementById('homeTemplate');
    if (!template) return;
    
    mainContent.innerHTML = '';
    mainContent.appendChild(template.content.cloneNode(true));

    renderCategories();
    applyFilters();
    if (window.lucide) {
        lucide.createIcons();
    }
}

function renderCategories() {
    const categoryBar = document.getElementById('categoryBar');
    if (!categoryBar) return;

    const categories = ['All', ...new Set(games.map(g => g.category))];
    
    categoryBar.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.className = `px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            selectedCategory === cat
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/20'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
        }`;
        btn.onclick = () => {
            selectedCategory = cat;
            renderHome();
        };
        categoryBar.appendChild(btn);
    });
}

const categoryThemes = {
    'Sports': { 
        bg: 'bg-indigo-500/10', 
        ring: 'ring-indigo-500/20', 
        text: 'text-indigo-400', 
        accent: 'bg-indigo-600',
        border: 'hover:border-indigo-500/30',
        hoverText: 'group-hover:text-indigo-400',
        icon: 'trophy' 
    },
    'Action': { 
        bg: 'bg-rose-500/10', 
        ring: 'ring-rose-500/20', 
        text: 'text-rose-400', 
        accent: 'bg-rose-600',
        border: 'hover:border-rose-500/30',
        hoverText: 'group-hover:text-rose-400',
        icon: 'zap' 
    },
    'Arcade': { 
        bg: 'bg-amber-500/10', 
        ring: 'ring-amber-500/20', 
        text: 'text-amber-400', 
        accent: 'bg-amber-600',
        border: 'hover:border-amber-500/30',
        hoverText: 'group-hover:text-amber-400',
        icon: 'joystick' 
    },
    'Puzzle': { 
        bg: 'bg-emerald-500/10', 
        ring: 'ring-emerald-500/20', 
        text: 'text-emerald-400', 
        accent: 'bg-emerald-600',
        border: 'hover:border-emerald-500/30',
        hoverText: 'group-hover:text-emerald-400',
        icon: 'brain' 
    },
    'Strategy': { 
        bg: 'bg-violet-500/10', 
        ring: 'ring-violet-500/20', 
        text: 'text-violet-400', 
        accent: 'bg-violet-600',
        border: 'hover:border-violet-500/30',
        hoverText: 'group-hover:text-violet-400',
        icon: 'shield' 
    },
    'Default': { 
        bg: 'bg-blue-500/10', 
        ring: 'ring-blue-500/20', 
        text: 'text-blue-400', 
        accent: 'bg-blue-600',
        border: 'hover:border-blue-500/30',
        hoverText: 'group-hover:text-blue-400',
        icon: 'gamepad' 
    }
};

function applyFilters() {
    const container = document.getElementById('categoriesContainer');
    const noResults = document.getElementById('noResults');
    if (!container) return;
    
    container.innerHTML = '';
    
    filteredGames = games.filter(game => {
        const nameMatches = game.name.toLowerCase().includes(searchQuery.toLowerCase());
        const categoryMatches = selectedCategory === 'All' || game.category === selectedCategory;
        return nameMatches && categoryMatches;
    });

    if (filteredGames.length === 0) {
        if (noResults) noResults.classList.remove('hidden');
        return;
    }
    if (noResults) noResults.classList.add('hidden');

    // Grouping
    const groups = {};
    filteredGames.forEach(game => {
        if (!groups[game.category]) groups[game.category] = [];
        groups[game.category].push(game);
    });

    // Rendering rows
    Object.keys(groups).sort().forEach(cat => {
        const theme = categoryThemes[cat] || categoryThemes['Default'];
        const section = document.createElement('section');
        section.className = "animate-in fade-in slide-in-from-bottom-4 duration-500 mb-12";
        
        section.innerHTML = `
            <div class="flex items-center gap-3 mb-8">
                <div class="w-10 h-10 rounded-lg ${theme.bg} flex items-center justify-center ring-1 ${theme.ring}">
                    <i data-lucide="${theme.icon}" class="${theme.text} w-5 h-5"></i>
                </div>
                <h3 class="text-2xl font-bold tracking-tight text-white">${cat}</h3>
                <div class="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <!-- Cards for this category injected here -->
            </div>
        `;
        
        const grid = section.querySelector('.grid');
        groups[cat].forEach(game => {
            grid.appendChild(createGameCard(game, theme));
        });
        
        container.appendChild(section);
    });
    
    if (window.lucide) lucide.createIcons();
}

function createGameCard(game, theme) {
    const div = document.createElement('div');
    div.className = `group relative bg-[#15151a] rounded-2xl overflow-hidden border border-white/5 ${theme.border} transition-all duration-300 cursor-pointer hover:-translate-y-2`;
    div.onclick = () => playLevel(game);

    const thumbnailHtml = game.thumbnail 
        ? `<img src="${game.thumbnail}" alt="${game.name}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />`
        : `<div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0"></div>
           <div class="z-10 flex flex-col items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
               <i data-lucide="play" class="w-12 h-12 text-white fill-white/20 group-hover:scale-110 transition-transform duration-500"></i>
           </div>`;

    div.innerHTML = `
        <div class="aspect-video relative overflow-hidden bg-gray-900 flex items-center justify-center">
            ${thumbnailHtml}
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div class="w-14 h-14 rounded-full ${theme.accent} flex items-center justify-center shadow-2xl">
                    <i data-lucide="play" class="text-white w-6 h-6 fill-white ml-1"></i>
                </div>
            </div>
        </div>
        <div class="p-4 relative">
            <h3 class="font-bold text-gray-100 ${theme.hoverText} transition-colors truncate">
                ${game.name}
            </h3>
            <p class="text-xs text-gray-500 line-clamp-1 mt-1 leading-relaxed">
                ${game.description}
            </p>
        </div>
    `;
    return div;
}

function playLevel(game) {
    console.log('Playing Game:', game.name);
    const mainContent = document.getElementById('mainContent');
    const template = document.getElementById('playerTemplate');
    if (!template) return;

    mainContent.innerHTML = '';
    mainContent.appendChild(template.content.cloneNode(true));

    document.getElementById('gameIframe').src = game.url;
    document.getElementById('playerGameTitle').textContent = game.name;
    document.getElementById('playerGameCategory').textContent = game.category;
    document.getElementById('playerGameDesc').textContent = game.description;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.lucide) lucide.createIcons();
    
    window.currentPlayingGame = game;
}

function showHome() {
    selectedCategory = 'All';
    searchQuery = '';
    renderHome();
    const searchBar = document.getElementById('searchBar');
    if (searchBar) searchBar.value = '';
}

function setupSearch() {
    const searchBar = document.getElementById('searchBar');
    if (!searchBar) return;
    
    searchBar.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (document.getElementById('gameGrid')) {
            applyFilters();
        }
    });
}

function popOut() {
    if (window.currentPlayingGame) {
        window.open(window.currentPlayingGame.url, '_blank');
    }
}

function toggleFullscreen() {
    const iframe = document.getElementById('gameIframe');
    if (!iframe) return;
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
    }
}

document.addEventListener('DOMContentLoaded', init);
window.showHome = showHome;
window.popOut = popOut;
window.toggleFullscreen = toggleFullscreen;
