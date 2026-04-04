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
    categories: [{ id: 'cat-m', name: 'Men' }, { id: 'cat-w', name: 'Ladies' }],
    pools: JSON.parse(localStorage.getItem('KU_POOLS')) || [
        { id: 'p-m-a', name: 'A', category_id: 'cat-m' },
        { id: 'p-m-b', name: 'B', category_id: 'cat-m' },
        { id: 'p-m-c', name: 'C', category_id: 'cat-m' },
        { id: 'p-m-d', name: 'D', category_id: 'cat-m' },
        { id: 'p-m-e', name: 'E', category_id: 'cat-m' },
        { id: 'p-m-f', name: 'F', category_id: 'cat-m' },
        { id: 'p-m-g', name: 'G', category_id: 'cat-m' },
        { id: 'p-w-a', name: 'A', category_id: 'cat-w' },
        { id: 'p-w-b', name: 'B', category_id: 'cat-w' },
        { id: 'p-w-c', name: 'C', category_id: 'cat-w' },
        { id: 'p-w-d', name: 'D', category_id: 'cat-w' }
    ],
    teams: JSON.parse(localStorage.getItem('KU_TEAMS')) || [
        // LADIES
        { id: 'tw-a1', name: 'TWINKLE B', category_id: 'cat-w', pool_id: 'p-w-a' },
        { id: 'tw-a2', name: 'USIU', category_id: 'cat-w', pool_id: 'p-w-a' },
        { id: 'tw-a3', name: 'ROYAL NOMADS', category_id: 'cat-w', pool_id: 'p-w-a' },
        { id: 'tw-a4', name: 'WILD CATS', category_id: 'cat-w', pool_id: 'p-w-a' },
        { id: 'tw-b1', name: 'AMIRA', category_id: 'cat-w', pool_id: 'p-w-b' },
        { id: 'tw-b2', name: 'REBOUND', category_id: 'cat-w', pool_id: 'p-w-b' },
        { id: 'tw-b3', name: 'VIGILANTEZ', category_id: 'cat-w', pool_id: 'p-w-b' },
        { id: 'tw-c1', name: 'AMIRA MAMUUS', category_id: 'cat-w', pool_id: 'p-w-c' },
        { id: 'tw-c2', name: 'SLIDERS -A', category_id: 'cat-w', pool_id: 'p-w-c' },
        { id: 'tw-c3', name: 'TWINKLE -A', category_id: 'cat-w', pool_id: 'p-w-c' },
        { id: 'tw-c4', name: 'BLAZERS', category_id: 'cat-w', pool_id: 'p-w-c' },
        { id: 'tw-d1', name: 'TITANS', category_id: 'cat-w', pool_id: 'p-w-d' },
        { id: 'tw-d2', name: 'MASTERS SLADES', category_id: 'cat-w', pool_id: 'p-w-d' },
        { id: 'tw-d3', name: 'GHF', category_id: 'cat-w', pool_id: 'p-w-d' },
        // MEN
        { id: 'tm-a1', name: 'MASHUJAA -A', category_id: 'cat-m', pool_id: 'p-m-a' },
        { id: 'tm-a2', name: 'TGG', category_id: 'cat-m', pool_id: 'p-m-a' },
        { id: 'tm-a3', name: 'AVENGERS', category_id: 'cat-m', pool_id: 'p-m-a' },
        { id: 'tm-a4', name: 'PARKLANDS', category_id: 'cat-m', pool_id: 'p-m-a' },
        { id: 'tm-b1', name: 'MEXIMED DVT', category_id: 'cat-m', pool_id: 'p-m-b' },
        { id: 'tm-b2', name: 'PANTHERS', category_id: 'cat-m', pool_id: 'p-m-b' },
        { id: 'tm-b3', name: 'TUKO KADI', category_id: 'cat-m', pool_id: 'p-m-b' },
        { id: 'tm-b4', name: 'VULTURES -A', category_id: 'cat-m', pool_id: 'p-m-b' },
        { id: 'tm-c1', name: 'MASHUJAA -B', category_id: 'cat-m', pool_id: 'p-m-c' },
        { id: 'tm-c2', name: 'MEXIMED PARKROAD', category_id: 'cat-m', pool_id: 'p-m-c' },
        { id: 'tm-c3', name: 'DEKUT', category_id: 'cat-m', pool_id: 'p-m-c' },
        { id: 'tm-c4', name: '1729', category_id: 'cat-m', pool_id: 'p-m-c' },
        { id: 'tm-d1', name: 'IRAN', category_id: 'cat-m', pool_id: 'p-m-d' },
        { id: 'tm-d2', name: 'REEBOK', category_id: 'cat-m', pool_id: 'p-m-d' },
        { id: 'tm-d3', name: 'TROJANS', category_id: 'cat-m', pool_id: 'p-m-d' },
        { id: 'tm-d4', name: 'KYU', category_id: 'cat-m', pool_id: 'p-m-d' },
        { id: 'tm-e1', name: 'WOZA WOZA', category_id: 'cat-m', pool_id: 'p-m-e' },
        { id: 'tm-e2', name: 'IMPALA -B', category_id: 'cat-m', pool_id: 'p-m-e' },
        { id: 'tm-e3', name: 'GORILLAS', category_id: 'cat-m', pool_id: 'p-m-e' },
        { id: 'tm-e4', name: 'MEXIMED -A', category_id: 'cat-m', pool_id: 'p-m-e' },
        { id: 'tm-f1', name: 'WANG\'DU', category_id: 'cat-m', pool_id: 'p-m-f' },
        { id: 'tm-f2', name: 'IMPALA -A', category_id: 'cat-m', pool_id: 'p-m-f' },
        { id: 'tm-f3', name: 'WEKA MAWE', category_id: 'cat-m', pool_id: 'p-m-f' },
        { id: 'tm-f4', name: 'GREENSHARKS', category_id: 'cat-m', pool_id: 'p-m-f' },
        { id: 'tm-g1', name: 'WAZALENDO', category_id: 'cat-m', pool_id: 'p-m-g' },
        { id: 'tm-g2', name: 'ARCHBEACON', category_id: 'cat-m', pool_id: 'p-m-g' },
        { id: 'tm-g3', name: 'VULTURES -B', category_id: 'cat-m', pool_id: 'p-m-g' }
    ].map(t => ({ ...t, logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(t.name)}`, manual_stats: {p:0, w:0, d:0, l:0, gf:0, ga:0} })),
    players: JSON.parse(localStorage.getItem('KU_PLAYERS')) || [],
    matches: JSON.parse(localStorage.getItem('KU_MATCHES')) || [
        // PITCH 1
        { id: 'm1', teamA_id: 'tm-b2', teamB_id: 'tm-b4', scoreA: 0, scoreB: 0, status: 'live', pitch: 'Pitch 1', time: '2026-04-04T06:00:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Q1' },
        { id: 'm2', teamA_id: 'tm-a1', teamB_id: 'tm-a3', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T06:15:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm3', teamA_id: 'tw-a1', teamB_id: 'tw-a2', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T06:30:00Z', category_id: 'cat-w', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm4', teamA_id: 'tm-b2', teamB_id: 'tm-b3', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T06:45:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm5', teamA_id: 'tm-a2', teamB_id: 'tm-a3', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T07:00:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm6', teamA_id: 'tw-b2', teamB_id: 'tw-b3', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T07:15:00Z', category_id: 'cat-w', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm7', teamA_id: 'tm-b1', teamB_id: 'tm-b4', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T07:30:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm8', teamA_id: 'tm-a1', teamB_id: 'tm-a4', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T07:45:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        
        // PITCH 2
        { id: 'm101', teamA_id: 'tm-d1', teamB_id: 'tm-d2', scoreA: 0, scoreB: 0, status: 'live', pitch: 'Pitch 2', time: '2026-04-04T06:00:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Q2' },
        { id: 'm102', teamA_id: 'tm-e1', teamB_id: 'tm-e2', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T06:15:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm103', teamA_id: 'tw-c1', teamB_id: 'tw-c2', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T06:30:00Z', category_id: 'cat-w', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm104', teamA_id: 'tm-g1', teamB_id: 'tm-g2', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T06:45:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm105', teamA_id: 'tm-d2', teamB_id: 'tm-d3', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T07:00:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm106', teamA_id: 'tm-e1', teamB_id: 'tm-e3', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T07:15:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },


        
        // KNOCKOUTS
        { id: 'mk-r16-1', teamA_id: null, teamB_id: null, scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T11:00:00Z', category_id: 'cat-m', stage: 'r16', placeholderA: 'Pool A Winner', placeholderB: 'Pool G Runner Up' },
        { id: 'mk-qf-1', teamA_id: null, teamB_id: null, scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T12:30:00Z', category_id: 'cat-w', stage: 'qf', placeholderA: 'Ladies QF 1' }
    ],
    events: JSON.parse(localStorage.getItem('KU_EVENTS')) || [],
    users: JSON.parse(localStorage.getItem('KU_USERS')) || [
        { email: 'ku@admin.com', password: 'edition26', role: 'admin' }
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
        if (!MOCK_DATA.players) MOCK_DATA.players = [];
        MOCK_DATA.players.push(newPlayer);
        api.persist();
        return { data: newPlayer };
    },
    deletePlayer: async (id) => {
        const idx = MOCK_DATA.players.findIndex(p => p.id === id);
        if (idx !== -1) {
            MOCK_DATA.players.splice(idx, 1);
            api.persist();
            return { data: true };
        }
        return { error: 'Player not found' };
    },
    updatePlayer: async (id, data) => {
        const p = MOCK_DATA.players.find(x => x.id === id);
        if (p) {
            Object.assign(p, data);
            api.persist();
            return { data: p };
        }
        return { error: 'Player not found' };
    },
    scheduleMatch: async (match) => {
        // Time Overlapping Check
        const newTime = new Date(match.time).getTime();
        const newDurationMs = (match.duration || 60) * 60000;
        const newEndTime = newTime + newDurationMs;
        
        const pitchMatches = MOCK_DATA.matches.filter(m => m.pitch === match.pitch && m.status !== 'finished');
        
        for (let pm of pitchMatches) {
            const extTime = new Date(pm.time).getTime();
            const extDurationMs = (pm.duration || 60) * 60000;
            const extEndTime = extTime + extDurationMs;
            
            // Overlap condition:
            // new match starts before existing match ends AND existing match starts before new match ends
            if (newTime < extEndTime && extTime < newEndTime) {
                return { error: 'Time Overlap: Another match is scheduled on this pitch at a conflicting time.' };
            }
        }

        const newMatch = { ...match, id: 'm' + Date.now(), scoreA: 0, scoreB: 0, status: 'upcoming' };
        MOCK_DATA.matches.push(newMatch);
        api.persist();
        return { data: newMatch };
    },
    updateMatch: async (id, data) => {
        const match = MOCK_DATA.matches.find(m => m.id === id);
        if (match) {
            Object.assign(match, data);
            api.persist();
            return { data: match };
        }
        return { error: 'Match not found' };
    },
    finalizeMatch: async (id, scoreA, scoreB, events = []) => {
        const match = MOCK_DATA.matches.find(m => m.id === id);
        if (match) {
            match.scoreA = parseInt(scoreA);
            match.scoreB = parseInt(scoreB);
            match.status = 'finished';
            MOCK_DATA.events.push(...events.map(e => ({ ...e, match_id: id })));
            
            // Auto-Next Logic: Set the next upcoming game on this pitch to LIVE
            // Safety Guard: Only auto-start if the finalized match was the actual current live/next match
            const next = MOCK_DATA.matches
                .filter(m => m.pitch === match.pitch && m.status === 'upcoming')
                .sort((a,b) => new Date(a.time) - new Date(b.time))[0];
            
            if (next) {
                const now = new Date();
                const nextTime = new Date(next.time);
                // Only auto-start if we are within 30 mins of the next game's start time
                // This prevents finishing an 8am game from accidentally starting a 4pm game
                const diffMinutes = (nextTime - now) / 60000;
                if (diffMinutes < 30) {
                    next.status = 'live';
                }
            }
            
            api.persist();
        }
        return { data: match };
    },
    delayMatch: async (id, minutes) => {
        const match = MOCK_DATA.matches.find(m => m.id === id);
        if (!match) return { error: 'Match not found' };
        
        const shiftMs = parseInt(minutes) * 60000;
        const pitch = match.pitch;
        const startTime = new Date(match.time).getTime();

        // Shift this and all SUBSEQUENT upcoming matches on this pitch
        MOCK_DATA.matches.forEach(m => {
            if (m.pitch === pitch && (m.status === 'upcoming' || m.id === id)) {
                const t = new Date(m.time).getTime();
                if (t >= startTime) {
                    m.time = new Date(t + shiftMs).toISOString();
                }
            }
        });
        api.persist();
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
        if (action === 'create') {
            const exists = MOCK_DATA.users.find(u => u.email === email);
            if (!exists) {
                MOCK_DATA.users.push({ email, password: pass, role: role || 'staff' });
            } else {
                exists.password = pass; // Update password if already exists
                exists.role = role || exists.role;
            }
        }
        else MOCK_DATA.users = MOCK_DATA.users.filter(u => u.email !== email);
        api.persist();
    },
    updateUser: async (oldEmail, newEmail, password, role) => {
        const user = MOCK_DATA.users.find(u => u.email === oldEmail);
        if (user) {
            user.email = newEmail;
            user.password = password;
            user.role = role;
            api.persist();
            return { data: user };
        }
        return { error: 'User not found' };
    },
    getUsers: async () => {
        return { data: MOCK_DATA.users };
    }
};
