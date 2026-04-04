// js/views.js — Automated Tournament Dashboard

const views = {
    formatTime: (isoString) => {
        if (!isoString) return '--:--';
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    },

    // ─── HUB (Home) ───
    dashboardHub: async () => {
        const { data: matches } = await api.getMatches('all', 'all');
        const todayStr = '2026-04-04'; // Dynamic logic could be new Date().toISOString().split('T')[0]
        
        const todayMatches = matches.filter(m => m.time.startsWith(todayStr)).sort((a,b) => new Date(a.time) - new Date(b.time));
        const live = todayMatches.filter(m => m.status === 'live');
        
        const pitch1 = todayMatches.filter(m => m.pitch === 'Pitch 1');
        const pitch2 = todayMatches.filter(m => m.pitch === 'Pitch 2');

        const renderMiniList = (list) => list.length ? list.map(m => `
            <div style="padding: 12px 16px; border-bottom: 1px solid hsl(var(--border)/0.3); display:flex; justify-content:space-between; align-items:center; ${m.status === 'live' ? 'background:hsl(var(--primary)/0.05);' : ''}">
                <div style="flex:1;">
                    <div style="color:hsl(var(--primary)); font-weight:700; font-size:0.7rem; margin-bottom:2px;">${views.formatTime(m.time)}</div>
                    <div style="font-weight:600; font-size:0.85rem;">${m.teamA?.name || 'TBA'} <span style="color:hsl(var(--muted-foreground)); font-weight:400;">vs</span> ${m.teamB?.name || 'TBA'}</div>
                </div>
                <div style="text-align:right; display:flex; align-items:center; gap:12px;">
                    <div style="text-align:right;">
                        <div style="display:flex; align-items:center; gap:6px; justify-content:flex-end;">
                            ${m.status === 'live' ? '<div class="live-dot" style="background:hsl(var(--destructive))"></div>' : ''}
                            <span style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:${m.status === 'live' ? 'hsl(var(--destructive))' : (m.status === 'finished' ? 'hsl(var(--accent))' : 'hsl(var(--muted-foreground))')}">${m.status.toUpperCase()}</span>
                        </div>
                        ${m.status === 'finished' ? `<div style="font-weight:800; font-size:0.9rem; color:hsl(var(--primary));">${m.scoreA} - ${m.scoreB}</div>` : ''}
                    </div>
                    ${auth.role === 'admin' ? `
                        <button onclick="app.openEditMatchModal('${m.id}')" style="background:none; border:none; color:hsl(var(--muted-foreground)); cursor:pointer; padding:4px;" title="Edit">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('') : '<div style="padding:16px; color:hsl(var(--muted-foreground)); font-size:0.85rem;">No games scheduled for this pitch today.</div>';

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
                    @media (max-width: 768px) {
                        .hero-layout-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; }
                    }
                    .collapsible-trigger {
                        padding: 14px 16px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        cursor: pointer;
                        background: hsl(var(--card));
                        border-radius: var(--radius);
                        border: 1px solid hsl(var(--border));
                        transition: all 0.2s;
                        user-select: none;
                    }
                    .collapsible-trigger:hover { background: hsl(var(--accent)/0.05); }
                    .collapsible-content.hidden { display: none; }
                    .hero-grid {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: 2rem;
                        align-items: flex-start;
                    }
                    .hero-sub-row {
                        display: grid;
                        grid-template-columns: 100px 1fr;
                        gap: 1.5rem;
                        align-items: center;
                        margin-top: 1rem;
                    }
                    @media (min-width: 992px) {
                        .hero-grid {
                            grid-template-columns: 1.2fr 1fr 1fr;
                            align-items: center;
                        }
                        .hero-sub-row {
                            display: contents; /* Become columns in parent grid */
                        }
                    }
                </style>

                <!-- Realigned Responsive Hero (Screenshot Match) -->
                <div class="card hero-gradient" style="margin-bottom: 2rem; padding: 2rem; border-color: hsl(var(--border)/0.5); border-radius: 24px;">
                    <div class="hero-grid">
                        
                        <!-- Block 1: Desktop Left / Mobile Top -->
                        <div style="display:flex; flex-direction:column; justify-content:center;">
                            <h1 style="color:hsl(var(--primary)); font-size:1.8rem; line-height:1.1; font-weight:900; font-family:'Outfit',sans-serif; margin:0 0 6px 0; text-transform:uppercase; letter-spacing:-0.5px;">
                                WELCOME TO KENYATTA UNIVERSITY OPEN TOURNAMENT 2026
                            </h1>
                            <div style="color:rgba(255,255,255,0.4); font-size: 0.85rem; font-weight:600; margin-bottom:1rem;">Tournament Management Edition</div>
                            <div style="font-size:2.2rem; font-weight:900; font-family:'Space Grotesk',sans-serif; color:#fff;" id="widget-time">
                                --:-- <span style="font-size:1.2rem; opacity:0.6; font-weight:600;">--</span>
                            </div>
                        </div>

                        <!-- Sub-Row for Mobile (Logo & Weather side-by-side) -->
                        <div class="hero-sub-row">
                            <!-- Block 2: Desktop Center Logo -->
                            <div style="display:flex; align-items:center; justify-content:center;">
                                <div class="wave-beacon">
                                    <div style="width:140px; height:140px; border-radius:50%; background:#fff; padding:3px; position:relative; z-index:2;">
                                        <div style="width:100%; height:100%; border-radius:50%; overflow:hidden; background:#000;">
                                            <img src="assets/logo.jpeg" style="width:100%; height:100%; object-fit:cover;">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Block 3: Desktop Right Weather & Directions -->
                            <div style="display:flex; flex-direction:column; align-items:flex-end; justify-content:center; gap:12px;">
                                <div style="display:flex; align-items:center; gap:12px;">
                                    <div id="widget-w-icon" style="font-size:2.2rem;">⛅</div>
                                    <div id="widget-temp" style="font-size:2.5rem; font-weight:900; color:#fff; font-family:'Outfit',sans-serif; line-height:1;">--°C</div>
                                </div>
                                
                                <div style="text-align:right; line-height:1.2;">
                                    <div id="widget-condition" style="font-size:0.9rem; font-weight:700; color:#fff;">Partly cloudy</div>
                                    <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:hsl(var(--primary)); letter-spacing:1px; margin:2px 0;">Nairobi</div>
                                    <div id="widget-date" style="font-size:0.7rem; color:rgba(255,255,255,0.4); font-weight:500;">Saturday, April 4</div>
                                </div>

                                <button onclick="app.openLocation()" style="background:hsl(var(--primary)); color:#000; font-weight:800; border-radius:50px; font-size:0.75rem; padding:8px 18px; margin:0; display:flex; align-items:center; gap:6px; border:none; box-shadow: 0 8px 15px rgba(255,102,0,0.2);">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line></svg>
                                    Directions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 style="font-size:1.1rem; font-family:'Outfit',sans-serif; margin-bottom:1rem; display:flex; align-items:center; gap:8px;">
                    <div class="live-dot" style="background:hsl(var(--destructive))"></div> Now Playing
                </h3>

                <div class="grid-cards" style="margin-bottom: 2rem;">
                    ${live.length ? live.map(m => `
                        <div class="card card-gradient live-card" style="border-left: 4px solid hsl(var(--destructive));">
                            <div style="display:flex; justify-content:space-between; margin-bottom: 1rem;">
                                <span style="font-size:0.7rem; font-weight:800; color:hsl(var(--destructive)); text-transform:uppercase; letter-spacing:1px;">LIVE</span>
                                <span style="font-size:0.75rem; color:hsl(var(--muted-foreground)); font-weight:600;">${m.pitch}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
                                <div style="text-align:left; flex:1;">
                                    <div style="font-weight:700; font-size:1rem;">${m.teamA?.name || 'TBA'}</div>
                                </div>
                                <div style="padding: 0 1rem; font-size:1.8rem; font-weight:800; color:hsl(var(--primary)); font-family:'Outfit',sans-serif;">
                                    ${m.scoreA} : ${m.scoreB}
                                </div>
                                <div style="text-align:right; flex:1;">
                                    <div style="font-weight:700; font-size:1rem;">${m.teamB?.name || 'TBA'}</div>
                                </div>
                            </div>
                            ${auth.role === 'admin' ? `
                                <button class="btn-full" style="background:hsl(var(--accent)); color:#fff; font-size:0.75rem; padding:8px;" onclick="app.openEditMatchModal('${m.id}')">
                                    Update Score / Delay
                                </button>
                            ` : ''}
                        </div>
                    `).join('') : `
                        <div class="card" style="grid-column: 1 / -1; text-align:center; padding:2rem; border-style:dashed; color:hsl(var(--muted-foreground));">
                            No games are live right now. Finish the current ones to advance.
                        </div>
                    `}
                </div>

                <h3 style="font-size:1.1rem; font-family:'Outfit',sans-serif; margin-bottom:1rem;">Today's Full Schedule</h3>
                
                <div style="display:grid; grid-template-columns: 1fr; gap: 1rem;">
                    <!-- Pitch 1 Collapsible -->
                    <div>
                        <div class="collapsible-trigger" onclick="const c=this.nextElementSibling; c.classList.toggle('hidden'); this.querySelector('.arrow').innerHTML = c.classList.contains('hidden') ? '&darr;' : '&uarr;';">
                            <div style="display:flex; align-items:center; gap:10px;">
                                <div style="width:8px; height:8px; border-radius:50%; background:hsl(var(--primary));"></div>
                                <h4 style="margin:0; font-size:0.9rem; font-weight:700; letter-spacing:1px;">PITCH 1</h4>
                            </div>
                            <span class="arrow" style="font-size:1.2rem;">&darr;</span>
                        </div>
                        <div class="collapsible-content card" style="padding:0; margin-top:4px; border-top:none; border-radius:0 0 var(--radius) var(--radius);">
                            ${renderMiniList(pitch1)}
                        </div>
                    </div>

                    <!-- Pitch 2 Collapsible -->
                    <div>
                        <div class="collapsible-trigger" onclick="const c=this.nextElementSibling; c.classList.toggle('hidden'); this.querySelector('.arrow').innerHTML = c.classList.contains('hidden') ? '&darr;' : '&uarr;';">
                            <div style="display:flex; align-items:center; gap:10px;">
                                <div style="width:8px; height:8px; border-radius:50%; background:hsl(var(--sport-gold));"></div>
                                <h4 style="margin:0; font-size:0.9rem; font-weight:700; letter-spacing:1px;">PITCH 2</h4>
                            </div>
                            <span class="arrow" style="font-size:1.2rem;">&darr;</span>
                        </div>
                        <div class="collapsible-content card" style="padding:0; margin-top:4px; border-top:none; border-radius:0 0 var(--radius) var(--radius);">
                            ${renderMiniList(pitch2)}
                        </div>
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
                <div class="grid-cards" style="grid-template-columns: 1fr;">
        `;

        if (!pools.length) {
            html += '<div style="color:hsl(var(--muted-foreground));">No pools found.</div>';
        }

        for (const pool of pools) {
            const { data: std } = await api.getStandings(pool.id);
            const categoryName = pool.category_id === 'cat-m' ? 'Mens' : 'Ladies';
            html += `
                <div class="card card-gradient" style="padding:0; overflow-x:hidden; margin-bottom:1.5rem">
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
                <div style="display:flex; justify-content:space-between; margin-bottom: 12px; align-items:center;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:0.65rem; font-weight:700; padding: 2px 8px; border-radius:12px; background: ${m.status === 'finished' ? 'hsl(var(--accent)/0.1)' : m.status === 'live' ? 'hsl(var(--destructive)/0.1)' : 'hsl(var(--primary)/0.1)'}; color:${m.status === 'finished' ? 'hsl(var(--accent))' : m.status === 'live' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}">${m.status.toUpperCase()}</span>
                        ${m.status === 'live' ? `<div class="live-dot" style="background:hsl(var(--destructive))"></div>` : ''}
                    </div>
                    <span style="font-size:0.75rem; color:hsl(var(--muted-foreground)); font-weight:600;">${m.pitch} ${m.stage && m.stage !== 'pool' ? ' • ' + m.stage.toUpperCase() : ''}</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; font-weight:600; position:relative;">
                    <span style="width:35%; text-align:left; font-size:0.9rem;">${m.teamA?.name || 'TBA'}</span>
                    <div style="display:flex; flex-direction:column; align-items:center;">
                        <span style="font-size:1.25rem; color:${(m.status === 'finished' || m.status === 'live') ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}">${(m.status === 'finished' || m.status === 'live') ? m.scoreA + ' - ' + m.scoreB : 'vs'}</span>
                        <span style="font-size:0.7rem; color:hsl(var(--muted-foreground)); font-weight:400;">${m.status === 'live' ? 'LIVE' : views.formatTime(m.time)}</span>
                    </div>
                    <span style="width:35%; text-align:right; font-size:0.9rem;">${m.teamB?.name || 'TBA'}</span>
                    ${auth.role === 'admin' ? `
                        <div style="position:absolute; right:-10px; top:-40px; display:flex; gap:8px;">
                            ${m.status === 'upcoming' ? `<button class="pill-badge" style="background:hsl(var(--primary)/0.1); color:hsl(var(--primary)); padding:2px 8px; font-size:0.65rem;" onclick="event.preventDefault(); app.startMatch('${m.id}')">START</button>` : ''}
                            <button onclick="event.preventDefault(); app.openEditMatchModal('${m.id}')" style="background:transparent; border:none; color:hsl(var(--muted-foreground)); cursor:pointer;" title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
                        </div>
                    ` : ''}
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

    // ─── CONTROL PANEL ───
    control: async () => {
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
                            Loading...
                        </div>
                    </div>
                </div>
            </div>`;
    },

    setTab: async function (btn, tab) {
        document.querySelectorAll('.pill-badge').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
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
        else if (tab === 'finalize') port.innerHTML = views.controlFinalizeForm(matches.filter(m => m.status !== 'finished'));
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
                <option value="Pitch 1">Pitch 1</option>
                <option value="Pitch 2">Pitch 2</option>
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
                                <button onclick="app.openEditUserModal('${u.email}')" style="background:none; border:none; color:hsl(var(--accent)); cursor:pointer; padding:0;" title="Edit"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <h4 style="font-size:0.9rem; margin-bottom:8px">Register New Profile</h4>
            <input class="form-input" type="text" id="u-email" placeholder="Email / Username (e.g. jdoe@ku.knt)">
            <input class="form-input" type="password" id="u-pass" placeholder="Password">
            <select class="form-input" id="u-role">
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
            </select>
            <button class="btn-full" style="background:hsl(var(--accent)); color:#fff" onclick="app.submitUser()">Register User</button>
        </div>`,

    controlFinalizeForm: (matches) => `
        <div>
            ${matches.length ? `
                <select class="form-input" id="m-fin-idx">
                    ${matches.map(m => `<option value="${m.id}">${m.teamA?.name || 'A'} vs ${m.teamB?.name || 'B'} (${(m.stage || 'pool').toUpperCase()})</option>`).join('')}
                </select>
                <div style="display:flex;gap:12px">
                    <input class="form-input" type="number" id="m-fin-a" placeholder="Home score">
                    <input class="form-input" type="number" id="m-fin-b" placeholder="Away score">
                </div>
                <button class="btn-full" style="background:hsl(var(--sport-gold)); color:#000" onclick="app.submitFinalResult()">Submit Result / Update Status</button>
            ` : `<div style="text-align:center;color:hsl(var(--muted-foreground));padding:20px;font-size:0.9rem">No matches to manage</div>`}
        </div>`,

    filterPoolsByCategory: (catId) => {
        const poolSelect = document.getElementById('new-team-pool');
        if (!poolSelect) return;
        const options = poolSelect.querySelectorAll('option');
        options.forEach(opt => {
            if (opt.classList.contains(`opt-${catId}`)) {
                opt.style.display = 'block';
            } else {
                opt.style.display = 'none';
                if (poolSelect.value === opt.value) poolSelect.selectedIndex = -1;
            }
        });
        // Select the first visible option
        const firstVisible = Array.from(options).find(o => o.style.display === 'block');
        if (firstVisible) poolSelect.value = firstVisible.value;
    },

    // ─── TEAM DETAIL ───
    teamStats: async (teamId) => {
        const { data: teams } = await api.getTeams('all');
        const team = teams.find(t => t.id === teamId);
        const { data: players } = await api.getPlayers(teamId);
        if (!team) return `<div>Team not found</div>`;

        const isOwner = (auth.role === 'team' && auth.teamId === teamId) || auth.role === 'admin' || auth.role === 'staff';

        const backPath = auth.role === 'team' ? '#/' : '#/stats';

        return `
            <div class="view-enter">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                    <a href="${backPath}" style="color:hsl(var(--muted-foreground)); font-size:0.85rem; text-decoration:none; display:flex; align-items:center; gap:4px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg> Back
                    </a>
                </div>

                <div class="card card-gradient" style="margin-bottom:1.5rem; text-align:center; padding: 2.5rem 1rem;">
                    <div style="width:100px; height:100px; border-radius:50%; background:#fff; margin: 0 auto 1.5rem; display:flex; align-items:center; justify-content:center; border:3px solid hsl(var(--primary)); box-shadow: 0 0 20px hsla(var(--primary), 0.2);">
                         <img src="${team.logo}" style="width:80px; height:80px; object-fit:contain;">
                    </div>
                    <h2 style="font-size:1.8rem; font-weight:800; font-family:'Outfit',sans-serif; margin:0; letter-spacing:-0.5px;">${team.name.toUpperCase()}</h2>
                    <div style="color:hsl(var(--muted-foreground)); font-size:0.95rem; font-weight:500; margin-top:6px;">Official Tournament Roster</div>
                </div>

                ${isOwner ? `
                    <div class="card" style="margin-bottom:1.5rem; padding:1.25rem; border:1px dashed hsl(var(--primary)/0.3); background:hsl(var(--primary)/0.02);">
                        <h4 style="margin:0 0 1rem 0; font-size:0.85rem; font-weight:800; color:hsl(var(--primary)); text-transform:uppercase; letter-spacing:1.5px;">Register New Player</h4>
                        <form onsubmit="event.preventDefault(); app.submitPlayerToRoster('${teamId}')" style="display:grid; grid-template-columns: 1fr 80px auto; gap:12px;">
                            <input class="form-input" type="text" id="new-p-name" placeholder="Full Name (e.g. JOHN DOE)" required style="margin:0; height:46px; font-weight:600;">
                            <input class="form-input" type="number" id="new-p-jersey" placeholder="#" required style="margin:0; height:46px; font-weight:800;">
                            <button type="submit" class="btn-full" style="margin:0; height:46px; width:46px; padding:0; display:flex; align-items:center; justify-content:center; background:hsl(var(--primary)); color:#000; border-radius:12px;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            </button>
                        </form>
                    </div>
                ` : ''}

                <div style="display:grid; grid-template-columns: 1fr; gap: 10px;">
                    ${players.length ? players.map(p => `
                        <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:16px 20px; background:hsl(var(--card)/0.4); border:1px solid hsl(var(--border)/0.5);">
                            <div style="display:flex; align-items:center; gap:20px;">
                                <div style="width:40px; height:40px; border-radius:10px; background:hsl(var(--background)); display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.1rem; color:hsl(var(--primary)); border:2px solid hsl(var(--border)); font-family:'Space Grotesk',sans-serif;">
                                    ${p.jersey}
                                </div>
                                <span style="font-weight:700; font-size:1rem; letter-spacing:0.5px; color:hsl(var(--foreground));">${p.name.toUpperCase()}</span>
                            </div>
                            ${isOwner ? `
                                <button onclick="app.deletePlayerFromRoster('${p.id}', '${teamId}')" style="background:hsl(var(--destructive)/0.1); border:none; color:hsl(var(--destructive)); cursor:pointer; width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; transition:0.2s;" class="hover-danger">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            ` : ''}
                        </div>
                    `).join('') : `
                        <div style="text-align:center; padding: 3rem; color:hsl(var(--muted-foreground)); font-size:0.9rem; border:2px dashed hsl(var(--border)); border-radius:var(--radius);">
                            <svg style="margin-bottom:12px; opacity:0.3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                            <div style="font-weight:600;">No official squad registered.</div>
                        </div>
                    `}
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
                         onclick="app.setCategory('${o.v}')">
                        ${o.l}
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    pitchDropdown: () => {
        const current = globalState.currentPitchId;
        const opts = [{v:'all', l:'All Fields'}, {v:'Pitch 1', l:'Pitch 1'}, {v:'Pitch 2', l:'Pitch 2'}];
        const selected = opts.find(o => o.v === current).l;
        return `
        <div style="position:relative; width:140px; font-family:'Space Grotesk',sans-serif;" tabindex="0" onblur="setTimeout(() => this.querySelector('.dd-menu').classList.add('hidden'), 150)">
            <div class="modern-select" style="display:flex; justify-content:space-between; align-items:center;" onclick="this.nextElementSibling.classList.toggle('hidden')">
                <span>${selected}</span>
            </div>
            <div class="dd-menu hidden" style="position:absolute; top:110%; left:0; right:0; background:rgba(20,20,30,0.95); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.1); border-radius:10px; z-index:1000; box-shadow:0 10px 30px rgba(0,0,0,0.5); overflow:hidden;">
                ${opts.map(o => `
                    <div style="padding:10px 16px; font-size:0.85rem; cursor:pointer; color:${o.v === current ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}; background:${o.v === current ? 'rgba(255,255,255,0.05)' : 'transparent'};"
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
            <h2 style="font-family:'Outfit',sans-serif; font-size:1.5rem; font-weight:700;">Staff Login</h2>
            <p style="color:hsl(var(--muted-foreground)); font-size:0.9rem">Authorized personnel only</p>
        </div>

        <form style="text-align:left" onsubmit="app.handleLogin(event)">
            <label style="display:block; font-size:0.8rem; color:hsl(var(--muted-foreground)); margin-bottom:4px">Email</label>
            <input class="form-input" type="text" id="login-email" placeholder="email@example.com" required>
            
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
        background-color: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: hsl(var(--foreground));
        padding: 8px 16px;
        padding-right: 40px;
        border-radius: 10px;
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
    }
    .modern-select:focus {
        outline: none;
        border-color: hsl(var(--primary));
    }
    .dd-menu.hidden { display: none; }
    @keyframes pulse-dot {
        0% { transform: scale(0.95); opacity: 0.8; }
        50% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(0.95); opacity: 0.8; }
    }
    .live-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        animation: pulse-dot 1s infinite;
    }
`;
document.head.appendChild(style);
