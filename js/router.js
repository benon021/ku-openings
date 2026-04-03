// js/router.js
// KU Open Tournament // Clean Dynamic Navigator

const routes = {
    '/': 'dashboardHub',
    '/matches': 'matches',
    '/standings': 'standings',
    '/knockouts': 'knockouts',
    '/stats': 'stats',
    '/control': 'control',
    '/team': 'teamStats', // Drill-down IDs
    '/match': 'matchEvents'
};

const router = {
    init: () => {
        window.removeEventListener('hashchange', router.handleHashChange);
        window.addEventListener('hashchange', router.handleHashChange);
        router.handleHashChange(); 
    },

    handleHashChange: () => {
        const hash = window.location.hash.slice(1) || '/';
        const segments = hash.split('/');
        const mainRoute = '/' + (segments[1] ||'');
        
        // Find match or default to Hub
        const sortedRoutes = Object.keys(routes).sort((a,b) => b.length - a.length);
        const mappedRoute = sortedRoutes.find(r => mainRoute.startsWith(r)) || '/';
        const viewFunction = routes[mappedRoute];
        const param = segments[2]; // ID for team or match

        router.updateNav(mappedRoute);
        router.render(viewFunction, param);
    },

    updateNav: (active) => {
        document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
        document.querySelectorAll(`a.nav-link[href="#${active}"]`).forEach(nav => nav.classList.add('active'));
    },

    render: async (view, param) => {
        const content = document.getElementById('app-root');
        if (!content) return;

        // Fast swap without CSS transition trickery (since we use animate-in fade-in anyway)
        try {
            content.innerHTML = await views[view](param);
        } catch (err) {
            console.error("Navigation Fault:", err);
            content.innerHTML = `<div style="text-align:center; padding: 2rem; color:hsl(var(--destructive));">ERROR: CRITICAL_SYSTEM_FAULT // ${view}</div>`;
        }

        window.scrollTo({ top: 0, behavior: 'auto' });
    },

    openLogin: () => {
        const modal = document.getElementById('modal-container');
        const port = document.getElementById('modal-port');
        if (modal && port) {
            port.innerHTML = views.loginForm();
            modal.classList.remove('hidden');
        }
    },

    closeModal: () => {
        const modal = document.getElementById('modal-container');
        if (modal) modal.classList.add('hidden');
    }
};

window.closeModal = router.closeModal;
