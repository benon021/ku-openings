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
        img.src = link.href;
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 128;
                canvas.height = 128;
                const ctx = canvas.getContext('2d');
                ctx.beginPath();
                ctx.arc(64, 64, 64, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(img, 0, 0, 128, 128);
                link.href = canvas.toDataURL('image/png');
                link.type = 'image/png';
            } catch (e) { /* Silently skip on file:// protocol */ }
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

    // Maps — In-App Embedded Directions with Fullscreen & Autocomplete
    openLocation: () => {
        const modal = document.getElementById('modal-container');
        const port = document.getElementById('modal-port');
        if (modal && port) {
            port.innerHTML = `
                <div style="text-align:center; margin-bottom:16px">
                    <div style="display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:8px;">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="hsl(var(--primary))" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <h2 style="font-family:'Outfit',sans-serif; font-size:1.3rem; font-weight:700; margin:0;">Venue Directions</h2>
                    </div>
                    <p style="color:hsl(var(--muted-foreground)); font-size:0.85rem; margin:0;">Kenyatta University, Thika Road, Nairobi</p>
                </div>

                <div style="margin-bottom:12px;">
                    <label style="display:block; font-size:0.75rem; color:hsl(var(--muted-foreground)); margin-bottom:6px; text-align:left;">Your Starting Location</label>
                    <div style="display:flex; gap:8px;">
                        <div style="flex:1; position:relative;">
                            <input class="form-input" type="text" id="directions-origin" placeholder="Search a place..." style="margin-bottom:0;" autocomplete="off" oninput="app.searchPlaces(this.value)" onfocus="app.searchPlaces(this.value)">
                            <div id="places-suggestions" class="places-dropdown" style="display:none;"></div>
                        </div>
                        <button onclick="app.detectMyLocation()" title="Use my current location" id="gps-btn"
                            style="background:hsl(var(--muted)); border:1px solid hsl(var(--border)); color:hsl(var(--accent)); padding:8px 12px; border-radius:6px; display:flex; align-items:center; gap:4px; font-size:0.75rem; font-weight:600; white-space:nowrap;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line></svg>
                            GPS
                        </button>
                    </div>
                </div>

                <div style="display:flex; gap:8px; margin-bottom:12px;">
                    <button onclick="app.startNavigation()" id="start-nav-btn" style="flex:1; background:hsl(var(--accent)); color:#fff; padding:10px; border-radius:8px; font-weight:600; font-size:0.85rem; display:flex; align-items:center; justify-content:center; gap:6px;">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        Start
                    </button>
                    <button onclick="app.toggleMapFullscreen()" id="fullscreen-btn" title="Fullscreen"
                        style="background:hsl(var(--muted)); border:1px solid hsl(var(--border)); color:hsl(var(--foreground)); padding:10px 14px; border-radius:8px; display:flex; align-items:center; justify-content:center;">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                    </button>
                </div>

                <!-- Live Navigation Status Bar (hidden until started) -->
                <div id="nav-status-bar" style="display:none; background:rgba(168,230,207,0.1); border:1px solid hsl(var(--accent)/0.3); border-radius:10px; padding:10px 14px; margin-bottom:12px; display:none;">
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <div id="nav-pulse" style="width:10px; height:10px; border-radius:50%; background:hsl(var(--accent)); animation: pulse-dot 1.5s infinite;"></div>
                            <span style="font-size:0.8rem; font-weight:600; color:hsl(var(--accent));">Navigating...</span>
                        </div>
                        <div style="display:flex; gap:16px; align-items:center;">
                            <div style="text-align:center;">
                                <div id="nav-distance" style="font-size:0.95rem; font-weight:700; color:hsl(var(--foreground));">--</div>
                                <div style="font-size:0.6rem; color:hsl(var(--muted-foreground)); text-transform:uppercase;">Distance</div>
                            </div>
                            <div style="text-align:center;">
                                <div id="nav-eta" style="font-size:0.95rem; font-weight:700; color:hsl(var(--foreground));">--</div>
                                <div style="font-size:0.6rem; color:hsl(var(--muted-foreground)); text-transform:uppercase;">ETA</div>
                            </div>
                            <button onclick="app.stopNavigation()" style="background:hsl(var(--destructive)); color:#fff; padding:6px 12px; border-radius:6px; font-size:0.75rem; font-weight:600;">
                                Stop
                            </button>
                        </div>
                    </div>
                </div>

                <div id="directions-map" style="border-radius:12px; overflow:hidden; border:1px solid hsl(var(--border)); aspect-ratio:4/3;">
                    <iframe id="directions-iframe"
                        src="https://www.google.com/maps?q=-1.181056,36.927234&z=16&output=embed"
                        width="100%" height="100%" style="border:0; display:block;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>

                <div style="margin-top:12px; display:flex; gap:8px;">
                    <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=Kenyatta+University,Thika+Rd,Nairobi&origin=' + encodeURIComponent(document.getElementById('directions-origin').value || ''), '_blank')" 
                        style="flex:1; background:hsl(var(--muted)); border:1px solid hsl(var(--border)); color:hsl(var(--foreground)); padding:10px; border-radius:8px; font-weight:600; font-size:0.8rem; display:flex; align-items:center; justify-content:center; gap:6px;">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        Open in Google Maps
                    </button>
                </div>
            `;
            modal.classList.remove('hidden');
            document.addEventListener('click', (e) => {
                const dd = document.getElementById('places-suggestions');
                if (dd && !e.target.closest('#directions-origin') && !e.target.closest('#places-suggestions')) dd.style.display = 'none';
            });
        }
    },

    _searchTimeout: null,
    searchPlaces: (query) => {
        const dd = document.getElementById('places-suggestions');
        if (!dd) return;
        clearTimeout(app._searchTimeout);
        if (!query || query.length < 2) { dd.style.display = 'none'; return; }
        app._searchTimeout = setTimeout(async () => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ke&limit=5&addressdetails=1`);
                const data = await res.json();
                if (data && data.length > 0) {
                    dd.innerHTML = data.map(r => {
                        const addr = r.display_name.replace(/'/g, "\\'");
                        return `<div class="places-dropdown-item" onclick="app.selectPlace('${addr}')">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span>${r.display_name}</span>
                        </div>`;
                    }).join('');
                    dd.style.display = 'block';
                } else { dd.style.display = 'none'; }
            } catch { dd.style.display = 'none'; }
        }, 400);
    },

    selectPlace: (address) => {
        const input = document.getElementById('directions-origin');
        const dd = document.getElementById('places-suggestions');
        if (input) input.value = address;
        if (dd) dd.style.display = 'none';
    },

    detectMyLocation: () => {
        const input = document.getElementById('directions-origin');
        const gpsBtn = document.getElementById('gps-btn');
        if (!navigator.geolocation) { alert('Geolocation is not supported by your browser'); return; }
        if (input) input.value = 'Detecting location...';
        if (gpsBtn) { gpsBtn.style.color = 'hsl(var(--primary))'; gpsBtn.style.borderColor = 'hsl(var(--primary))'; }
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude.toFixed(6);
                const lng = pos.coords.longitude.toFixed(6);
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const data = await res.json();
                    if (data && data.display_name) { if (input) input.value = data.display_name; }
                    else { if (input) input.value = `${lat},${lng}`; }
                } catch { if (input) input.value = `${lat},${lng}`; }
                if (gpsBtn) { gpsBtn.style.color = 'hsl(var(--accent))'; gpsBtn.style.borderColor = 'hsl(var(--border))'; }
            },
            () => {
                if (input) input.value = '';
                if (gpsBtn) { gpsBtn.style.color = 'hsl(var(--accent))'; gpsBtn.style.borderColor = 'hsl(var(--border))'; }
                alert('Could not detect your location. Please type it manually.');
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    },

    // Live Navigation System
    _navWatchId: null,
    _navInterval: null,
    _KU_LAT: -1.181056,
    _KU_LNG: 36.927234,

    _showRoute: (origin) => {
        const iframe = document.getElementById('directions-iframe');
        if (iframe) {
            iframe.src = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=Kenyatta+University,Nairobi,Kenya&travelmode=driving&output=embed`;
        }
    },

    startNavigation: () => {
        const btn = document.getElementById('start-nav-btn');
        const statusBar = document.getElementById('nav-status-bar');
        const input = document.getElementById('directions-origin');
        const typedOrigin = input?.value?.trim();

        // Show loading state
        if (btn) {
            btn.style.background = 'hsl(var(--muted))';
            btn.style.color = 'hsl(var(--muted-foreground))';
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg> Locating...`;
        }

        const onGPSSuccess = (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            if (input) input.value = `${lat.toFixed(6)},${lng.toFixed(6)}`;
            app._showRoute(`${lat},${lng}`);

            // Show status bar & hide start button
            if (statusBar) statusBar.style.display = 'block';
            if (btn) btn.style.display = 'none';

            app._updateNavInfo(lat, lng);

            // Start live tracking
            app._navWatchId = navigator.geolocation.watchPosition(
                (p) => app._updateNavInfo(p.coords.latitude, p.coords.longitude),
                () => {},
                { enableHighAccuracy: true, maximumAge: 5000, timeout: 30000 }
            );

            // Refresh map route every 30 seconds
            app._navInterval = setInterval(() => {
                navigator.geolocation.getCurrentPosition((p) => {
                    app._showRoute(`${p.coords.latitude},${p.coords.longitude}`);
                }, () => {}, { enableHighAccuracy: true });
            }, 30000);
        };

        const onGPSFail = () => {
            // Fallback: use typed location if available
            if (typedOrigin) {
                app._showRoute(typedOrigin);
                if (statusBar) statusBar.style.display = 'block';
                if (btn) btn.style.display = 'none';

                // Show estimated info (can't track without GPS but can show route)
                const distEl = document.getElementById('nav-distance');
                const etaEl = document.getElementById('nav-eta');
                if (distEl) distEl.textContent = '—';
                if (etaEl) etaEl.textContent = '—';

                // Change status text
                const navPulse = document.getElementById('nav-pulse');
                if (navPulse) navPulse.style.background = 'hsl(var(--primary))';
            } else {
                alert('Please enter your starting location or enable GPS');
                if (btn) {
                    btn.style.display = 'flex';
                    btn.style.background = 'hsl(var(--accent))';
                    btn.style.color = '#fff';
                    btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Start`;
                }
            }
        };

        // Try GPS first, fallback to typed location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onGPSSuccess, onGPSFail, 
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
        } else {
            onGPSFail();
        }
    },

    stopNavigation: () => {
        if (app._navWatchId !== null) {
            navigator.geolocation.clearWatch(app._navWatchId);
            app._navWatchId = null;
        }
        if (app._navInterval) {
            clearInterval(app._navInterval);
            app._navInterval = null;
        }

        const btn = document.getElementById('start-nav-btn');
        const statusBar = document.getElementById('nav-status-bar');
        const iframe = document.getElementById('directions-iframe');

        if (btn) {
            btn.style.display = 'flex';
            btn.style.background = 'hsl(var(--accent))';
            btn.style.color = '#fff';
            btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Start`;
        }
        if (statusBar) statusBar.style.display = 'none';
        if (iframe) iframe.src = `https://www.google.com/maps?q=-1.181056,36.927234&z=16&output=embed`;
    },

    _updateNavInfo: (lat, lng) => {
        // Haversine formula for distance
        const R = 6371;
        const dLat = (app._KU_LAT - lat) * Math.PI / 180;
        const dLng = (app._KU_LNG - lng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat * Math.PI / 180) * Math.cos(app._KU_LAT * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distKm = R * c;
        
        // ETA based on ~30 km/h average city driving speed
        const etaMinutes = Math.round((distKm / 30) * 60);
        
        const distEl = document.getElementById('nav-distance');
        const etaEl = document.getElementById('nav-eta');
        
        if (distEl) distEl.textContent = distKm < 1 ? `${Math.round(distKm * 1000)}m` : `${distKm.toFixed(1)}km`;
        if (etaEl) etaEl.textContent = etaMinutes < 1 ? 'Arrived!' : (etaMinutes < 60 ? `${etaMinutes} min` : `${Math.floor(etaMinutes/60)}h ${etaMinutes%60}m`);
    },

    toggleMapFullscreen: () => {
        const mc = document.querySelector('.modal-content');
        const btn = document.getElementById('fullscreen-btn');
        if (!mc) return;
        mc.classList.toggle('map-fullscreen');
        const isFS = mc.classList.contains('map-fullscreen');
        if (btn) btn.innerHTML = isFS
            ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>'
            : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>';
    },

    // Dashboard Live Widget
    initDashboardWidget: async () => {
        // 1. Setup Live Time & Date
        const updateTime = () => {
            const timeEl = document.getElementById('widget-time');
            const dateEl = document.getElementById('widget-date');
            if (!timeEl && !dateEl) return; 

            const now = new Date();
            let hours = now.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            const minutes = String(now.getMinutes()).padStart(2, '0');
            
            if (timeEl) timeEl.innerHTML = `${hours}:${minutes} <span style="font-size:1.2rem; opacity:0.6; font-weight:600;">${ampm}</span>`;
            if (dateEl) {
                const day = now.toLocaleDateString('en-US', { weekday: 'long' });
                const month = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
                dateEl.textContent = `${day}, ${month}`;
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
                    const tempEl = document.getElementById('widget-temp');
                    const condEl = document.getElementById('widget-condition');
                    const iconEl = document.getElementById('widget-w-icon');

                    if (tempEl) tempEl.textContent = `${Math.round(w.temperature)}°C`;
                    
                    let condition = 'Clear sky';
                    let icon = '☀️';
                    if (w.weathercode >= 1 && w.weathercode <= 3) { condition = 'Partly cloudy'; icon = '⛅'; }
                    else if (w.weathercode >= 45 && w.weathercode <= 48) { condition = 'Foggy'; icon = '🌫️'; }
                    else if (w.weathercode >= 51 && w.weathercode <= 67) { condition = 'Rain'; icon = '🌧️'; }
                    else if (w.weathercode >= 71 && w.weathercode <= 77) { condition = 'Snow'; icon = '❄️'; }
                    else if (w.weathercode >= 80 && w.weathercode <= 82) { condition = 'Showers'; icon = '🌦️'; }
                    else if (w.weathercode >= 95) { condition = 'Thunderstorm'; icon = '⛈️'; }
                    
                    if (condEl) condEl.textContent = condition;
                    if (iconEl) iconEl.textContent = icon;
                }
            } catch(e) {
                const condEl = document.getElementById('widget-condition');
                if (condEl) condEl.textContent = 'Weather Unavailable';
            }
        };
        fetchWeather();
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
        const res = await auth.login(email, pass);
        if (res) {
            router.closeModal();
            if (res.role === 'team' && res.teamId) {
                window.location.hash = `#/team/${res.teamId}`;
            } else {
                router.handleHashChange();
            }
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
                <h2 style="font-family:'Outfit',sans-serif; font-size:1.5rem; font-weight:700;">Update Match</h2>
                <p style="color:hsl(var(--muted-foreground)); font-size:0.9rem">${match.teamA?.name} vs ${match.teamB?.name}</p>
            </div>
            <form onsubmit="event.preventDefault(); app.submitMatchEdit('${id}')">
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:12px;">
                    <div>
                        <label style="display:block; font-size:0.8rem; margin-bottom:4px">Home Score</label>
                        <input class="form-input" type="number" id="edit-m-a" value="${match.scoreA || 0}" required>
                    </div>
                    <div>
                        <label style="display:block; font-size:0.8rem; margin-bottom:4px">Away Score</label>
                        <input class="form-input" type="number" id="edit-m-b" value="${match.scoreB || 0}" required>
                    </div>
                </div>
                
                <div style="margin-bottom:12px;">
                    <label style="display:block; font-size:0.8rem; margin-bottom:4px">Match Status</label>
                    <select class="form-input" id="edit-m-status">
                        <option value="upcoming" ${match.status === 'upcoming' ? 'selected' : ''}>Upcoming</option>
                        <option value="live" ${match.status === 'live' ? 'selected' : ''}>Live</option>
                        <option value="finished" ${match.status === 'finished' ? 'selected' : ''}>Finished (FT)</option>
                    </select>
                </div>

                <div style="margin-bottom:12px;">
                    <label style="display:block; font-size:0.8rem; margin-bottom:4px; color:hsl(var(--primary))">Delay Shift (Minutes)</label>
                    <input class="form-input" type="number" id="edit-m-delay" value="0" placeholder="Shifts this and all following games">
                </div>
                
                <button type="submit" class="btn-full" style="background:hsl(var(--primary)); color:#000; font-weight:700; margin-top:16px; height:48px; font-size:1rem; border:none; box-shadow:0 10px 20px hsl(var(--primary)/0.2);">SAVE CHANGES</button>
            </form>
        `;
        document.getElementById('modal-port').innerHTML = html;
        document.getElementById('modal-container').classList.remove('hidden');
    },

    startMatch: async (id) => {
        if(!confirm('Start this match and move it to "Now Playing"?')) return;
        await api.updateMatch(id, { status: 'live', current_quarter: '1st Quarter' });
        router.handleHashChange();
    },

    submitMatchEdit: async (id) => {
        const a = document.getElementById('edit-m-a')?.value;
        const b = document.getElementById('edit-m-b')?.value;
        const status = document.getElementById('edit-m-status')?.value;
        const delay = document.getElementById('edit-m-delay')?.value;
        
        if (delay && parseInt(delay) !== 0) {
            await api.delayMatch(id, delay);
        }

        if (status === 'finished') {
            await api.finalizeMatch(id, a, b);
        } else {
            await api.updateMatch(id, { 
                scoreA: parseInt(a), 
                scoreB: parseInt(b), 
                status
            });
        }
        
        alert('Match updated');
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
        views.setTab(document.querySelector('.pill-badge.active'), 'users'); 
    },

    submitPlayerToRoster: async (teamId) => {
        const name = document.getElementById('new-p-name')?.value;
        const jersey = document.getElementById('new-p-jersey')?.value;
        if (!name || !jersey) return alert('Please enter both name and jersey number');
        await api.addPlayer({ name, jersey, team_id: teamId });
        alert('Player added to roster');
        router.handleHashChange();
    },

    deletePlayerFromRoster: async (playerId, teamId) => {
        if (!confirm('Are you sure you want to remove this player from the roster?')) return;
        await api.deletePlayer(playerId);
        alert('Player removed from roster');
        router.handleHashChange();
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
