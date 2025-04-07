export const LEAGUES_NAMES: Record<number, string> = {
  1: "Australia: NBL",
  59: "Kosovo: Superliga",
  217: "Austria: Superliga",
  275: "Venezuela: Superliga",
  388: "Albania: Superliga",
  374: "Belgium: Pro Basketball League",
  30: "Croatia: A1 Liga",
  32: "Czech Republic: NBL",
  36: "Estonia: Korvpalli Meistriliiga",
  2: "France: LNB",
  8: "France: Pro B",
  40: "Germany: BBL",
  42: "Germany: Pro A",
  45: "Greece: A1",
  46: "Hungary: NB I A",
  51: "Israel: Super league",
  52: "Italy: Lega A",
  146: "Latvia: LBL",
  60: "Lithuania: LKL",
  61: "Lithuania: NKL",
  65: "Netherlands: DBL",
  72: "Poland: Energa basket liga",
  82: "Russia: VTB",
  81: "Russia: Super League",
  86: "Serbia: Super league",
  87: "Slovakia: Extraliga",
  117: "Spain: ACB",
  95: "Spain: LEB Oro",
  102: "Turkey: TBL",
  104: "Turkey: Super Ligi",
  108: "United Kingdom: BBL",
  123: "Bosnia and Herzegovina: Prvenstvo BiH",
  113: "Bulgaria: NBL",
  115: "Cyprus: Division A",
  34: "Denmark: Basketligaen",
  37: "Finland: Korisliiga",
  48: "Iceland: Premier League",
  56: "Japan: B league",
  249: "Luxembourg: Total league",
  63: "Mexico: LNBP",
  68: "Norway: BLNO",
  74: "Portugal: LPB",
  78: "Romania: Divizia A",
  89: "Slovenia: Liga Nova KBM",
  93: "Sweden: Basketligan",
  100: "Switzerland: LNA",
};

export const LEAGUES_IDS = [
  1, 59, 217, 275, 388, 374, 30, 32, 36, 2, 8, 40, 42, 45, 46, 51, 52, 146, 60,
  61, 65, 72, 82, 81, 86, 87, 117, 95, 102, 104, 108, 12, 20, 116, 197, 120,
  194, 202, 201, 198, 368, 369, 204, 281, 192, 123, 113, 115, 34, 37, 48, 56, 
  249, 63, 68, 74, 78, 89, 93, 100,
];

