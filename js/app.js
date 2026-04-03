// js/app.js — Main Controller

const globalState = {
    currentCategoryId: 'all',
    currentPitchId: 'all',
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

    setPitch: (id) => {
        globalState.currentPitchId = id;
        router.handleHashChange();
    },

    // Maps
    openLocation: () => {
        // Route to maps with destination pre-filled, so user can input their starting location automatically!
        const dest = encodeURIComponent("Kenyatta University, Thika Rd, Nairobi");
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank');
    },

    // Dashboard Live Widget
    initDashboardWidget: async () => {
        // 1. Setup Live Time & Date
        const updateTime = () => {
            const timeEl = document.getElementById('widget-time');
            const dateEl = document.getElementById('widget-date');
            const greetEl = document.getElementById('widget-greeting');
            if (!timeEl) return; // View changed

            const now = new Date();
            let hours = now.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // 12hr format
            const mins = now.getMinutes().toString().padStart(2, '0');
            
            timeEl.innerHTML = `${hours.toString().padStart(2, '0')}:${mins} <span style="font-size:1.5rem; font-weight:600;">${ampm}</span>`;
            
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateEl.textContent = now.toLocaleDateString('en-US', options);

            const hr = now.getHours();
            let greeting = 'Nice evening';
            if (hr < 12) greeting = 'Nice morning';
            else if (hr < 17) greeting = 'Nice afternoon';
            
            const userDisplay = auth.user ? auth.user.email.split('@')[0] : 'Demo';
            if (greetEl) {
                greetEl.innerHTML = `${greeting},<br><span style="text-transform:capitalize">${userDisplay}</span>`;
            }
        };
        updateTime();
        const timer = setInterval(() => {
            if(!document.getElementById('widget-time')) clearInterval(timer);
            else updateTime();
        }, 10000);

        // 2. Fetch Live Weather (Nairobi coords: roughly -1.29, 36.82)
        const fetchWeather = async () => {
            try {
                const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-1.2921&longitude=36.8219&current_weather=true");
                const data = await res.json();
                const w = data.current_weather;
                if (w) {
                    document.getElementById('widget-temp').textContent = `${Math.round(w.temperature)}°C`;
                    
                    // Decode WMO code roughly
                    let condition = 'Clear sky';
                    let icon = '☀️';
                    if (w.weathercode >= 1 && w.weathercode <= 3) { condition = 'Partly cloudy'; icon = '⛅'; }
                    else if (w.weathercode >= 45 && w.weathercode <= 48) { condition = 'Foggy'; icon = '🌫️'; }
                    else if (w.weathercode >= 51 && w.weathercode <= 67) { condition = 'Rain'; icon = '🌧️'; }
                    else if (w.weathercode >= 71 && w.weathercode <= 77) { condition = 'Snow'; icon = '❄️'; }
                    else if (w.weathercode >= 80 && w.weathercode <= 82) { condition = 'Showers'; icon = '🌦️'; }
                    else if (w.weathercode >= 95) { condition = 'Thunderstorm'; icon = '⛈️'; }
                    
                    document.getElementById('widget-condition').textContent = condition;
                    document.getElementById('widget-w-icon').textContent = icon;
                }
            } catch(e) {
                console.error("Weather fetch failed", e);
                const cond = document.getElementById('widget-condition');
                if (cond) cond.textContent = 'Weather unavailable';
            }
        };
        fetchWeather();
        // Setup 30 minute polling interval for actual live weather changes
        const weatherTimer = setInterval(() => {
            if(!document.getElementById('widget-temp')) clearInterval(weatherTimer);
            else fetchWeather();
        }, 1800000); 
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
        alert('Authentication bypassed successfully. Logged in as Admin.');
        router.handleHashChange();
        window.location.reload();
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
        const timeInput = document.getElementById('m-time')?.value;
        if (a === b) return alert('Please select two different teams');
        if (!timeInput) return alert('Please select a match time to prevent overlapping');
        const { data: teams } = await api.getTeams('all');
        const teamAObj = teams.find(t => t.id === a);
        const res = await api.scheduleMatch({ teamA_id: a, teamB_id: b, pitch: pitch || 'Pitch 1', category_id: teamAObj.category_id, stage, time: new Date(timeInput).toISOString() });
        if (res.error) return alert(res.error);
        alert('Match scheduled successfully');
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
    },

    submitTeamStats: async () => {
        const id = document.getElementById('s-team')?.value;
        const stats = {
            p: document.getElementById('s-p')?.value,
            w: document.getElementById('s-w')?.value,
            d: document.getElementById('s-d')?.value,
            l: document.getElementById('s-l')?.value,
            gf: document.getElementById('s-gf')?.value,
            ga: document.getElementById('s-ga')?.value
        };
        const res = await api.updateTeamStats(id, stats);
        if (res.error) return alert(res.error);
        alert('Team stats offset updated successfully');
        router.handleHashChange();
    },

    submitUser: async () => {
        const email = document.getElementById('u-email')?.value;
        const pass = document.getElementById('u-pass')?.value;
        const role = document.getElementById('u-role')?.value;
        if (!email || !pass) return alert('Please fill in both email and password');
        await api.manageStaff(email, pass, role, 'create');
        alert('User registered successfully');
        document.getElementById('u-email').value = '';
        document.getElementById('u-pass').value = '';
        views.setTab(document.querySelector('.pill-badge.active'), 'users'); // refresh view
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
