// js/app.js — Main Controller

const globalState = {
    currentCategoryId: 'all',
    categories: [],
};

const app = {
    init: async () => {
        await app.syncCategories();
        await auth.init();
        router.init();
    },

    syncCategories: async () => {
        const { data } = await api.getCategories();
        if (data) globalState.categories = data;
    },

    setCategory: (id) => {
        globalState.currentCategoryId = id;
        router.handleHashChange(); // Re-render the view with the new category
    },

    // Maps
    openLocation: () => {
        // Fallback or explicit routing logic
        const query = encodeURIComponent("Kenyatta University, Thika Rd, Nairobi");
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    },

    // Auth
    handleLogin: async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-pass').value;
        if (await auth.login(email, pass)) {
            router.closeModal();
            router.handleHashChange();
        } else {
            alert('Invalid credentials. Try staff@ku.knt / 123');
        }
    },

    demoBypass: () => {
        auth.role = 'admin';
        auth.user = { email: 'admin@ku.knt' };
        localStorage.setItem('KU_AUTH', JSON.stringify({ user: auth.user, role: auth.role }));
        auth.updateUI();
        router.closeModal();
        router.handleHashChange();
    },

    // Data submissions
    submitPool: async () => {
        const name = document.getElementById('new-pool-name')?.value;
        const catId = document.getElementById('new-pool-cat')?.value;
        if (!name) return alert('Please enter a pool name');
        await api.createPool({ name, category_id: catId });
        alert('Pool added successfully');
        router.handleHashChange();
    },

    submitTeam: async () => {
        const name = document.getElementById('new-team-name')?.value;
        const poolId = document.getElementById('new-team-pool')?.value;
        if (!name) return alert('Please enter a team name');
        const { data: pools } = await api.getPools('all');
        const selectedPool = pools.find(p => p.id === poolId);
        await api.createTeam({ name, pool_id: poolId, category_id: selectedPool ? selectedPool.category_id : globalState.currentCategoryId });
        alert('Team added successfully');
        router.handleHashChange();
    },

    submitPlayer: async () => {
        const name = document.getElementById('new-play-name')?.value;
        const jersey = document.getElementById('new-play-jersey')?.value;
        const teamId = document.getElementById('new-play-team')?.value;
        if (!name || !jersey) return alert('Please fill all fields');
        await api.addPlayer({ name, jersey, team_id: teamId });
        alert('Player added successfully');
        router.handleHashChange();
    },

    submitMatch: async () => {
        const a = document.getElementById('m-team-a')?.value;
        const b = document.getElementById('m-team-b')?.value;
        const pitch = document.getElementById('m-pitch')?.value;
        const stage = document.getElementById('m-stage')?.value;
        if (a === b) return alert('Please select two different teams');
        const { data: teams } = await api.getTeams('all');
        const teamAObj = teams.find(t => t.id === a);
        await api.scheduleMatch({ teamA_id: a, teamB_id: b, pitch: pitch || 'Pitch 1', category_id: teamAObj.category_id, stage, time: new Date().toISOString() });
        alert('Match scheduled');
        router.handleHashChange();
    },

    submitFinalResult: async () => {
        const id = document.getElementById('m-fin-idx')?.value;
        const a = document.getElementById('m-fin-a')?.value;
        const b = document.getElementById('m-fin-b')?.value;
        if (a === '' || b === '') return alert('Please enter both scores');
        await api.finalizeMatch(id, a, b);
        alert('Result submitted');
        router.handleHashChange();
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
