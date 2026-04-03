// js/app.js — Main Controller

const globalState = {
    currentCategoryId: 'all',
    currentPitchId: 'all',
    categories: [],
};

// Override native alerts to render custom Premium Toasts globally
window.alert = (message) => {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:10px; pointer-events:none;';
        document.body.appendChild(container);
    }
    
    const msgStr = String(message || '');
    const isError = msgStr.toLowerCase().includes('error') || msgStr.toLowerCase().includes('invalid') || msgStr.toLowerCase().includes('failed');
    const type = isError ? 'error' : 'success';
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        background: rgba(20,20,30,0.95); backdrop-filter: blur(16px); color: #fff;
        padding: 14px 20px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        font-size: 0.9rem; font-weight: 500; font-family: 'Space Grotesk', sans-serif;
        border-left: 4px solid ${type === 'success' ? 'hsl(var(--accent))' : 'hsl(var(--destructive))'};
        transform: translateX(120%); opacity: 0; transition: all 0.4s cubic-bezier(0.1, 0.8, 0.3, 1);
        pointer-events: auto; display:flex; align-items:center; gap:8px; border:1px solid rgba(255,255,255,0.05); border-left-width:4px;
    `;
    
    toast.innerHTML = `
        ${type === 'success' ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--accent))" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>' : 
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--destructive))" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'}
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    requestAnimationFrame(() => requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }));
    
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 4000); // 4 Seconds read time
};

const app = {
    init: async () => {
        app.applyRoundFavicon();
        await app.syncCategories();
        await auth.init();
        router.init();
    },

    applyRoundFavicon: () => {
        const link = document.querySelector("link[rel~='icon']");
        if (!link) return;
        const img = new Image();
        img.crossOrigin = 'anonymous'; 
        img.src = link.href;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 128; // high-res favicon
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            
            // Create a perfect circular mask
            ctx.beginPath();
            ctx.arc(64, 64, 64, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            
            // Draw the original JPEG image inside the masked circle
            ctx.drawImage(img, 0, 0, 128, 128);
            
            // Convert to a transparent PNG data uri and inject as the new favicon!
            link.href = canvas.toDataURL('image/png');
            link.type = 'image/png';
        };
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
            alert('Invalid credentials. Please verify your details.');
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
        const durInput = document.getElementById('m-dur')?.value;
        if (a === b) return alert('Please select two different teams');
        if (!timeInput) return alert('Please select a match time to prevent overlapping');
        const { data: teams } = await api.getTeams('all');
        const teamAObj = teams.find(t => t.id === a);
        
        // Convert hh:mm to a full date just for standard passing
        const today = new Date();
        const [hh, mm] = timeInput.split(':');
        today.setHours(hh, mm, 0, 0);
        
        const res = await api.scheduleMatch({ teamA_id: a, teamB_id: b, pitch: pitch || 'Pitch 1', category_id: teamAObj.category_id, stage, time: today.toISOString(), duration: parseInt(durInput) || 60 });
        if (res.error) return alert(res.error);
        alert('Match scheduled successfully');
        router.handleHashChange();
    },

    openEditMatchModal: async (id) => {
        const { data: matches } = await api.getMatches('all', 'all');
        const match = matches.find(m => m.id === id);
        if(!match) return alert("Match not found");
        
        const html = `
            <div style="text-align:center; margin-bottom:24px">
                <h2 style="font-family:'Outfit',sans-serif; font-size:1.5rem; font-weight:700;">Edit Match</h2>
                <p style="color:hsl(var(--muted-foreground)); font-size:0.9rem">Override posted details</p>
            </div>
            <form onsubmit="event.preventDefault(); app.submitMatchEdit('${id}')">
                <label style="display:block; font-size:0.8rem; margin-bottom:4px">Home Score</label>
                <input class="form-input" type="number" id="edit-m-a" value="${match.scoreA || 0}" required>
                
                <label style="display:block; font-size:0.8rem; margin-bottom:4px">Away Score</label>
                <input class="form-input" type="number" id="edit-m-b" value="${match.scoreB || 0}" required>
                
                <label style="display:block; font-size:0.8rem; margin-bottom:4px">Status</label>
                <select class="form-input" id="edit-m-status">
                    <option value="upcoming" ${match.status === 'upcoming' ? 'selected' : ''}>Upcoming</option>
                    <option value="finished" ${match.status === 'finished' ? 'selected' : ''}>Finished</option>
                </select>
                
                <button type="submit" class="btn-full" style="background:hsl(var(--accent)); margin-top:16px;">Save Changes</button>
            </form>
        `;
        document.getElementById('modal-port').innerHTML = html;
        document.getElementById('modal-container').classList.remove('hidden');
    },

    submitMatchEdit: async (id) => {
        const a = document.getElementById('edit-m-a')?.value;
        const b = document.getElementById('edit-m-b')?.value;
        const status = document.getElementById('edit-m-status')?.value;
        await api.updateMatch(id, { scoreA: parseInt(a), scoreB: parseInt(b), status });
        alert('Match overridden successfully');
        document.getElementById('modal-container').classList.add('hidden');
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

    openEditUserModal: async (email) => {
        const { data: users } = await api.getUsers();
        const user = users.find(u => u.email === email);
        if(!user) return alert("User not found");
        
        const html = `
            <div style="text-align:center; margin-bottom:24px">
                <h2 style="font-family:'Outfit',sans-serif; font-size:1.5rem; font-weight:700;">Edit User</h2>
            </div>
            <form onsubmit="event.preventDefault(); app.submitUserEdit('${email}')">
                <label style="display:block; font-size:0.8rem; margin-bottom:4px">Email</label>
                <input class="form-input" type="text" id="edit-u-email" value="${user.email}" required>
                
                <label style="display:block; font-size:0.8rem; margin-bottom:4px">Password</label>
                <input class="form-input" type="text" id="edit-u-pass" value="${user.password}" required>
                
                <label style="display:block; font-size:0.8rem; margin-bottom:4px">Role</label>
                <select class="form-input" id="edit-u-role">
                    <option value="staff" ${user.role === 'staff' ? 'selected' : ''}>Staff</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
                
                <button type="submit" class="btn-full" style="background:hsl(var(--accent)); margin-top:16px;">Save Changes</button>
            </form>
        `;
        document.getElementById('modal-port').innerHTML = html;
        document.getElementById('modal-container').classList.remove('hidden');
    },

    submitUserEdit: async (oldEmail) => {
        const email = document.getElementById('edit-u-email')?.value;
        const pass = document.getElementById('edit-u-pass')?.value;
        const role = document.getElementById('edit-u-role')?.value;
        await api.updateUser(oldEmail, email, pass, role);
        alert('User updated successfully');
        document.getElementById('modal-container').classList.add('hidden');
        views.setTab(document.querySelector('.pill-badge.active'), 'users');
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
