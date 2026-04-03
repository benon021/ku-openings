// js/views.js — Clean Replica Dashboard Views

const views = {

    // ─── HUB (Home) ───
    dashboardHub: async () => {
        const catId = globalState.currentCategoryId;
        const pitchId = globalState.currentPitchId;
        const { data: matches } = await api.getMatches(catId, pitchId);
        const upcoming = matches.filter(m => m.status === 'upcoming').slice(0, 3);
        const finished = matches.filter(m => m.status === 'finished').slice(-3).reverse();

        return `
            <div class="view-enter animate-in fade-in zoom-in-95" style="animation-duration:0.3s">
                <style>
                    .hero-layout-grid {
                        display: grid;
                        grid-template-columns: 1.2fr auto 1fr;
                        gap: 1.5rem;
                        align-items: stretch;
                        text-align: left;
                    }
                    .hero-grid-title { justify-self: start; }
                    .hero-grid-logo { justify-self: center; align-self: center; }
                    .hero-grid-weather { justify-self: end; text-align: right; }
                    
                    @media (max-width: 768px) {
                        .hero-layout-grid {
                            grid-template-columns: 1fr 1fr;
                            grid-template-rows: auto auto;
                            align-items: center;
                        }
                        .hero-grid-title {
                            grid-column: 1 / span 2;
                        }
                        .hero-grid-logo {
                            grid-column: 1;
                            justify-self: start;
                        }
                        .hero-grid-weather {
                            grid-column: 2;
                            justify-self: end;
                        }
                    }
                </style>
                <div class="card hero-gradient" style="margin-bottom: 1.5rem; padding: clamp(1rem, 3vw, 2rem); border-color: hsl(var(--border));">
                    <div class="hero-layout-grid">
                        
                        <!-- Left Layout: Radiant Title and Time -->
                        <div class="hero-grid-title" style="display:flex; flex-direction:column; justify-content:space-between; height: 100%;">
                            <div>
                                <h1 class="text-gradient" style="font-size:clamp(1.5rem, 4vw, 2.2rem); line-height:1.15; margin-bottom:0.25rem; font-weight:800; font-family:'Outfit',sans-serif;">WELCOME TO KENYATTA UNIVERSITY OPEN TOURNAMENT 2026</h1>
                                <div style="color:hsl(var(--muted-foreground)); font-size: clamp(0.75rem, 2vw, 0.9rem); margin-bottom: 1rem;">Tournament Management Edition</div>
                            </div>
                            
                            <div style="margin-top:auto;">
                                <div style="font-size:clamp(1.5rem, 5vw, 3rem); font-weight:800; font-family:'Outfit',sans-serif; line-height:1; display:flex; align-items:baseline; gap:4px;" id="widget-time">
                                    --:-- <span style="font-size:clamp(0.8rem, 2vw, 1.2rem); font-weight:600;">--</span>
                                </div>
                            </div>
                        </div>

                        <!-- Center Layout: Round Logo -->
                        <div class="hero-grid-logo">
                            <div class="wave-beacon">
                                <img src="assets/logo.jpeg" alt="Vultures Team Logo" style="width:clamp(120px, 20vw, 220px); height:clamp(120px, 20vw, 220px); border-radius:50%; object-fit:cover; border:none; box-shadow:0 10px 40px rgba(0,0,0,0.6), 0 0 20px hsl(var(--primary)/0.2); background:#000;">
                            </div>
                        </div>

                        <!-- Right Layout: Weather and Maps -->
                        <div class="hero-grid-weather" style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
                            <div style="display:flex; align-items:center; gap:8px; justify-content:flex-end;">
                                <div id="widget-w-icon" style="font-size:clamp(1.5rem, 4vw, 2.5rem);">⛅</div>
                                <div style="font-size:clamp(1.5rem, 5vw, 3rem); font-weight:800; font-family:'Outfit',sans-serif;" id="widget-temp">--°C</div>
                            </div>
                            <div style="margin-top: 0.5rem;">
                                <div style="font-size:clamp(0.8rem, 2vw, 1rem); margin-bottom:2px; color:hsl(var(--foreground))" id="widget-condition">Loading...</div>
                                <div style="font-size:clamp(0.8rem, 2vw, 1rem); font-weight:600; margin-bottom:2px;">Nairobi</div>
                                <div style="color:hsl(var(--muted-foreground)); font-size:clamp(0.65rem, 2vw, 0.8rem);" id="widget-date">Loading date...</div>
                            </div>
                            <div style="margin-top: 1rem;">
                                 <button class="pill-badge" style="background:hsl(var(--primary)); color:#fff; border:none; padding: 6px 12px; font-size:0.75rem; box-shadow:0 0 10px hsl(var(--primary)/0.4); display:flex; align-items:center; gap:4px;" onclick="app.openLocation()">
                                     <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                     Directions
                                 </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                    <h3 style="font-size:1.1rem; font-family:'Outfit',sans-serif; margin:0;">Live Feed</h3>
                    ${views.pitchDropdown()}
                </div>
                <div class="grid-cards">
                    <div class="card card-gradient">
                        <div class="section-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            Upcoming Fixtures
                        </div>
                        ${upcoming.length ? upcoming.map(m => `
                            <a href="#/match/${m.id}" style="display:block; padding: 12px 0; border-bottom: 1px solid hsl(var(--border));">
                                <div style="display:flex; justify-content:space-between; margin-bottom: 4px; font-size:0.8rem; color:hsl(var(--muted-foreground))">
                                    <span>${m.pitch}</span>
                                    <span>Upcoming${m.stage && m.stage !== 'pool' ? ' (' + m.stage.toUpperCase() + ')' : ''}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; align-items:center; font-weight:600; font-size:0.9rem;">
                                    <span>${m.teamA?.name || 'TBA'}</span>
                                    <span style="color:hsl(var(--muted-foreground))">vs</span>
                                    <span>${m.teamB?.name || 'TBA'}</span>
                                </div>
                            </a>
                        `).join('') : '<div style="color:hsl(var(--muted-foreground));font-size:0.9rem;padding:12px 0;">No upcoming fixtures</div>'}
                        <div style="margin-top: 1rem;">
                            <a href="#/matches" style="color: hsl(var(--primary)); font-size:0.9rem; display:inline-flex; align-items:center; gap:4px">View all fixtures &rarr;</a>
                        </div>
                    </div>

                    <div class="card card-gradient">
                        <div class="section-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--sport-gold))" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                            Recent Results
                        </div>
                        ${finished.length ? finished.map(m => `
                            <a href="#/match/${m.id}" style="display:block; padding: 12px 0; border-bottom: 1px solid hsl(var(--border));">
                                <div style="display:flex; justify-content:space-between; margin-bottom: 4px; font-size:0.8rem; color:hsl(var(--muted-foreground))">
                                    <span>${m.pitch}</span>
                                    <span style="color:hsl(var(--accent))">FT${m.stage && m.stage !== 'pool' ? ' (' + m.stage.toUpperCase() + ')' : ''}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; align-items:center; font-weight:600; font-size:0.9rem;">
                                    <span>${m.teamA?.name || 'TBA'}</span>
                                    <span style="color:hsl(var(--primary))">${m.scoreA} - ${m.scoreB}</span>
                                    <span>${m.teamB?.name || 'TBA'}</span>
                                </div>
                            </a>
                        `).join('') : '<div style="color:hsl(var(--muted-foreground));font-size:0.9rem;padding:12px 0;">No results yet</div>'}
                    </div>
                </div>
            </div>`;
    },

    // ─── STANDINGS ───
    standings: async () => {
        const catId = globalState.currentCategoryId;
        const { data: pools } = await api.getPools(catId);

        let html = `
            <div class="view-enter">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                    <div class="section-title" style="margin:0; color:hsl(var(--primary))">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
                        Pool Standings
                    </div>
                    ${views.categoryDropdown()}
                </div>
                <div class="grid-cards" style="grid-template-columns: 1fr;"> <!-- Full width for Premier League tables -->
        `;

        if (!pools.length) {
            html += '<div style="color:hsl(var(--muted-foreground));">No pools found.</div>';
        }

        for (const pool of pools) {
            const { data: std } = await api.getStandings(pool.id);
            const categoryName = pool.category_id === 'cat-m' ? 'Mens' : 'Ladies';
            html += `
                <div class="card card-gradient" style="padding:0; overflow-x:hidden;">
                    <div style="padding:1rem 1rem 0.5rem 1rem">
                        <h3 style="font-size:1.1rem; font-weight:600; font-family:'Space Grotesk',sans-serif">Pool ${(pool.name || 'Unnamed').toUpperCase()} <span style="color:hsl(var(--muted-foreground));font-weight:400;font-size:0.9rem;">(${categoryName})</span></h3>
                    </div>
                    <style>
                        .table-compact { width:100%; border-collapse:collapse; font-size:0.8rem; font-family:'Space Grotesk',sans-serif; }
                        .table-compact th { text-transform:uppercase; font-size:0.65rem; padding:0.4rem 0.2rem; border-bottom: 1px solid hsl(var(--border)); color:hsl(var(--muted-foreground)); }
                        .table-compact td { padding:0.6rem 0.2rem; }
                        .tr-hover { border-bottom: 1px solid hsl(var(--border)/0.5); cursor:pointer; transition: background 0.2s ease; }
                        .tr-hover:hover { background: rgba(255,255,255,0.04); }
                    </style>
                    <table class="table-compact">
                        <thead>
                            <tr>
                                <th style="text-align:center; width:30px;">#</th>
                                <th style="text-align:left;">Team</th>
                                <th style="text-align:center;">P</th>
                                <th style="text-align:center;">W</th>
                                <th style="text-align:center;">D</th>
                                <th style="text-align:center;">L</th>
                                <th style="text-align:center; color:hsl(var(--foreground));">GF</th>
                                <th style="text-align:center; color:hsl(var(--foreground));">GA</th>
                                <th style="text-align:center; color:hsl(var(--foreground));">GD</th>
                                <th style="text-align:right; padding-right:1rem;">Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(std || []).map((s, i) => {
                                const isTop = s.position <= 2;
                                const isBottom = s.position >= Math.max(3, (std || []).length - 1);
                                const posColor = isTop ? 'color:hsl(var(--accent));font-weight:700;' : (isBottom ? 'color:hsl(var(--destructive));' : 'color:hsl(var(--muted-foreground));');
                                return `
                                <tr class="tr-hover">
                                    <td style="text-align:center; font-size:0.75rem; ${posColor}">${s.position || i+1}</td>
                                    <td style="font-weight:600; font-size:0.8rem; color:${isTop ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'}">${(s.name || 'Unknown').toUpperCase()}</td>
                                    <td style="text-align:center; opacity:0.6;">${s.p || 0}</td>
                                    <td style="text-align:center;">${s.w || 0}</td>
                                    <td style="text-align:center;">${s.d || 0}</td>
                                    <td style="text-align:center; color:hsl(var(--destructive))">${s.l || 0}</td>
                                    <td style="text-align:center; color:hsl(var(--accent))">${s.gf || 0}</td>
                                    <td style="text-align:center; opacity:0.6;">${s.ga || 0}</td>
                                    <td style="text-align:center; font-weight:600; color:${(s.gd || 0) > 0 ? 'hsl(var(--accent))' : ((s.gd || 0) < 0 ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))')}">${(s.gd || 0) > 0 ? '+'+s.gd : (s.gd || 0)}</td>
                                    <td style="text-align:right; font-weight:750; font-size:0.9rem; padding-right:1rem; color:hsl(var(--primary))">${s.pts || 0}</td>
                                </tr>
                            `}).join('')}
                        </tbody>
                    </table>
                </div>`;
        }
        return html + '</div></div>';
    },

    // ─── KNOCKOUTS ───
    knockouts: async () => {
        const catId = globalState.currentCategoryId;
        const pitchId = globalState.currentPitchId;
        const { data: matches } = await api.getMatches(catId, pitchId);

        const qf = matches.filter(m => m.stage === 'qf');
        const sf = matches.filter(m => m.stage === 'sf');
        const f = matches.filter(m => m.stage === 'f');

        const renderStage = (title, list) => `
            <h3 style="font-size: 1.1rem; border-bottom:1px solid hsl(var(--border)); padding-bottom:0.5rem; margin-bottom: 1rem; margin-top:2rem;">${title}</h3>
            ${list.length ? `<div class="grid-cards">` + list.map(m => `
                <a href="#/match/${m.id}" class="card card-gradient" style="display:block">
                    <div style="display:flex; justify-content:space-between; margin-bottom: 12px;">
                        <span style="font-size:0.8rem; padding: 2px 8px; border-radius:12px; background: ${m.status === 'finished' ? 'hsl(var(--accent)/0.2)' : 'hsl(var(--primary)/0.2)'}; color:${m.status === 'finished' ? 'hsl(var(--accent))' : 'hsl(var(--primary))'}">${m.status.toUpperCase()}</span>
                        <span style="font-size:0.8rem; color:hsl(var(--muted-foreground))">${m.pitch}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; font-weight:600;">
                        <span style="width:40%; text-align:left;">${m.teamA?.name || 'TBA'}</span>
                        <span style="font-size:1.25rem; color:${m.status === 'finished' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}">${m.status === 'finished' ? m.scoreA + ' - ' + m.scoreB : 'vs'}</span>
                        <span style="width:40%; text-align:right;">${m.teamB?.name || 'TBA'}</span>
                    </div>
                </a>
            `).join('') + `</div>` : '<div style="color:hsl(var(--muted-foreground)); font-size:0.9rem">No matches scheduled for this stage</div>'}
        `;

        return `
            <div class="view-enter">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                    <div class="section-title" style="margin:0;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"></path><path d="M13 19l6-6"></path><path d="M16 16l4 4"></path><path d="M19 21l2-2"></path></svg> Knockout Bracket</div>
                    <div style="display:flex; gap:8px;">${views.pitchDropdown()} ${views.categoryDropdown()}</div>
                </div>
                ${renderStage('Quarter Finals', qf)}
                ${renderStage('Semi Finals', sf)}
                ${renderStage('Finals', f)}
            </div>
        `;
    },

    // ─── MATCHES (Fixtures) ───
    matches: async () => {
        const catId = globalState.currentCategoryId;
        const pitchId = globalState.currentPitchId;
        const { data: matches } = await api.getMatches(catId, pitchId);
        const upcoming = matches.filter(m => m.status === 'upcoming');
        const finished = matches.filter(m => m.status === 'finished');

        const renderList = (list) => list.length ? `<div class="grid-cards">` + list.map(m => `
            <a href="#/match/${m.id}" class="card card-gradient" style="display:block">
                <div style="display:flex; justify-content:space-between; margin-bottom: 12px;">
                    <span style="font-size:0.8rem; padding: 2px 8px; border-radius:12px; background: ${m.status === 'finished' ? 'hsl(var(--accent)/0.2)' : 'hsl(var(--primary)/0.2)'}; color:${m.status === 'finished' ? 'hsl(var(--accent))' : 'hsl(var(--primary))'}">${m.status.toUpperCase()}</span>
                    <span style="font-size:0.8rem; color:hsl(var(--muted-foreground))">${m.pitch} ${m.stage && m.stage !== 'pool' ? ' • ' + m.stage.toUpperCase() : ''}</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; font-weight:600; position:relative;">
                    <span style="width:40%; text-align:left;">${m.teamA?.name || 'TBA'}</span>
                    <span style="font-size:1.25rem; color:${m.status === 'finished' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}">${m.status === 'finished' ? m.scoreA + ' - ' + m.scoreB : 'vs'}</span>
                    <span style="width:40%; text-align:right;">${m.teamB?.name || 'TBA'}</span>
                    ${auth.role === 'admin' ? `<button onclick="event.preventDefault(); app.openEditMatchModal('${m.id}')" style="position:absolute; right:-10px; top:-30px; background:transparent; border:none; color:hsl(var(--muted-foreground)); cursor:pointer;" title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>` : ''}
                </div>
            </a>
        `).join('') + `</div>` : views.emptyState('No fixtures', '');

        return `
            <div class="view-enter">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                    <div class="section-title" style="margin:0;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> All Fixtures</div>
                    <div style="display:flex; gap:8px;">${views.pitchDropdown()} ${views.categoryDropdown()}</div>
                </div>
                <h3 style="font-size: 1rem; color: hsl(var(--muted-foreground)); margin-bottom: 1rem; margin-top:2rem;">Upcoming</h3>
                ${renderList(upcoming)}
                <h3 style="font-size: 1rem; color: hsl(var(--muted-foreground)); margin-bottom: 1rem; margin-top:2rem;">Results</h3>
                ${renderList(finished)}
            </div>`;
    },

    // ─── TEAMS ───
    stats: async () => {
        const catId = globalState.currentCategoryId;
        const { data: teams } = await api.getTeams(catId);
        const { data: pools } = await api.getPools('all');

        return `
            <div class="view-enter">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                    <div class="section-title" style="margin:0; color:hsl(var(--primary))">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Teams
                    </div>
                    ${views.categoryDropdown()}
                </div>
                <div class="grid-cards">
                    ${teams.length ? teams.map(t => {
            const tPool = pools.find(p => p.id === t.pool_id);
            return `
                        <a href="#/team/${t.id}" class="card card-gradient" style="display:block; text-decoration:none;">
                            <h3 style="font-weight:700; font-size:1.1rem; color:hsl(var(--foreground)); margin-bottom:4px;">${t.name.toUpperCase()}</h3>
                            <div style="color:hsl(var(--muted-foreground)); font-size:0.85rem;">
                                Pool ${tPool?.name || '?'} • ${t.category_id === 'cat-m' ? 'Mens' : 'Ladies'}
                            </div>
                            <div style="margin-top:8px; font-size:0.85rem; color:hsl(var(--primary))">
                                Roster &rarr;
                            </div>
                        </a>
                    `}).join('') : '<div style="color:hsl(var(--muted-foreground)); grid-column: 1 / -1;">No teams active in this category.</div>'}
                </div>
            </div>`;
    },

    // ─── CONTROL PANEL (Staff/Admin) ───
    control: async () => {
        const catId = 'all'; // Admin usually needs full visibility
        const { data: pools } = await api.getPools(catId);
        const { data: teams } = await api.getTeams(catId);
        const { data: matches } = await api.getMatches(catId);
        const { data: cats } = await api.getCategories();

        return `
            <div class="view-enter">
                <div style="max-width: 600px; margin: 0 auto;">
                    <div class="card card-gradient">
                        <div style="display:flex; justify-content:center; margin-bottom:1.5rem">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                        </div>
                        <h2 style="text-align:center; font-size:1.5rem; font-weight:700; margin-bottom:0.25rem;">Command Center</h2>
                        <p style="text-align:center; color:hsl(var(--muted-foreground)); font-size:0.9rem; margin-bottom:1.5rem">Manage tournament data</p>

                        <div style="display:flex; gap:8px; border-bottom:1px solid hsl(var(--border)); padding-bottom:1rem; margin-bottom:1rem; overflow-x:auto">
                            <button class="pill-badge active" onclick="views.setTab(this,'teams')">Team</button>
                            <button class="pill-badge" onclick="views.setTab(this,'pools')">Pool</button>
                            <button class="pill-badge" onclick="views.setTab(this,'players')">Player</button>
                            <button class="pill-badge" onclick="views.setTab(this,'schedule')">Schedule</button>
                            <button class="pill-badge" onclick="views.setTab(this,'finalize')">Scores</button>
                            ${auth.role === 'admin' ? `<button class="pill-badge" onclick="views.setTab(this,'stats')">Stats</button>` : ''}
                            ${auth.role === 'admin' ? `<button class="pill-badge" onclick="views.setTab(this,'users')">Users</button>` : ''}
                        </div>

                        <div id="control-port">
                            ${views.controlTeamForm(pools)}
                        </div>
                    </div>
                </div>
            </div>`;
    },

    setTab: async function (btn, tab) {
        document.querySelectorAll('#control-port').forEach(() => {
            const container = btn.parentElement;
            container.querySelectorAll('.pill-badge').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
        const port = document.getElementById('control-port');
        const catId = 'all';
        const { data: teams } = await api.getTeams(catId);
        const { data: pools } = await api.getPools(catId);
        const { data: cats } = await api.getCategories();
        const { data: matches } = await api.getMatches(catId);
        const { data: users } = await api.getUsers();

        if (tab === 'teams') port.innerHTML = views.controlTeamForm(pools);
        else if (tab === 'pools') port.innerHTML = views.controlPoolForm(cats);
        else if (tab === 'players') port.innerHTML = views.controlPlayerForm(teams);
        else if (tab === 'schedule') port.innerHTML = views.controlScheduleForm(teams);
        else if (tab === 'finalize') port.innerHTML = views.controlFinalizeForm(matches.filter(m => m.status === 'upcoming'));
        else if (tab === 'stats' && auth.role === 'admin') port.innerHTML = views.controlStatsForm(teams);
        else if (tab === 'users' && auth.role === 'admin') port.innerHTML = views.controlUsersForm(users);
    },

    controlPoolForm: (cats) => `
        <div>
            <label style="display:block; font-size:0.8rem; color:hsl(var(--muted-foreground)); margin-bottom:4px">Pool Name</label>
            <input class="form-input" type="text" id="new-pool-name" placeholder="e.g. A, B, C">
            <label style="display:block; font-size:0.8rem; color:hsl(var(--muted-foreground)); margin-bottom:4px">Assign to Category</label>
            <select class="form-input" id="new-pool-cat">
                ${cats.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
            <button class="btn-full" onclick="app.submitPool()">Create Pool</button>
        </div>`,

    controlTeamForm: (pools) => `
        <div>
            <label style="display:block; font-size:0.8rem; color:hsl(var(--muted-foreground)); margin-bottom:4px">Team Name</label>
            <input class="form-input" type="text" id="new-team-name" placeholder="e.g. BHC SIMAH">
            <label style="display:block; font-size:0.8rem; color:hsl(var(--muted-foreground)); margin-bottom:4px">Category</label>
            <select class="form-input" id="new-team-cat" onchange="views.filterPoolsByCategory(this.value)">
                <option value="cat-m">Mens</option>
                <option value="cat-w">Ladies</option>
            </select>
            <label style="display:block; font-size:0.8rem; color:hsl(var(--muted-foreground)); margin-bottom:4px">Assign to Pool</label>
            <select class="form-input" id="new-team-pool">
                ${pools.map(p => `<option value="${p.id}" class="opt-${p.category_id}">${p.name} (${p.category_id === 'cat-m' ? 'Men' : 'Women'})</option>`).join('')}
            </select>
            <button class="btn-full" onclick="app.submitTeam()">Register Team</button>
        </div>
        <script>
            views.filterPoolsByCategory = function(catId) {
                const poolSelect = document.getElementById('new-team-pool');
                if(!poolSelect) return;
                Array.from(poolSelect.options).forEach(opt => {
                    opt.style.display = opt.className.includes(catId) ? 'block' : 'none';
                });
                poolSelect.value = Array.from(poolSelect.options).find(o => o.style.display !== 'none')?.value || '';
            };
            views.filterPoolsByCategory('cat-m'); // init
        </script>
        `,

    controlPlayerForm: (teams) => `
        <div>
            <input class="form-input" type="text" id="new-play-name" placeholder="Player name">
            <input class="form-input" type="number" id="new-play-jersey" placeholder="Jersey number">
            <select class="form-input" id="new-play-team">
                ${teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
            </select>
            <button class="btn-full" style="background:hsl(var(--accent)); color:#fff" onclick="app.submitPlayer()">Add Player</button>
        </div>`,

    controlScheduleForm: (teams) => `
        <div>
            <select class="form-input" id="m-stage">
                <option value="pool">Pool Stage</option>
                <option value="qf">Quarter Final</option>
                <option value="sf">Semi Final</option>
                <option value="f">Final</option>
            </select>
            <select class="form-input" id="m-team-a">
                ${teams.map(t => `<option value="${t.id}">${t.name} (Home)</option>`).join('')}
            </select>
            <select class="form-input" id="m-team-b">
                ${teams.map(t => `<option value="${t.id}">${t.name} (Away)</option>`).join('')}
            </select>
            <select class="form-input" id="m-pitch">
                <option value="Pitch A">Pitch A</option>
                <option value="Pitch B">Pitch B</option>
            </select>
            <div style="display:flex; gap:8px;">
                <input class="form-input" type="time" id="m-time" title="Start Time" required>
                <input class="form-input" type="number" id="m-dur" placeholder="Duration (mins)" value="60" required>
            </div>
            <button class="btn-full" onclick="app.submitMatch()">Schedule Fixture</button>
        </div>`,

    controlStatsForm: (teams) => `
        <div>
            <select class="form-input" id="s-team">
                ${teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
            </select>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <input class="form-input" type="number" id="s-p" placeholder="Matches (P)">
                <input class="form-input" type="number" id="s-w" placeholder="Wins (W)">
                <input class="form-input" type="number" id="s-d" placeholder="Draws (D)">
                <input class="form-input" type="number" id="s-l" placeholder="Losses (L)">
                <input class="form-input" type="number" id="s-gf" placeholder="Goals For (GF)">
                <input class="form-input" type="number" id="s-ga" placeholder="Goals Ag (GA)">
            </div>
            <p style="font-size:0.8rem; color:hsl(var(--muted-foreground)); margin-bottom:8px;">These stats offset the dynamic tally.</p>
            <button class="btn-full" style="background:hsl(var(--primary)); color:#000" onclick="app.submitTeamStats()">Update Team Stats Override</button>
        </div>`,

    controlUsersForm: (users) => `
        <div>
            <div style="margin-bottom:1rem; border-bottom:1px solid hsl(var(--border)); padding-bottom:8px;">
                <h4 style="font-size:0.9rem; margin-bottom:8px">Existing Users</h4>
                <div style="max-height:100px; overflow-y:auto; font-size:0.8rem;">
                    ${users.map(u => `
                        <div style="display:flex; justify-content:space-between; padding:4px 0;">
                            <span>${u.email}</span>
                            <div style="display:flex; gap:8px; align-items:center;">
                                <span style="color:hsl(var(--primary))">${u.role}</span>
                                <button onclick="app.openEditUserModal('${u.email}')" style="background:none; border:none; cursor:pointer; color:hsl(var(--accent)); padding:0;" title="Edit"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <h4 style="font-size:0.9rem; margin-bottom:8px">Register New Profile</h4>
            <input class="form-input" type="text" id="u-email" placeholder="Email / Username (e.g. jdoe@ku.knt)">
            <input class="form-input" type="password" id="u-pass" placeholder="Password">
            <select class="form-input" id="u-role">
                <option value="staff">Staff (Limited Management)</option>
                <option value="admin">Admin (Full Control)</option>
            </select>
            <button class="btn-full" style="background:hsl(var(--accent)); color:#fff" onclick="app.submitUser()">Register User</button>
        </div>`,

    controlFinalizeForm: (upcomingMatches) => `
        <div>
            ${upcomingMatches.length ? `
                <select class="form-input" id="m-fin-idx">
                    ${upcomingMatches.map(m => `<option value="${m.id}">${m.teamA?.name || 'A'} vs ${m.teamB?.name || 'B'} (${(m.stage || 'pool').toUpperCase()})</option>`).join('')}
                </select>
                <div style="display:flex;gap:12px">
                    <input class="form-input" type="number" id="m-fin-a" placeholder="Home score">
                    <input class="form-input" type="number" id="m-fin-b" placeholder="Away score">
                </div>
                <button class="btn-full" style="background:hsl(var(--sport-gold)); color:#000" onclick="app.submitFinalResult()">Submit Final Result</button>
            ` : `<div style="text-align:center;color:hsl(var(--muted-foreground));padding:20px;font-size:0.9rem">No upcoming fixtures to finalize</div>`}
        </div>`,

    // ─── TEAM DETAIL ───
    teamStats: async (teamId) => {
        const { data: teams } = await api.getTeams('all');
        const team = teams.find(t => t.id === teamId);
        const { data: players } = await api.getPlayers(teamId);
        if (!team) return `<div>Team not found</div>`;

        return `
            <div class="view-enter">
                <a href="javascript:history.back()" style="display:inline-block; margin-bottom:1rem; color:hsl(var(--muted-foreground)); font-size:0.9rem">&larr; Back to Teams</a>
                <div class="card card-gradient" style="margin-bottom:1.5rem">
                    <h2 style="font-size:1.5rem; font-weight:700">${team.name.toUpperCase()}</h2>
                    <div style="color:hsl(var(--muted-foreground))">Roster</div>
                </div>
                <div class="grid-cards">
                    ${players.length ? players.map(p => `
                        <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px;">
                            <span style="font-weight:600">${p.name}</span>
                            <span style="background:hsl(var(--muted)); padding:4px 8px; border-radius:4px; font-size:0.8rem; color:hsl(var(--muted-foreground))">#${p.jersey}</span>
                        </div>
                    `).join('') : '<div style="color:hsl(var(--muted-foreground));">No players registered</div>'}
                </div>
            </div>`;
    },

    // ─── MATCH DETAIL ───
    matchEvents: async (matchId) => {
        const { data: matches } = await api.getMatches('all');
        const m = matches.find(x => x.id === matchId);
        if (!m) return `<div>Match not found</div>`;

        return `
            <div class="view-enter">
                <a href="javascript:history.back()" style="display:inline-block; margin-bottom:1rem; color:hsl(var(--muted-foreground)); font-size:0.9rem">&larr; Back to Fixtures</a>
                <div class="card card-gradient">
                    <div style="text-align:center; margin-bottom:16px;">
                        <span style="display:inline-block; padding: 4px 12px; border-radius:16px; background:${m.status === 'finished' ? 'hsl(var(--accent)/0.2)' : 'hsl(var(--primary)/0.2)'}; color:${m.status === 'finished' ? 'hsl(var(--accent))' : 'hsl(var(--primary))'}; font-size:0.85rem; font-weight:600;">${m.status.toUpperCase()}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:1.5rem; font-family:'Outfit', sans-serif; font-weight:700;">
                        <div style="flex:1; text-align:right;">${m.teamA?.name}</div>
                        <div style="padding: 0 1.5rem; color:${m.status === 'finished' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}">${m.status === 'finished' ? m.scoreA + ' - ' + m.scoreB : 'VS'}</div>
                        <div style="flex:1; text-align:left;">${m.teamB?.name}</div>
                    </div>
                    <div style="text-align:center; color:hsl(var(--muted-foreground)); margin-top:16px; font-size:0.9rem">${m.pitch} ${m.stage && m.stage !== 'pool' ? ' • ' + m.stage.toUpperCase() : ''}</div>
                </div>
            </div>`;
    },

    emptyState: (title, desc) => `
        <div style="text-align:center; padding: 3rem; background:hsl(var(--card)); border:1px dashed hsl(var(--border)); border-radius:var(--radius); margin-top:1rem;">
            <svg style="margin:0 auto 12px; color:hsl(var(--muted-foreground))" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <h4 style="font-weight:600; font-family:'Outfit',sans-serif; margin-bottom:4px">${title}</h4>
            <p style="color:hsl(var(--muted-foreground)); font-size:0.9rem">${desc}</p>
        </div>`,

    categoryDropdown: () => {
        const current = globalState.currentCategoryId;
        const opts = [{v:'all', l:'All Categories'}, {v:'cat-m', l:'Mens'}, {v:'cat-w', l:'Ladies'}];
        const selected = opts.find(o => o.v === current).l;
        return `
        <div style="position:relative; width:160px; font-family:'Space Grotesk',sans-serif;" tabindex="0" onblur="setTimeout(() => this.querySelector('.dd-menu').classList.add('hidden'), 150)">
            <div class="modern-select" style="display:flex; justify-content:space-between; align-items:center;" onclick="this.nextElementSibling.classList.toggle('hidden')">
                <span>${selected}</span>
            </div>
            <div class="dd-menu hidden" style="position:absolute; top:110%; left:0; right:0; background:rgba(20,20,30,0.95); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.1); border-radius:10px; z-index:1000; box-shadow:0 10px 30px rgba(0,0,0,0.5); overflow:hidden;">
                ${opts.map(o => `
                    <div style="padding:10px 16px; font-size:0.85rem; cursor:pointer; color:${o.v === current ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}; background:${o.v === current ? 'rgba(255,255,255,0.05)' : 'transparent'};"
                         onmouseover="this.style.background='rgba(255,255,255,0.1)'"
                         onmouseout="this.style.background='${o.v === current ? 'rgba(255,255,255,0.05)' : 'transparent'}'"
                         onclick="app.setCategory('${o.v}')">
                        ${o.l}
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    pitchDropdown: () => {
        const current = globalState.currentPitchId;
        const opts = [{v:'all', l:'All Fields'}, {v:'Pitch A', l:'Pitch A'}, {v:'Pitch B', l:'Pitch B'}];
        const selected = opts.find(o => o.v === current).l;
        return `
        <div style="position:relative; width:140px; font-family:'Space Grotesk',sans-serif;" tabindex="0" onblur="setTimeout(() => this.querySelector('.dd-menu').classList.add('hidden'), 150)">
            <div class="modern-select" style="display:flex; justify-content:space-between; align-items:center;" onclick="this.nextElementSibling.classList.toggle('hidden')">
                <span>${selected}</span>
            </div>
            <div class="dd-menu hidden" style="position:absolute; top:110%; left:0; right:0; background:rgba(20,20,30,0.95); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.1); border-radius:10px; z-index:1000; box-shadow:0 10px 30px rgba(0,0,0,0.5); overflow:hidden;">
                ${opts.map(o => `
                    <div style="padding:10px 16px; font-size:0.85rem; cursor:pointer; color:${o.v === current ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}; background:${o.v === current ? 'rgba(255,255,255,0.05)' : 'transparent'};"
                         onmouseover="this.style.background='rgba(255,255,255,0.1)'"
                         onmouseout="this.style.background='${o.v === current ? 'rgba(255,255,255,0.05)' : 'transparent'}'"
                         onclick="app.setPitch('${o.v}')">
                        ${o.l}
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    loginForm: () => `
        <div style="text-align:center; margin-bottom:24px">
            <svg style="margin:0 auto 12px; color:hsl(var(--primary))" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            <h2 style="font-family:'Outfit',sans-serif; font-size:1.5rem; font-weight:700;">Login</h2>
            <p style="color:hsl(var(--muted-foreground)); font-size:0.9rem">Access admin or team features</p>
        </div>
        
        <div style="display:flex; gap:8px; margin-bottom:1.5rem">
            <button style="flex:1; background:hsl(var(--primary)); color:#fff; padding:8px; border-radius:6px; font-weight:600">Admin</button>
            <button style="flex:1; background:hsl(var(--muted)); color:hsl(var(--muted-foreground)); padding:8px; border-radius:6px; font-weight:600">Team</button>
        </div>

        <form style="text-align:left" onsubmit="app.handleLogin(event)">
            <label style="display:block; font-size:0.8rem; color:hsl(var(--muted-foreground)); margin-bottom:4px">Username</label>
            <input class="form-input" type="text" id="login-email" placeholder="e.g. admin" required>
            
            <label style="display:block; font-size:0.8rem; color:hsl(var(--muted-foreground)); margin-bottom:4px">Password</label>
            <input class="form-input" type="password" id="login-pass" placeholder="••••••••" required>
            
            <button type="submit" class="btn-full" style="margin-top:16px;">Login</button>
        </form>
    `
};

const style = document.createElement('style');
style.textContent = `
    .pill-badge {
        padding: 6px 16px;
        background: hsl(var(--muted));
        color: hsl(var(--muted-foreground));
        border-radius: 9999px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }
    .pill-badge.active {
        background: hsl(var(--primary) / 0.15);
        color: hsl(var(--primary));
        border-color: hsl(var(--primary) / 0.3);
    }
    .pill-badge:hover:not(.active) {
        background: hsl(var(--border));
        color: hsl(var(--foreground));
    }
    .modern-select {
        appearance: none;
        -webkit-appearance: none;
        background-color: rgba(255, 255, 255, 0.05); /* Premium glass background */
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle outline */
        color: hsl(var(--foreground));
        padding: 8px 16px;
        padding-right: 40px;
        border-radius: 10px; /* Mac style radius */
        font-size: 0.9rem;
        font-family: inherit;
        font-weight: 500;
        margin: 0;
        width: auto;
        cursor: pointer;
        background-image: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"/></svg>');
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 18px;
        transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1);
    }
    .modern-select:hover {
        background-color: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.15);
    }
    .modern-select:focus {
        outline: none;
        border-color: hsl(var(--primary));
        box-shadow: 0 0 0 3px hsl(var(--primary) / 0.3), inset 0 1px 0 rgba(255,255,255,0.1);
        background-color: rgba(0, 0, 0, 0.8);
    }
    .modern-select option {
        background-color: hsl(var(--card));
        color: hsl(var(--card-foreground));
        padding: 8px;
    }
`;
document.head.appendChild(style);
