import urllib.request
import json
import ssl

# --- CONFIG ---
URL = "https://vfykbtwesjrmitbvyjkv.supabase.co/rest/v1"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmeWtidHdlc2pybWl0YnZ5amt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMzgyMTcsImV4cCI6MjA5MDgxNDIxN30.AHPdZ_scqvOI3c9GEO22gK93ceQa4f0ai2dopZZfY74"

HEADERS = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def push(table, data):
    print(f"Pushing {len(data)} items to {table}...")
    req = urllib.request.Request(f"{URL}/{table}", data=json.dumps(data).encode(), headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req, context=ctx) as f:
            print(f"  {table} OK!")
    except Exception as e:
        print(f"  {table} ERROR: {e}")

# --- DATA ---
categories = [{"id": "cat-m", "name": "Men"}, {"id": "cat-w", "name": "Ladies"}]

pools = [
    {"id": "p-m-a", "name": "A", "category_id": "cat-m"},
    {"id": "p-m-b", "name": "B", "category_id": "cat-m"},
    {"id": "p-m-c", "name": "C", "category_id": "cat-m"},
    {"id": "p-m-d", "name": "D", "category_id": "cat-m"},
    {"id": "p-m-e", "name": "E", "category_id": "cat-m"},
    {"id": "p-m-f", "name": "F", "category_id": "cat-m"},
    {"id": "p-m-g", "name": "G", "category_id": "cat-m"},
    {"id": "p-w-a", "name": "A", "category_id": "cat-w"},
    {"id": "p-w-b", "name": "B", "category_id": "cat-w"},
    {"id": "p-w-c", "name": "C", "category_id": "cat-w"},
    {"id": "p-w-d", "name": "D", "category_id": "cat-w"}
]

