const games = [
  {
    "id": "basketball-stars-2026",
    "name": "Basketball Stars 2026",
    "url": "https://html5.gamedistribution.com/516d6908fbc848bdb89e65a58a43a7dc/?gd_sdk_referrer_url=https://basketballstars2026.io/basketball-stars-2026",
    "category": "Sports",
    "description": "The ultimate basketball game for 2026. Master your shots, block your opponents, and dominate the court.",
    "thumbnail": "https://tcf.admeen.org/game/19500/19230/400x246/basketball-stars-2026.webp"
  },
  {
    "id": "eggy-car",
    "name": "Eggy Car",
    "url": "https://classroom-6x.github.io/eggy-car/",
    "category": "Arcade",
    "description": "Drive a car with an egg on top and try not to break it while over hills and valleys.",
    "thumbnail": "https://i.ytimg.com/vi/U2SgrOeRrrs/maxresdefault.jpg"
  },
  {
    "id": "subway-surfers",
    "name": "Subway Surfers",
    "url": "https://subwaysurferscity.io/subway-surfers-zurich.embed",
    "category": "Action",
    "description": "Dash and dodge as fast as you can through the subway tunnels.",
    "thumbnail": "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/231cb237ab22763a61c2ca0eac6a3760/subway-surfers.png"
  },
  {
    "id": "moto-x3m",
    "name": "Moto X3M",
    "url": "https://classroom-6x.github.io/moto-x3m/",
    "category": "Sports",
    "description": "The best moto racing game with 22 levels, gravity-defying loops, and explosive traps. Perform stunts to shave seconds off your time!",
    "thumbnail": "https://imgs.crazygames.com/moto-x3m_1x1/20231122033955/moto-x3m_1x1-cover?format=auto&quality=100&metadata=none&width=1200"
  },
  {
    "id": "snow-rider-3d",
    "name": "Snow Rider 3D",
    "url": "https://classroom-6x.github.io/snow-rider-3d/",
    "category": "Sports",
    "description": "Experience the thrill of downhill sledding in Snow Rider 3D. Dodge obstacles and collect gifts!",
    "thumbnail": "https://i0.wp.com/diva-magazine.com/wp-content/uploads/2025/11/snow-rider-3d.jpg?fit=640%2C640&ssl=1"
  }
];

let filteredGames = [];
let selectedCategory = 'All';
let searchQuery = '';

console.log('Unblocked Games 81: App Initializing...');

function init() {
    try {
        console.log('Games data ready:', games.length);
        renderHome();
        setupSearch();
    } catch (error) {
        console.error('Initialization Error:', error);
        const content = document.getElementById('mainContent');
        if (content) {
            content.innerHTML = `
                <div class="text-center py-24 text-gray-500">
                    <p>Failed to initialize app correctly.</p>
                    <p class="text-xs mt-2">${error.message}</p>
                </div>
            `;
        }
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
        const theme = categoryThemes[cat] || categoryThemes['Default'];
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.className = `px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
            selectedCategory === cat
              ? `${theme.accent} text-white shadow-lg ring-2 ring-white/20 scale-105`
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
        }`;
        btn.onclick = () => setCategory(cat);
        categoryBar.appendChild(btn);
    });
}

