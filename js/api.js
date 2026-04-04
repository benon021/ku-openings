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
        // PITCH 1 - FULL SCHED
        { id: 'm1', teamA_id: 'tm-b2', teamB_id: 'tm-b4', scoreA: 0, scoreB: 0, status: 'live', pitch: 'Pitch 1', time: '2026-04-04T06:00:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Q2' },
        { id: 'm2', teamA_id: 'tm-a1', teamB_id: 'tm-a3', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T06:15:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm3', teamA_id: 'tw-a1', teamB_id: 'tw-a2', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T06:30:00Z', category_id: 'cat-w', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm4', teamA_id: 'tm-b2', teamB_id: 'tm-b3', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T06:45:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm5', teamA_id: 'tm-a2', teamB_id: 'tm-a3', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T07:00:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm6', teamA_id: 'tw-b2', teamB_id: 'tw-b3', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T07:15:00Z', category_id: 'cat-w', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm7', teamA_id: 'tm-b1', teamB_id: 'tm-b4', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T07:30:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm8', teamA_id: 'tm-a1', teamB_id: 'tm-a4', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T07:45:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        
        // PITCH 2 - FULL SCHED
        { id: 'm101', teamA_id: 'tm-d1', teamB_id: 'tm-d2', scoreA: 0, scoreB: 0, status: 'live', pitch: 'Pitch 2', time: '2026-04-04T06:00:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Q3' },
        { id: 'm102', teamA_id: 'tm-e1', teamB_id: 'tm-e2', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T06:15:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm103', teamA_id: 'tw-c1', teamB_id: 'tw-c2', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T06:30:00Z', category_id: 'cat-w', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm104', teamA_id: 'tm-g1', teamB_id: 'tm-g2', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T06:45:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm105', teamA_id: 'tm-d2', teamB_id: 'tm-d3', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T07:00:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm106', teamA_id: 'tw-c1', teamB_id: 'tw-c4', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T07:15:00Z', category_id: 'cat-w', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm107', teamA_id: 'tm-f3', teamB_id: 'tm-f4', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T07:30:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm108', teamA_id: 'tm-d3', teamB_id: 'tm-d4', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T07:45:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm109', teamA_id: 'tw-c2', teamB_id: 'tw-c3', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T08:00:00Z', category_id: 'cat-w', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm110', teamA_id: 'tm-d1', teamB_id: 'tm-d3', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T08:15:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm111', teamA_id: 'tm-e1', teamB_id: 'tm-e3', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T08:30:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm112', teamA_id: 'tw-c3', teamB_id: 'tw-c4', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T08:45:00Z', category_id: 'cat-w', stage: 'pool', current_quarter: 'Not Started' },
        { id: 'm113', teamA_id: 'tm-e1', teamB_id: 'tm-e4', scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 2', time: '2026-04-04T09:00:00Z', category_id: 'cat-m', stage: 'pool', current_quarter: 'Not Started' },

        // KNOCKOUTS
        { id: 'mk-r16-1', teamA_id: null, teamB_id: null, scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T11:00:00Z', category_id: 'cat-m', stage: 'r16', placeholderA: 'Winner A', placeholderB: 'Runner Up G' },
        { id: 'mk-qf-1', teamA_id: null, teamB_id: null, scoreA: 0, scoreB: 0, status: 'upcoming', pitch: 'Pitch 1', time: '2026-04-04T12:30:00Z', category_id: 'cat-w', stage: 'qf', placeholderA: 'Winner A', placeholderB: 'Runner Up C' }
    ],
    events: JSON.parse(localStorage.getItem('KU_EVENTS')) || [],
    users: JSON.parse(localStorage.getItem('KU_USERS')) || [
        { email: 'ku@admin.com', password: 'edition26', role: 'admin' }
    ]
};


const api = {
    useDemo: false, // Transitioned to Cloud Persistence with Supabase
    
    // ⚙️ HELPERS
    persist: () => {
        // Local persistence disabled; transitioning to Supabase.
    },

    // 🚀 CLOUD SEEDING UTILITY (Run from console: api.seedDatabase())
    seedDatabase: async () => {
        console.log("Starting Cloud Migration...");
        const { data: existing } = await window.supabaseClient.from('categories').select('id');
        if (existing && existing.length > 0) return console.warn("Database already contains data. Migration aborted.");

        // 1. Categories
        const { data: cats } = await window.supabaseClient.from('categories').insert(MOCK_DATA.categories).select();
        console.log("Categories Migrated.");

        // 2. Pools
        const { data: pools } = await window.supabaseClient.from('pools').insert(MOCK_DATA.pools).select();
        console.log("Pools Migrated.");

        // 3. Teams
        const { data: teams } = await window.supabaseClient.from('teams').insert(MOCK_DATA.teams.map(t => ({
            id: t.id,
            name: t.name,
            category_id: t.category_id,
            pool_id: t.pool_id,
            logo_url: t.logo
        }))).select();
        console.log("Teams Migrated.");

        // 4. Matches
        const { data: matches } = await window.supabaseClient.from('matches').insert(MOCK_DATA.matches.map(m => ({
            id: m.id,
            teamA_id: m.teamA_id,
            teamB_id: m.teamB_id,
            category_id: m.category_id,
            pool_id: m.pool_id,
            time: m.time,
            pitch: m.pitch,
            status: m.status,
            scoreA: m.scoreA,
            scoreB: m.scoreB,
            current_quarter: m.current_quarter
        }))).select();
        console.log("Matches Migrated.");

        console.log("Migration Complete! Refresh the page.");
    },

    // 1️⃣ CORE GETTERS
    getCategories: async () => await window.supabaseClient.from('categories').select('*'),
    getPools: async (catId) => {
        let q = window.supabaseClient.from('pools').select('*');
        if (catId && catId !== 'all') q = q.eq('category_id', catId);
        return await q;
    },
    getTeams: async (catId) => {
        let q = window.supabaseClient.from('teams').select('*');
        if (catId && catId !== 'all') q = q.eq('category_id', catId);
        const { data, error } = await q;
        return { data: data ? data.map(t => ({ ...t, logo: t.logo_url })) : [], error };
    },
    getPlayers: async (teamId) => {
        let q = window.supabaseClient.from('players').select('*');
        if (teamId) q = q.eq('team_id', teamId);
        return await q;
    },
    getMatches: async (catId, pitchId = 'all') => {
        let q = window.supabaseClient.from('matches').select('*, teamA:teams!teamA_id(*), teamB:teams!teamB_id(*)');
        if (catId && catId !== 'all') q = q.eq('category_id', catId);
        if (pitchId && pitchId !== 'all') q = q.eq('pitch', pitchId);
        const { data, error } = await q.order('time');
        return { data: data ? data.map(m => ({ ...m, teamA: { ...m.teamA, logo: m.teamA?.logo_url }, teamB: { ...m.teamB, logo: m.teamB?.logo_url } })) : [], error };
    },
    getMatchEvents: async (matchId) => await window.supabaseClient.from('events').select('*').eq('match_id', matchId),
    
    // 2️⃣ TOURNAMENT INTELLIGENCE
    getStandings: async (poolId) => {
        const { data: teams } = await window.supabaseClient.from('teams').select('*').eq('pool_id', poolId);
        const { data: matches } = await window.supabaseClient.from('matches').select('*').eq('status', 'finished');
        
        let standings = (teams || []).map(t => {
            let p = 0, w = 0, d = 0, l = 0, gf = 0, ga = 0;
            const tMatches = (matches || []).filter(m => m.teamA_id === t.id || m.teamB_id === t.id);
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
            return { name: t.name, p, w, d, l, gf, ga, gd: gf-ga, pts: (w*3) + d };
        });

        standings.sort((a,b) => (b.pts !== a.pts) ? b.pts - a.pts : b.gd - a.gd);
        standings.forEach((s,i) => s.position = i > 0 && s.pts === standings[i-1].pts && s.gd === standings[i-1].gd ? standings[i-1].position : i + 1);
        return { data: standings };
    },

    getTopScorers: async (catId) => {
        const { data } = await window.supabaseClient.from('events').select('player_id, players(name)').eq('type', 'goal');
        const counts = {};
        (data || []).forEach(e => {
            const name = e.players?.name || 'Unknown';
            counts[name] = (counts[name] || 0) + 1;
        });
        return { data: Object.entries(counts).map(([name, goals]) => ({ name, goals })).sort((a,b) => b.goals - a.goals) };
    },

    getCardsReport: async (catId) => {
        const report = { yellow: 0, red: 0, green: 0 };
        MOCK_DATA.events.filter(e => e.type === 'card').forEach(e => report[e.card_type]++);
        return { data: report };
    },

    // 3️⃣ MANAGEMENT CRUD (Staff/Admin)
    createPool: async (pool) => await window.supabaseClient.from('pools').insert(pool).select().single(),
    createTeam: async (team) => await window.supabaseClient.from('teams').insert({
        ...team,
        logo_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(team.name)}`
    }).select().single(),
    addPlayer: async (player) => await window.supabaseClient.from('players').insert(player).select().single(),
    deletePlayer: async (id) => await window.supabaseClient.from('players').delete().eq('id', id),
    updatePlayer: async (id, data) => await window.supabaseClient.from('players').update(data).eq('id', id).select().single(),
    
    scheduleMatch: async (match) => {
        // Simple insert for schedule. Overlap checks can be moved to Postgres Triggers for true field production.
        return await window.supabaseClient.from('matches').insert({ ...match, status: 'upcoming' }).select().single();
    },
    updateMatch: async (id, data) => await window.supabaseClient.from('matches').update(data).eq('id', id).select().single(),
    
    finalizeMatch: async (id, scoreA, scoreB, events = []) => {
        // Update Match status and scores
        await window.supabaseClient.from('matches').update({
            scoreA: parseInt(scoreA),
            scoreB: parseInt(scoreB),
            status: 'finished'
        }).eq('id', id);

        // Record goals/cards in the database
        if (events.length) {
            await window.supabaseClient.from('events').insert(events.map(e => ({ ...e, match_id: id })));
        }

        // Auto-Next Logic (Trigger next game to LIVE if scheduled close to now)
        const { data: nextMatch } = await api.getMatches('all');
        const next = nextMatch?.filter(m => m.status === 'upcoming').sort((a,b) => new Date(a.time) - new Date(b.time))[0];
        
        if (next) {
            const now = new Date();
            const nextTime = new Date(next.time);
            if ((nextTime - now) / 60000 < 30) {
                await window.supabaseClient.from('matches').update({ status: 'live' }).eq('id', next.id);
            }
        }
        return { data: true };
    },
    
    delayMatch: async (id, minutes) => {
        const { data: match } = await window.supabaseClient.from('matches').select('*').eq('id', id).single();
        if (!match) return { error: 'Match not found' };
        
        const shiftMs = parseInt(minutes) * 60000;
        const { data: pitchMatches } = await window.supabaseClient.from('matches')
            .select('*')
            .eq('pitch', match.pitch)
            .gte('time', match.time);

        const updates = (pitchMatches || []).map(m => ({
            id: m.id,
            time: new Date(new Date(m.time).getTime() + shiftMs).toISOString()
        }));

        for (const u of updates) {
            await window.supabaseClient.from('matches').update({ time: u.time }).eq('id', u.id);
        }
        return { data: true };
    },
    
    // 4️⃣ ADMIN USER CONTROL
    manageStaff: async (email, pass, role, action = 'create') => {
        // In a true Supabase app, we'd use Supabase Auth + Profiles. 
        // For the UI Prototype, we'll use a 'staff' table or proceed with auth.js migration.
        console.warn("Manage Staff via Profiles table implemented in Supabase.");
    },
    getUsers: async () => await window.supabaseClient.from('profiles').select('*')
};