# (Truncated list of teams for the script - full 71 teams)
teams_raw = [
    {"id": "tw-a1", "name": "TWINKLE B", "category_id": "cat-w", "pool_id": "p-w-a"},
    {"id": "tw-a2", "name": "USIU", "category_id": "cat-w", "pool_id": "p-w-a"},
    {"id": "tw-a3", "name": "ROYAL NOMADS", "category_id": "cat-w", "pool_id": "p-w-a"},
    {"id": "tw-a4", "name": "WILD CATS", "category_id": "cat-w", "pool_id": "p-w-a"},
    {"id": "tw-b1", "name": "AMIRA", "category_id": "cat-w", "pool_id": "p-w-b"},
    {"id": "tw-b2", "name": "REBOUND", "category_id": "cat-w", "pool_id": "p-w-b"},
    {"id": "tw-b3", "name": "VIGILANTEZ", "category_id": "cat-w", "pool_id": "p-w-b"},
    {"id": "tw-c1", "name": "AMIRA MAMUUS", "category_id": "cat-w", "pool_id": "p-w-c"},
    {"id": "tw-c2", "name": "SLIDERS -A", "category_id": "cat-w", "pool_id": "p-w-c"},
    {"id": "tw-c3", "name": "TWINKLE -A", "category_id": "cat-w", "pool_id": "p-w-c"},
    {"id": "tw-c4", "name": "BLAZERS", "category_id": "cat-w", "pool_id": "p-w-c"},
    {"id": "tw-d1", "name": "TITANS", "category_id": "cat-w", "pool_id": "p-w-d"},
    {"id": "tw-d2", "name": "MASTERS SLADES", "category_id": "cat-w", "pool_id": "p-w-d"},
    {"id": "tw-d3", "name": "GHF", "category_id": "cat-w", "pool_id": "p-w-d"},
    {"id": "tm-a1", "name": "MASHUJAA -A", "category_id": "cat-m", "pool_id": "p-m-a"},
    {"id": "tm-a2", "name": "TGG", "category_id": "cat-m", "pool_id": "p-m-a"},
    {"id": "tm-a3", "name": "AVENGERS", "category_id": "cat-m", "pool_id": "p-m-a"},
    {"id": "tm-a4", "name": "PARKLANDS", "category_id": "cat-m", "pool_id": "p-m-a"},
    {"id": "tm-b1", "name": "MEXIMED DVT", "category_id": "cat-m", "pool_id": "p-m-b"},
    {"id": "tm-b2", "name": "PANTHERS", "category_id": "cat-m", "pool_id": "p-m-b"},
    {"id": "tm-b3", "name": "TUKO KADI", "category_id": "cat-m", "pool_id": "p-m-b"},
    {"id": "tm-b4", "name": "VULTURES -A", "category_id": "cat-m", "pool_id": "p-m-b"},
    {"id": "tm-c1", "name": "MASHUJAA -B", "category_id": "cat-m", "pool_id": "p-m-c"},
    {"id": "tm-c2", "name": "MEXIMED PARKROAD", "category_id": "cat-m", "pool_id": "p-m-c"},
    {"id": "tm-c3", "name": "DEKUT", "category_id": "cat-m", "pool_id": "p-m-c"},
    {"id": "tm-c4", "name": "1729", "category_id": "cat-m", "pool_id": "p-m-c"},
    {"id": "tm-d1", "name": "IRAN", "category_id": "cat-m", "pool_id": "p-m-d"},
    {"id": "tm-d2", "name": "REEBOK", "category_id": "cat-m", "pool_id": "p-m-d"},
    {"id": "tm-d3", "name": "TROJANS", "category_id": "cat-m", "pool_id": "p-m-d"},
    {"id": "tm-d4", "name": "KYU", "category_id": "cat-m", "pool_id": "p-m-d"},
    {"id": "tm-e1", "name": "WOZA WOZA", "category_id": "cat-m", "pool_id": "p-m-e"},
    {"id": "tm-e2", "name": "IMPALA -B", "category_id": "cat-m", "pool_id": "p-m-e"},
    {"id": "tm-e3", "name": "GORILLAS", "category_id": "cat-m", "pool_id": "p-m-e"},
    {"id": "tm-e4", "name": "MEXIMED -A", "category_id": "cat-m", "pool_id": "p-m-e"},
    {"id": "tm-f1", "name": "WANG'DU", "category_id": "cat-m", "pool_id": "p-m-f"},
    {"id": "tm-f2", "name": "IMPALA -A", "category_id": "cat-m", "pool_id": "p-m-f"},
    {"id": "tm-f3", "name": "WEKA MAWE", "category_id": "cat-m", "pool_id": "p-m-f"},
    {"id": "tm-f4", "name": "GREENSHARKS", "category_id": "cat-m", "pool_id": "p-m-f"},
    {"id": "tm-g1", "name": "WAZALENDO", "category_id": "cat-m", "pool_id": "p-m-g"},
    {"id": "tm-g2", "name": "ARCHBEACON", "category_id": "cat-m", "pool_id": "p-m-g"},
    {"id": "tm-g3", "name": "VULTURES -B", "category_id": "cat-m", "pool_id": "p-m-g"}
]
teams = [{"id": t["id"], "name": t["name"], "category_id": t["category_id"], "pool_id": t["pool_id"], "logo_url": f"https://api.dicebear.com/7.x/identicon/svg?seed={t['name']}"} for t in teams_raw]

matches = [
    {"id": "m1", "teamA_id": "tm-b2", "teamB_id": "tm-b4", "scoreA": 0, "scoreB": 0, "status": "live", "pitch": "Pitch 1", "time": "2026-04-04T06:00:00Z", "category_id": "cat-m", "current_quarter": "Q1"},
    {"id": "m2", "teamA_id": "tm-a1", "teamB_id": "tm-a3", "scoreA": 0, "scoreB": 0, "status": "upcoming", "pitch": "Pitch 1", "time": "2026-04-04T06:15:00Z", "category_id": "cat-m", "current_quarter": "Not Started"},
    {"id": "m3", "teamA_id": "tw-a1", "teamB_id": "tw-a2", "scoreA": 0, "scoreB": 0, "status": "upcoming", "pitch": "Pitch 1", "time": "2026-04-04T06:30:00Z", "category_id": "cat-w", "current_quarter": "Not Started"},
    {"id": "m101", "teamA_id": "tm-d1", "teamB_id": "tm-d2", "scoreA": 0, "scoreB": 0, "status": "live", "pitch": "Pitch 2", "time": "2026-04-04T06:00:00Z", "category_id": "cat-m", "current_quarter": "Q2"}
]

# --- EXECUTION ---
push("categories", categories)
push("pools", pools)
push("teams", teams)
push("matches", matches)

print("Migration Complete.")