const categoryThemes = {
    'Sports': { 
        bg: 'bg-emerald-500/20', 
        ring: 'ring-emerald-500/40', 
        text: 'text-emerald-400', 
        accent: 'bg-emerald-500',
        border: 'hover:border-emerald-500/50',
        hoverText: 'group-hover:text-emerald-400',
        glow: 'shadow-emerald-500/20',
        icon: 'trophy' 
    },
    'Action': { 
        bg: 'bg-rose-500/20', 
        ring: 'ring-rose-500/40', 
        text: 'text-rose-400', 
        accent: 'bg-rose-500',
        border: 'hover:border-rose-500/50',
        hoverText: 'group-hover:text-rose-400',
        glow: 'shadow-rose-500/20',
        icon: 'zap' 
    },
    'Arcade': { 
        bg: 'bg-amber-500/20', 
        ring: 'ring-amber-500/40', 
        text: 'text-amber-400', 
        accent: 'bg-amber-500',
        border: 'hover:border-amber-500/50',
        hoverText: 'group-hover:text-amber-400',
        glow: 'shadow-amber-500/20',
        icon: 'joystick' 
    },
    'Puzzle': { 
        bg: 'bg-cyan-500/20', 
        ring: 'ring-cyan-500/40', 
        text: 'text-cyan-400', 
        accent: 'bg-cyan-500',
        border: 'hover:border-cyan-500/50',
        hoverText: 'group-hover:text-cyan-400',
        glow: 'shadow-cyan-500/20',
        icon: 'brain' 
    },
    'Strategy': { 
        bg: 'bg-fuchsia-500/20', 
        ring: 'ring-fuchsia-500/40', 
        text: 'text-fuchsia-400', 
        accent: 'bg-fuchsia-500',
        border: 'hover:border-fuchsia-500/50',
        hoverText: 'group-hover:text-fuchsia-400',
        glow: 'shadow-fuchsia-500/20',
        icon: 'shield' 
    },
    'Default': { 
        bg: 'bg-indigo-500/20', 
        ring: 'ring-indigo-500/40', 
        text: 'text-indigo-400', 
        accent: 'bg-indigo-500',
        border: 'hover:border-indigo-500/50',
        hoverText: 'group-hover:text-indigo-400',
        glow: 'shadow-indigo-500/20',
        icon: 'gamepad' 
    }
};

function setCategory(cat) {
    selectedCategory = cat;
    renderHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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
        
        const isFiltered = selectedCategory !== 'All';

        section.innerHTML = `
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg ${theme.bg} flex items-center justify-center ring-1 ${theme.ring}">
                        <i data-lucide="${theme.icon}" class="${theme.text} w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold tracking-tight text-white">${cat}</h3>
                        ${isFiltered ? `<button onclick="setCategory('All')" class="text-xs text-indigo-400 hover:text-white transition-colors flex items-center gap-1 mt-1">
                            <i data-lucide="arrow-left" class="w-3 h-3"></i> Back to all categories
                        </button>` : ''}
                    </div>
                </div>
                ${!isFiltered ? `
                <button onclick="setCategory('${cat}')" class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 group/all">
                    ALL <i data-lucide="chevron-right" class="w-4 h-4 text-gray-500 group-hover/all:text-white transition-colors"></i>
                </button>
                ` : `<div class="h-px flex-1 bg-gradient-to-r from-${theme.text.split('-')[1]}-500/40 to-transparent ml-8"></div>`}
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
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

window.setCategory = setCategory;

function createGameCard(game, theme) {
    const div = document.createElement('div');
    const glowColor = theme.text.split('-')[1];
    div.className = `group relative bg-[#15151a] rounded-xl overflow-hidden border border-white/5 ${theme.border} transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-[0_0_40px_-10px] ${theme.glow}`;
    div.onclick = () => playLevel(game);

    const thumbnailHtml = game.thumbnail 
        ? `<img src="${game.thumbnail}" alt="${game.name}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />`
        : `<div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0"></div>
           <div class="z-10 flex flex-col items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
               <i data-lucide="play" class="w-8 h-8 text-white fill-white/20 group-hover:scale-110 transition-transform duration-500"></i>
           </div>`;

    div.innerHTML = `
        <div class="aspect-video relative overflow-hidden bg-gray-900 flex items-center justify-center">
            ${thumbnailHtml}
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div class="w-10 h-10 rounded-full ${theme.accent} flex items-center justify-center shadow-2xl">
                    <i data-lucide="play" class="text-white w-4 h-4 fill-white ml-0.5"></i>
                </div>
            </div>
        </div>
        <div class="p-3 relative">
            <h3 class="text-xs md:text-sm font-bold text-gray-100 ${theme.hoverText} transition-colors truncate">
                ${game.name}
            </h3>
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
        applyFilters();
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
window.showHome = showHome;
window.popOut = popOut;
window.toggleFullscreen = toggleFullscreen;
window.playLevel = playLevel;
window.setCategory = setCategory;
