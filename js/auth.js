// js/auth.js — Simple Auth Manager

const auth = {
    user: null,
    role: 'viewer',

    init: async () => {
        const saved = localStorage.getItem('KU_AUTH');
        if (saved) {
            const data = JSON.parse(saved);
            auth.user = data.user;
            auth.role = data.role;
        }
        auth.updateUI();
    },

    login: async (email, pass) => {
        const staff = MOCK_DATA.users.find(u => u.email === email && u.password === pass);
        if (staff) {
            auth.user = { email: staff.email };
            auth.role = staff.role;
            localStorage.setItem('KU_AUTH', JSON.stringify({ user: auth.user, role: auth.role }));
            auth.updateUI();
            return true;
        }
        return false;
    },

    logout: () => {
        auth.user = null;
        auth.role = 'viewer';
        localStorage.removeItem('KU_AUTH');
        auth.updateUI();
        window.location.hash = '#/';
    },

    updateUI: () => {
        const status = document.getElementById('auth-status');
        const controlNavs = document.querySelectorAll('#nav-item-control, #mobile-nav-item-control');

        if (auth.role !== 'viewer') {
            if(status) {
                status.innerHTML = `
                <div style="display:flex;align-items:center;gap:12px">
                    <span style="font-size:0.8rem; background:hsl(var(--accent)/0.2); color:hsl(var(--accent)); padding:4px 8px; border-radius:12px; font-weight:600">${auth.role.toUpperCase()}</span>
                    <button onclick="auth.logout()" style="color:hsl(var(--destructive)); display:flex; align-items:center; gap:4px; font-weight:600; font-size:0.85rem;" title="Logout">
                        Logout <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    </button>
                </div>`;
            }
            controlNavs.forEach(nav => nav.classList.remove('hidden'));
        } else {
            if(status) {
                status.innerHTML = `
                <button onclick="router.openLogin()" class="login-btn">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                    Login
                </button>`;
            }
            controlNavs.forEach(nav => nav.classList.add('hidden'));
        }
    }
};