export const LEAGUES: Record<number, { name?: string; sportsRadarId?: string }> = {
  1: { name: "Australia: NBL", sportsRadarId: "sr:competition:1524" },
  59: { name: "Kosovo: Superliga", sportsRadarId: undefined },
  217: { name: "Austria: Superliga", sportsRadarId: "sr:competition:297" },
  275: { name: "Venezuela: Superliga", sportsRadarId: "sr:competition:34024" },
  388: { name: "Albania: Superliga", sportsRadarId: undefined },
  374: { name: "Belgium: Pro Basketball League", sportsRadarId: 'sr:competition:1934' },
  30: { name: "Croatia: A1 Liga", sportsRadarId: "sr:competition:579" },
  32: { name: "Czech Republic: NBL", sportsRadarId: "	sr:competition:250" },
  36: { name: "Estonia: Korvpalli Meistriliiga", sportsRadarId: undefined },
  2: { name: "France: LNB", sportsRadarId: "sr:competition:405" },
  8: { name: "France: Pro B", sportsRadarId: "sr:competition:1189" },
  40: { name: "Germany: BBL", sportsRadarId: "sr:competition:227" },
  42: { name: "Germany: Pro A", sportsRadarId: "sr:competition:1165" },
  45: { name: "Greece: A1", sportsRadarId: 'sr:competition:304' },
  46: { name: "Hungary: NB I A", sportsRadarId: "sr:competition:20132" },
  51: { name: "Israel: Super league", sportsRadarId: "sr:competition:1197" },
  52: { name: "Italy: Lega A", sportsRadarId: 'sr:competition:262' },
  146: { name: "Latvia: LBL", sportsRadarId: "sr:competition:982" },
  60: { name: "Lithuania: LKL", sportsRadarId: "sr:competition:975" },
  61: { name: "Lithuania: NKL", sportsRadarId: "sr:competition:26450" },
  65: { name: "Netherlands: DBL", sportsRadarId: undefined },
  72: { name: "Poland: Energa basket liga", sportsRadarId: 'sr:competition:26662' },
  82: { name: "Russia: VTB", sportsRadarId: undefined },
  81: { name: "Russia: Super League", sportsRadarId: undefined },
  86: { name: "Serbia: Super league", sportsRadarId: 'sr:competition:754' },
  87: { name: "Slovakia: Extraliga", sportsRadarId: "sr:competition:1410" },
  117: { name: "Spain: ACB", sportsRadarId: "sr:competition:264" },
  95: { name: "Spain: LEB Oro", sportsRadarId: 'sr:competition:1514' },
  102: { name: "Turkey: TBL", sportsRadarId: "sr:competition:35430" },
  104: { name: "Turkey: Super Ligi", sportsRadarId: "sr:competition:519" },
  108: { name: "United Kingdom: BBL", sportsRadarId: "sr:competition:230" },
  123: { name: "Bosnia and Herzegovina: Prvenstvo BiH", sportsRadarId: 'sr:competition:30616' },
  113: { name: "Bulgaria: NBL", sportsRadarId: "sr:competition:1920" },
  115: { name: "Cyprus: Division A", sportsRadarId: "sr:competition:14588" },
  34: { name: "Denmark: Basketligaen", sportsRadarId: "sr:competition:843" },
  37: { name: "Finland: Korisliiga", sportsRadarId: "sr:competition:226" },
  48: { name: "Iceland: Premier League", sportsRadarId: 'sr:competition:14455' },
  56: { name: "Japan: B league", sportsRadarId: "sr:competition:1502" },
  249: { name: "Luxembourg: Total league", sportsRadarId: undefined },
  63: { name: "Mexico: LNBP", sportsRadarId: "sr:competition:1472" },
  68: { name: "Norway: BLNO", sportsRadarId: "sr:competition:26586" },
  74: { name: "Portugal: LPB", sportsRadarId: "	sr:competition:1926" },
  78: { name: "Romania: Divizia A", sportsRadarId: 'sr:competition:1948' },
  89: { name: "Slovenia: Liga Nova KBM", sportsRadarId: 'sr:competition:745' },
  93: { name: "Sweden: Basketligan", sportsRadarId: 'sr:competition:277' },
  100: { name: "Switzerland: LNA", sportsRadarId: 'sr:competition:1938' },
  12: { sportsRadarId: "sr:competition:132" },    //USA: NBA
  20: { sportsRadarId: "sr:competition:1580" },   //USA: NBA G League
  116: { sportsRadarId: "sr:competition:29630" },  //USA: NCAA
  197: { sportsRadarId: "sr:competition:285" },  //EuroBasket
  120: { sportsRadarId: "sr:competition:138" },  //Euroleague
  194: { sportsRadarId: "sr:competition:141" },  //Eurocup
  202: { sportsRadarId: "sr:competition:14051" },  //Champions League
  201: { sportsRadarId: "sr:competition:441" }, //FIBA Europe Cup
  198: { sportsRadarId:  'sr:competition:2370' }, //NLB                   
  368: { sportsRadarId: "sr:competition:36321" },  //BNXT Leagu
  369: { sportsRadarId: 'sr:competition:41118' },  //ENBL
  204: { sportsRadarId: "sr:competition:26696" }, //Latvia-Estonian League
  281: { sportsRadarId: 'sr:competition:441' }, //World Cup
  192: { sportsRadarId: "sr:competition:276" }, //Olympic Games
};

export default LEAGUES;
