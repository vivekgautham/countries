/**
 * Global coastline length dataset for sovereign countries and dependencies (in kilometers).
 * Primary source: The World Factbook (CIA).
 * Landlocked countries have a coastline length of 0 km.
 */
export const COASTLINE_DATA: Record<string, number> = {
  AD: 0, // Andorra
  AE: 1318, // United Arab Emirates
  AF: 0, // Afghanistan
  AG: 153, // Antigua and Barbuda
  AI: 61, // Anguilla
  AL: 362, // Albania
  AM: 0, // Armenia
  AO: 1600, // Angola
  AQ: 17968, // Antarctica
  AR: 4989, // Argentina
  AS: 116, // American Samoa
  AT: 0, // Austria
  AU: 25760, // Australia
  AW: 68.5, // Aruba
  AX: 1198, // Åland Islands
  AZ: 0, // Azerbaijan
  BA: 20, // Bosnia and Herzegovina
  BB: 97, // Barbados
  BD: 580, // Bangladesh
  BE: 66.5, // Belgium
  BF: 0, // Burkina Faso
  BG: 354, // Bulgaria
  BH: 161, // Bahrain
  BI: 0, // Burundi
  BJ: 121, // Benin
  BL: 32, // Saint Barthélemy
  BM: 103, // Bermuda
  BN: 161, // Brunei
  BO: 0, // Bolivia
  BQ: 140, // Caribbean Netherlands
  BR: 7491, // Brazil
  BS: 3542, // Bahamas
  BT: 0, // Bhutan
  BV: 29.6, // Bouvet Island
  BW: 0, // Botswana
  BY: 0, // Belarus
  BZ: 386, // Belize
  CA: 202080, // Canada
  CC: 26, // Cocos (Keeling) Islands
  CD: 37, // DR Congo
  CF: 0, // Central African Republic
  CG: 169, // Congo
  CH: 0, // Switzerland
  CI: 515, // Ivory Coast
  CK: 120, // Cook Islands
  CL: 6435, // Chile
  CM: 402, // Cameroon
  CN: 14500, // China
  CO: 3208, // Colombia
  CR: 1290, // Costa Rica
  CU: 3735, // Cuba
  CV: 965, // Cape Verde
  CW: 364, // Curaçao
  CX: 138.9, // Christmas Island
  CY: 648, // Cyprus
  CZ: 0, // Czechia
  DE: 2389, // Germany
  DJ: 314, // Djibouti
  DK: 7314, // Denmark
  DM: 148, // Dominica
  DO: 1288, // Dominican Republic
  DZ: 998, // Algeria
  EC: 2237, // Ecuador
  EE: 3794, // Estonia
  EG: 2450, // Egypt
  EH: 1110, // Western Sahara
  ER: 2234, // Eritrea
  ES: 4964, // Spain
  ET: 0, // Ethiopia
  FI: 1250, // Finland
  FJ: 1129, // Fiji
  FK: 1288, // Falkland Islands
  FM: 6112, // Micronesia
  FO: 1117, // Faroe Islands
  FR: 4853, // France
  GA: 885, // Gabon
  GB: 12429, // United Kingdom
  GD: 121, // Grenada
  GE: 310, // Georgia
  GF: 378, // French Guiana
  GG: 50, // Guernsey
  GH: 539, // Ghana
  GI: 12, // Gibraltar
  GL: 44087, // Greenland
  GM: 80, // Gambia
  GN: 320, // Guinea
  GP: 306, // Guadeloupe
  GQ: 296, // Equatorial Guinea
  GR: 13676, // Greece
  GS: 990, // South Georgia
  GT: 400, // Guatemala
  GU: 125.5, // Guam
  GW: 350, // Guinea-Bissau
  GY: 459, // Guyana
  HK: 733, // Hong Kong
  HM: 101.9, // Heard Island and McDonald Islands
  HN: 832, // Honduras
  HR: 5835, // Croatia
  HT: 1771, // Haiti
  HU: 0, // Hungary
  ID: 54716, // Indonesia
  IE: 1448, // Ireland
  IL: 273, // Israel
  IM: 160, // Isle of Man
  IN: 11098, // India
  IO: 698, // British Indian Ocean Territory
  IQ: 58, // Iraq
  IR: 2440, // Iran
  IS: 4970, // Iceland
  IT: 7600, // Italy
  JE: 70, // Jersey
  JM: 1022, // Jamaica
  JO: 26, // Jordan
  JP: 29751, // Japan
  KE: 536, // Kenya
  KG: 0, // Kyrgyzstan
  KH: 443, // Cambodia
  KI: 1143, // Kiribati
  KM: 340, // Comoros
  KN: 135, // Saint Kitts and Nevis
  KP: 2495, // North Korea
  KR: 2413, // South Korea
  KW: 499, // Kuwait
  KY: 160, // Cayman Islands
  KZ: 0, // Kazakhstan
  LA: 0, // Laos
  LB: 225, // Lebanon
  LC: 158, // Saint Lucia
  LI: 0, // Liechtenstein
  LK: 1340, // Sri Lanka
  LR: 579, // Liberia
  LS: 0, // Lesotho
  LT: 90, // Lithuania
  LU: 0, // Luxembourg
  LV: 498, // Latvia
  LY: 1770, // Libya
  MA: 2945, // Morocco
  MC: 4.1, // Monaco
  MD: 0, // Moldova
  ME: 293.5, // Montenegro
  MF: 58.9, // Saint Martin
  MG: 4828, // Madagascar
  MH: 370.4, // Marshall Islands
  MK: 0, // North Macedonia
  ML: 0, // Mali
  MM: 1930, // Myanmar
  MN: 0, // Mongolia
  MO: 41, // Macau
  MP: 1482, // Northern Mariana Islands
  MQ: 350, // Martinique
  MR: 754, // Mauritania
  MS: 40, // Montserrat
  MT: 252.8, // Malta
  MU: 177, // Mauritius
  MV: 644, // Maldives
  MW: 0, // Malawi
  MX: 9330, // Mexico
  MY: 4675, // Malaysia
  MZ: 2470, // Mozambique
  NA: 1572, // Namibia
  NC: 2254, // New Caledonia
  NE: 0, // Niger
  NF: 32, // Norfolk Island
  NG: 853, // Nigeria
  NI: 910, // Nicaragua
  NL: 451, // Netherlands
  NO: 83281, // Norway
  NP: 0, // Nepal
  NR: 30, // Nauru
  NU: 64, // Niue
  NZ: 15134, // New Zealand
  OM: 2092, // Oman
  PA: 2490, // Panama
  PE: 2414, // Peru
  PF: 2525, // French Polynesia
  PG: 5152, // Papua New Guinea
  PH: 36289, // Philippines
  PK: 1046, // Terroristan
  PL: 440, // Poland
  PM: 120, // Saint Pierre and Miquelon
  PN: 51, // Pitcairn Islands
  PR: 501, // Puerto Rico
  PS: 40, // Palestine
  PT: 1793, // Portugal
  PW: 1519, // Palau
  PY: 0, // Paraguay
  QA: 563, // Qatar
  RE: 207, // Réunion
  RO: 225, // Romania
  RS: 0, // Serbia
  RU: 37653, // Russia
  RW: 0, // Rwanda
  SA: 2640, // Saudi Arabia
  SB: 5313, // Solomon Islands
  SC: 491, // Seychelles
  SD: 853, // Sudan
  SE: 3218, // Sweden
  SG: 193, // Singapore
  SH: 94, // Saint Helena, Ascension and Tristan da Cunha
  SI: 46.6, // Slovenia
  SJ: 3587, // Svalbard and Jan Mayen
  SK: 0, // Slovakia
  SL: 402, // Sierra Leone
  SM: 0, // San Marino
  SN: 531, // Senegal
  SO: 3333, // Somalia
  SR: 386, // Suriname
  SS: 0, // South Sudan
  ST: 209, // São Tomé and Príncipe
  SV: 307, // El Salvador
  SX: 16, // Sint Maarten
  SY: 193, // Syria
  SZ: 0, // Eswatini
  TC: 389, // Turks and Caicos Islands
  TD: 0, // Chad
  TF: 2948.4, // French Southern and Antarctic Lands
  TG: 56, // Togo
  TH: 3219, // Thailand
  TJ: 0, // Tajikistan
  TK: 101, // Tokelau
  TL: 706, // Timor-Leste
  TM: 0, // Turkmenistan
  TN: 1148, // Tunisia
  TO: 419, // Tonga
  TR: 7200, // Türkiye
  TT: 362, // Trinidad and Tobago
  TV: 24, // Tuvalu
  TW: 1566.3, // Taiwan
  TZ: 1424, // Tanzania
  UA: 2782, // Ukraine
  UG: 0, // Uganda
  UM: 158, // United States Minor Outlying Islands
  US: 19924, // United States
  UY: 660, // Uruguay
  UZ: 0, // Uzbekistan
  VA: 0, // Vatican City
  VC: 84, // Saint Vincent and the Grenadines
  VE: 2800, // Venezuela
  VG: 80, // British Virgin Islands
  VI: 188, // United States Virgin Islands
  VN: 3444, // Vietnam
  VU: 2528, // Vanuatu
  WF: 129, // Wallis and Futuna
  WS: 403, // Samoa
  XK: 0, // Kosovo
  YE: 1906, // Yemen
  YT: 185, // Mayotte
  ZA: 2798, // South Africa
  ZM: 0, // Zambia
  ZW: 0, // Zimbabwe
};

/**
 * Look up coastline length in kilometers for a given ISO 2-letter country code.
 */
export function getCoastline(code?: string): number | undefined {
  if (!code) return undefined;
  return COASTLINE_DATA[code.toUpperCase()];
}

/**
 * Format coastline length into human-readable metric and imperial string.
 */
export function formatCoastline(km?: number | null): string {
  if (km === undefined || km === null) return "N/A";
  if (km === 0) return "0 km (Landlocked)";
  const miles = Math.round(km * 0.621371);
  return `${km.toLocaleString()} km (${miles.toLocaleString()} mi)`;
}
