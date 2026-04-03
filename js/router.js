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
        // Update Active Nav Link
        document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Map the route to the nav ID.
        const path = active.replace('/', '');
        let activeId = 'nav-item-hub';
        let mobileId = 'mobile-nav-item-hub';
        
        if (path === 'matches') { activeId = 'nav-item-matches'; mobileId = 'mobile-nav-item-matches'; }
        if (path === 'standings') { activeId = 'nav-item-standings'; mobileId = 'mobile-nav-item-standings'; }
        if (path === 'knockouts') { activeId = 'nav-item-knockouts'; mobileId = 'mobile-nav-item-knockouts'; }
        if (path === 'stats') { activeId = 'nav-item-stats'; mobileId = 'mobile-nav-item-stats'; }
        if (path === 'control') { activeId = 'nav-item-control'; mobileId = 'mobile-nav-item-control'; }

        const activeEl = document.getElementById(activeId);
        if (activeEl) activeEl.classList.add('active');
        
        const mobileEl = document.getElementById(mobileId);
        if (mobileEl) mobileEl.classList.add('active');
    },

    render: async (view, param) => {
        const content = document.getElementById('app-root');
        if (!content) return;

        // Fast swap without CSS transition trickery (since we use animate-in fade-in anyway)
        try {
            content.innerHTML = await views[view](param);
            if (view === 'dashboardHub') {
                app.initDashboardWidget();
            }
        } catch (err) {
            console.error("Navigation Fault:", err);
            content.innerHTML = `<div style="text-align:center; padding: 4rem 2rem; color:hsl(var(--muted-foreground));"><svg width="48" height="48" style="margin:0 auto 1rem; opacity:0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg><br>Currently organizing fixtures.<br>Check back later.</div>`;
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
