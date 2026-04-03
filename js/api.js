// js/api.js
// KU Open Tournament // The Professional Data Engine (One-Man Team Edition)

const SUPABASE_URL = 'https://vfykbtwesjrmitbvyjkv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmeWtidHdlc2pybWl0YnZ5amt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMzgyMTcsImV4cCI6MjA5MDgxNDIxN30.AHPdZ_scqvOI3c9GEO22gK93ceQa4f0ai2dopZZfY74';

window.supabaseClient = null;
if (typeof supabase !== 'undefined') {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// 🏛️ PERSISTENT SEED DATA
const MOCK_DATA = {
    categories: [{ id: 'cat-m', name: 'Men' }, { id: 'cat-w', name: 'Women' }],
    pools: JSON.parse(localStorage.getItem('KU_POOLS')) || [
        { id: 'p1', name: 'A', category_id: 'cat-m' },
        { id: 'p2', name: 'B', category_id: 'cat-m' },
        { id: 'p3', name: 'A', category_id: 'cat-w' }
    ],
    teams: JSON.parse(localStorage.getItem('KU_TEAMS')) || [
        { id: 't1', name: 'LAKE CITY HC', category_id: 'cat-m', pool_id: 'p1', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=lake' },
        { id: 't2', name: 'RIVER WOLVES', category_id: 'cat-m', pool_id: 'p1', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=river' },
        { id: 't3', name: 'TITAN HOCKEY', category_id: 'cat-m', pool_id: 'p1', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=titan' },
        { id: 't4', name: 'STORM UNITED', category_id: 'cat-m', pool_id: 'p2', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=storm' },
        { id: 't5', name: 'ROYAL KINGS', category_id: 'cat-m', pool_id: 'p2', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=royal' },
        { id: 't6', name: 'VALKYRIES', category_id: 'cat-w', pool_id: 'p3', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=valk' }
    ],
    players: JSON.parse(localStorage.getItem('KU_PLAYERS')) || [
        { id: 'pl1', name: 'Michael Jordan', jersey: 23, team_id: 't1' },
        { id: 'pl2', name: 'LeBron James', jersey: 6, team_id: 't1' },
        { id: 'pl3', name: 'Serena Williams', jersey: 1, team_id: 't6' }
    ],
    matches: JSON.parse(localStorage.getItem('KU_MATCHES')) || [
        { id: 'm1', teamA_id: 't1', teamB_id: 't2', scoreA: 4, scoreB: 2, status: 'finished', pitch: 'Pitch A', time: new Date().toISOString(), category_id: 'cat-m', stage: 'pool' },
        { id: 'm2', teamA_id: 't3', teamB_id: 't1', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch B', time: new Date(Date.now() + 86400000).toISOString(), category_id: 'cat-m', stage: 'pool' }
    ],
    events: JSON.parse(localStorage.getItem('KU_EVENTS')) || [
        { match_id: 'm1', type: 'goal', player_name: 'Michael Jordan', team_id: 't1', minute: 15 }
    ],
    users: JSON.parse(localStorage.getItem('KU_USERS')) || [
        { email: 'staff@ku.knt', password: '123', role: 'staff' },
        { email: 'admin@ku.knt', password: 'admin', role: 'admin' }
    ]
};

const api = {
    useDemo: true, // Always start in Professional Demo mode for field readiness
    
    // ⚙️ HELPERS
    persist: () => {
        localStorage.setItem('KU_POOLS', JSON.stringify(MOCK_DATA.pools));
        localStorage.setItem('KU_TEAMS', JSON.stringify(MOCK_DATA.teams));
        localStorage.setItem('KU_PLAYERS', JSON.stringify(MOCK_DATA.players));
        localStorage.setItem('KU_MATCHES', JSON.stringify(MOCK_DATA.matches));
        localStorage.setItem('KU_EVENTS', JSON.stringify(MOCK_DATA.events));
        localStorage.setItem('KU_USERS', JSON.stringify(MOCK_DATA.users));
    },

    // 1️⃣ CORE GETTERS
    getCategories: async () => ({ data: MOCK_DATA.categories }),
    getPools: async (catId) => ({ data: (catId && catId !== 'all') ? MOCK_DATA.pools.filter(p => p.category_id === catId) : MOCK_DATA.pools }),
    getTeams: async (catId) => ({ data: (catId && catId !== 'all') ? MOCK_DATA.teams.filter(t => t.category_id === catId) : MOCK_DATA.teams }),
    getPlayers: async (teamId) => ({ data: teamId ? MOCK_DATA.players.filter(p => p.team_id === teamId) : MOCK_DATA.players }),
    getMatches: async (catId, pitchId = 'all') => {
        let matches = (catId && catId !== 'all') ? MOCK_DATA.matches.filter(m => m.category_id === catId) : MOCK_DATA.matches;
        if (pitchId && pitchId !== 'all') {
            matches = matches.filter(m => m.pitch === pitchId);
        }
        return { data: matches.map(m => ({
            ...m,
            teamA: MOCK_DATA.teams.find(t => t.id === m.teamA_id),
            teamB: MOCK_DATA.teams.find(t => t.id === m.teamB_id)
        })) };
    },
    getMatchEvents: async (matchId) => ({ data: MOCK_DATA.events.filter(e => e.match_id === matchId) }),
    
    // 2️⃣ TOURNAMENT INTELLIGENCE
    getStandings: async (poolId) => {
        // Real-time Standing Calculation Logic
        const teams = MOCK_DATA.teams.filter(t => t.pool_id === poolId);
        let standings = teams.map(t => {
            let p = 0, w = 0, d = 0, l = 0, gf = 0, ga = 0;
            // Only count pool stage matches towards standings
            const tMatches = MOCK_DATA.matches.filter(m => m.status === 'finished' && m.stage === 'pool' && (m.teamA_id === t.id || m.teamB_id === t.id));
            tMatches.forEach(m => {
                p++;
                const isA = m.teamA_id === t.id;
                const selfScore = isA ? m.scoreA : m.scoreB;
                const oppScore = isA ? m.scoreB : m.scoreA;
                gf += selfScore; ga += oppScore;
                if (selfScore > oppScore) w++;
                else if (selfScore === oppScore) d++;
                else l++;
            });
            
            // Apply Manual Stats Customization (if admin altered them)
            if (t.manual_stats) {
                p += t.manual_stats.p || 0;
                w += t.manual_stats.w || 0;
                d += t.manual_stats.d || 0;
                l += t.manual_stats.l || 0;
                gf += t.manual_stats.gf || 0;
                ga += t.manual_stats.ga || 0;
            }

            return { name: t.name, p, w, d, l, gf, ga, gd: gf-ga, pts: (w*3) + d };
        });

        // 1. Sort teams using Points (highest first) then Goal Difference (highest first)
        standings.sort((a,b) => {
            if (b.pts !== a.pts) return b.pts - a.pts;
            return b.gd - a.gd;
        });

        // 2. Assign positions handling ties fully
        let currentPos = 1;
        for (let i = 0; i < standings.length; i++) {
            if (i > 0) {
                const prev = standings[i-1];
                const curr = standings[i];
                // Fully Tied condition
                if (curr.pts === prev.pts && curr.gd === prev.gd) {
                    curr.position = prev.position; 
                } else {
                    curr.position = i + 1; // skip next positions accordingly
                }
            } else {
                standings[i].position = 1;
            }
        }

        return { data: standings };
    },

    getTopScorers: async (catId) => {
        const counts = {};
        MOCK_DATA.events.filter(e => e.type === 'goal').forEach(e => {
            counts[e.player_name] = (counts[e.player_name] || 0) + 1;
        });
        return { data: Object.entries(counts).map(([name, goals]) => ({ name, goals })).sort((a,b) => b.goals - a.goals) };
    },

    getCardsReport: async (catId) => {
        const report = { yellow: 0, red: 0, green: 0 };
        MOCK_DATA.events.filter(e => e.type === 'card').forEach(e => report[e.card_type]++);
        return { data: report };
    },

    // 3️⃣ MANAGEMENT CRUD (Staff/Admin)
    createPool: async (pool) => {
        const newPool = { ...pool, id: 'p' + Date.now() };
        MOCK_DATA.pools.push(newPool);
        api.persist();
        return { data: newPool };
    },
    createTeam: async (team) => {
        const newTeam = { ...team, id: 't' + Date.now(), logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(team.name)}`, manual_stats: {p:0, w:0, d:0, l:0, gf:0, ga:0} };
        MOCK_DATA.teams.push(newTeam);
        api.persist();
        return { data: newTeam };
    },
    addPlayer: async (player) => {
        const newPlayer = { ...player, id: 'pl' + Date.now() };
        MOCK_DATA.players.push(newPlayer);
        api.persist();
        return { data: newPlayer };
    },
    scheduleMatch: async (match) => {
        // Time Overlapping Check (1 hour duration)
        const newTime = new Date(match.time).getTime();
        const pitchMatches = MOCK_DATA.matches.filter(m => m.pitch === match.pitch && m.status !== 'finished');
        
        for (let pm of pitchMatches) {
            const extTime = new Date(pm.time).getTime();
            const elapsed = Math.abs(newTime - extTime);
            // If less than 60 minutes apart (3600000ms), it's an overlap
            if (elapsed < 3600000) {
                return { error: 'Time Overlap: Another match is scheduled on this pitch at a conflicting time.' };
            }
        }

        const newMatch = { ...match, id: 'm' + Date.now(), scoreA: 0, scoreB: 0, status: 'upcoming' };
        MOCK_DATA.matches.push(newMatch);
        api.persist();
        return { data: newMatch };
    },
    finalizeMatch: async (id, scoreA, scoreB, events = []) => {
        const match = MOCK_DATA.matches.find(m => m.id === id);
        if (match) {
            match.scoreA = parseInt(scoreA);
            match.scoreB = parseInt(scoreB);
            match.status = 'finished';
            MOCK_DATA.events.push(...events.map(e => ({ ...e, match_id: id })));
            api.persist();
        }
        return { data: match };
    },
    updateTeamStats: async (id, stats) => {
        const team = MOCK_DATA.teams.find(t => t.id === id);
        if (team) {
            team.manual_stats = {
                p: parseInt(stats.p) || 0,
                w: parseInt(stats.w) || 0,
                d: parseInt(stats.d) || 0,
                l: parseInt(stats.l) || 0,
                gf: parseInt(stats.gf) || 0,
                ga: parseInt(stats.ga) || 0
            };
            api.persist();
            return { data: team };
        }
        return { error: 'Team not found' };
    },
    
    // 4️⃣ ADMIN USER CONTROL
    manageStaff: async (email, pass, role, action = 'create') => {
        if (action === 'create') MOCK_DATA.users.push({ email, password: pass, role: role || 'staff' });
        else MOCK_DATA.users = MOCK_DATA.users.filter(u => u.email !== email);
        api.persist();
    },
    getUsers: async () => {
        return { data: MOCK_DATA.users };
    }
};
