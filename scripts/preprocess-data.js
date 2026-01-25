import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'src', 'data', 'Basketballs_leagues_files');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'data');

const normalizeHeader = (header) =>
  header.toLowerCase().replace(/[^a-z0-9]/g, '');

const findKey = (keys, candidates) => {
  const normalizedKeys = keys.map((key) => ({
    original: key,
    norm: normalizeHeader(key),
  }));
  const candidateNorms = candidates.map(normalizeHeader);

  const match = normalizedKeys.find((k) => candidateNorms.includes(k.norm));
  return match?.original;
};

/**
 * Parse "Player Nationality" values like "Nationality: Denmark" or "Nationality: Belgium".
 * Strips the "Nationality: " prefix (case-insensitive) and returns the country/countries.
 */
const parseNationality = (raw) => {
  if (raw == null || raw === '') return '';
  const s = String(raw).trim();
  const m = s.match(/^Nationality:\s*(.+)$/i);
  return m ? m[1].trim() : s;
};

console.log('Starting data preprocessing...');

try {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs
    .readdirSync(DATA_DIR)
    .filter(
      (file) =>
        file.toLowerCase().endsWith('.xlsx') && !file.startsWith('~$')
    );

  console.log(`Found ${files.length} Excel files to process`);

  const leagues = [];
  const teams = [];
  const players = [];

  const leagueMap = new Map();
  const teamMap = new Map();

  let nextLeagueId = 1;
  let nextTeamId = 1;
  let nextPlayerId = 1;

  for (const file of files) {
    console.log(`Processing ${file}...`);
    const filePath = path.join(DATA_DIR, file);

    let workbook;
    try {
      const fileBuffer = fs.readFileSync(filePath);
      workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
      continue;
    }

    const preferredSheets = ['Advanced Table', 'Advanced', 'AdvancedTable'];
    const sheetName =
      preferredSheets.find((name) => workbook.SheetNames.includes(name)) ??
      workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    const rows = XLSX.utils.sheet_to_json(sheet, {
      defval: null,
    });

    if (!rows.length) continue;

    const headers = Object.keys(rows[0]);

    const playerNameKey = findKey(headers, ['Player', 'Player Name', 'Name']);
    const positionKey = findKey(headers, ['Pos', 'Position', 'Player Position']);
    const heightKey = findKey(headers, ['Player Height', 'Height', 'Ht']);
    const weightKey = findKey(headers, ['Player Weight', 'Weight', 'Wt']);
    const ageKey = findKey(headers, ['Age']);
    const seasonKey = findKey(headers, ['Season', 'Year']);
    const teamKey = findKey(headers, ['Team', 'Club']);
    const leagueKey = findKey(headers, ['League', 'Competition']);
    const countryKey = findKey(headers, ['Country', 'Nationality', 'Nat', 'Player Nationality']);
    const gpKey = findKey(headers, ['GP', 'Games Played']);
    const gsKey = findKey(headers, ['GS', 'Games Started']);
    const mpKey = findKey(headers, ['MP', 'MIN', 'Minutes', 'Minutes/G']);
    const ptsKey = findKey(headers, ['PTS', 'PTS/G', 'PPG']);
    const rebKey = findKey(headers, ['TRB', 'REB', 'REB/G', 'Reb']);
    const astKey = findKey(headers, ['AST', 'AST/G']);
    const stlKey = findKey(headers, ['STL', 'STL/G']);
    const blkKey = findKey(headers, ['BLK', 'BLK/G']);
    const tovKey = findKey(headers, ['TOV', 'TOV/G', 'TO']);
    const tsKey = findKey(headers, ['TS%', 'TS']);
    const efgKey = findKey(headers, ['eFG%', 'eFG']);
    const orbKey = findKey(headers, ['ORB%', 'ORB']);
    const drbKey = findKey(headers, ['DRB%', 'DRB']);
    const trbKey = findKey(headers, ['TRB%', 'TRB%']);
    const astPctKey = findKey(headers, ['AST%', 'AST%']);
    const tovPctKey = findKey(headers, ['TOV%', 'TOV%']);
    const stlPctKey = findKey(headers, ['STL%', 'STL%']);
    const blkPctKey = findKey(headers, ['BLK%', 'BLK%']);
    const usgKey = findKey(headers, ['USG%', 'USG']);
    const ortgKey = findKey(headers, ['ORtg']);
    const drtgKey = findKey(headers, ['DRtg']);
    const perKey = findKey(headers, ['PER']);

    const baseLeagueName =
      rows[0][leagueKey ?? ''] ??
      path.basename(file, path.extname(file));

    const leagueName = String(baseLeagueName || '').trim() || 'Unknown League';

    let leagueId;
    if (leagueMap.has(leagueName)) {
      leagueId = leagueMap.get(leagueName);
    } else {
      leagueId = nextLeagueId++;
      leagueMap.set(leagueName, leagueId);

      const seasonsSet = new Set();
      if (seasonKey) {
        rows.forEach((row) => {
          const seasonVal = row[seasonKey];
          if (seasonVal != null && seasonVal !== '') {
            const parsed = parseInt(String(seasonVal), 10);
            if (!Number.isNaN(parsed)) seasonsSet.add(parsed);
          }
        });
      }

      const seasonsArray = Array.from(seasonsSet).map((season) => ({
        season,
        start: '',
        end: '',
      }));

      leagues.push({
        id: leagueId,
        name: leagueName,
        type: 'League',
        logo: '',
        country: {
          id: 0,
          name: '',
          code: '',
          flag: '',
        },
        seasons: seasonsArray.length ? seasonsArray : [],
      });
    }

    for (const row of rows) {
      const rawName = playerNameKey ? row[playerNameKey] : null;
      if (!rawName) continue;

      const name = String(rawName).trim();
      if (!name) continue;

      const teamName = teamKey ? String(row[teamKey] ?? '').trim() : '';
      const countryRaw = countryKey ? row[countryKey] : null;
      const country = parseNationality(countryRaw);
      const position = positionKey
        ? String(row[positionKey] ?? '').trim()
        : undefined;
      const height = heightKey
        ? (row[heightKey] != null && row[heightKey] !== '' ? String(row[heightKey]).trim() : undefined)
        : undefined;
      const weightRaw = weightKey ? row[weightKey] : null;
      const weight = weightRaw != null && weightRaw !== ''
        ? (typeof weightRaw === 'number' ? String(weightRaw) : String(weightRaw).trim())
        : undefined;
      const ageRaw = ageKey ? row[ageKey] : null;
      const age =
        ageRaw != null && ageRaw !== '' && !Number.isNaN(Number(ageRaw))
          ? Number(ageRaw)
          : undefined;

      const seasonVal = seasonKey ? row[seasonKey] : null;
      const season =
        seasonVal != null && seasonVal !== '' ? String(seasonVal) : '';

      const num = (key) => {
        if (!key) return undefined;
        const raw = row[key];
        if (raw == null || raw === '') return undefined;
        const n = Number(raw);
        return Number.isNaN(n) ? undefined : n;
      };

      let teamId;
      const teamKeyMap = `${leagueId}::${teamName || 'Unknown Team'}`;

      if (teamMap.has(teamKeyMap)) {
        teamId = teamMap.get(teamKeyMap);
      } else {
        teamId = nextTeamId++;
        teamMap.set(teamKeyMap, teamId);

        teams.push({
          id: teamId,
          name: teamName || 'Unknown Team',
          logo: '',
          national: false,
          season: season || '',
          country: {
            id: 0,
            name: country || '',
            code: '',
            flag: '',
          },
          leagueId,
        });
      }

      const player = {
        id: nextPlayerId++,
        name,
        position,
        age,
        country: country || undefined,
        team: teamName || undefined,
        number: undefined,
        photo: undefined,
        isInWatchlist: false,
        isInTeam: false,
        priority: undefined,
        pinned: undefined,
        salary: undefined,
        contract: undefined,
        image: undefined,
        height,
        weight,
        season,
        gamesPlayed: num(gpKey),
        gamesStarted: num(gsKey),
        minutesPerGame: num(mpKey),
        pointsPerGame: num(ptsKey),
        reboundsPerGame: num(rebKey),
        assistsPerGame: num(astKey),
        stealsPerGame: num(stlKey),
        blocksPerGame: num(blkKey),
        turnoversPerGame: num(tovKey),
        tsPercent: num(tsKey),
        efgPercent: num(efgKey),
        orbPercent: num(orbKey),
        drbPercent: num(drbKey),
        trbPercent: num(trbKey),
        astPercent: num(astPctKey),
        tovPercent: num(tovPctKey),
        stlPercent: num(stlPctKey),
        blkPercent: num(blkPctKey),
        usgPercent: num(usgKey),
        offensiveRating: num(ortgKey),
        defensiveRating: num(drtgKey),
        playerEfficiencyRating: num(perKey),
        leagueId,
        teamId,
      };

      players.push(player);
    }
  }

  console.log(`Processed ${leagues.length} leagues, ${teams.length} teams, ${players.length} players`);

  // Write JSON files
  fs.writeFileSync(path.join(OUTPUT_DIR, 'leagues.json'), JSON.stringify(leagues, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'teams.json'), JSON.stringify(teams, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'players.json'), JSON.stringify(players, null, 2));

  console.log('Data preprocessing completed successfully!');

} catch (error) {
  console.error('Error during data preprocessing:', error);
  process.exit(1);
}
