import { TaxInfo } from "../types/country";

/**
 * Global Country Tax System & Personal Income Tax Dataset.
 * Categorizes countries into:
 * - 'zero_tax': 0% personal income tax on worldwide & local income.
 * - 'territorial': 0% personal income tax on foreign/global income (local income taxed).
 * - 'non_dom': Special expat / non-domiciled / lump-sum regime exempting or capping foreign income.
 * - 'worldwide': Standard system taxing worldwide income of residents.
 */
export const TAX_DATA: Record<string, TaxInfo> = {
  // ==========================================
  // PURE ZERO PERSONAL INCOME TAX COUNTRIES
  // ==========================================
  AE: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate:
      "9% (on taxable income > 375,000 AED; 0% for qualifying free zones)",
    residencyRule:
      "Tax residency certificate available after 90 or 183 days of physical presence, or investment / employment visa.",
    summary:
      "The United Arab Emirates levies no personal income tax on salaries, foreign income, dividends, or capital gains for individuals.",
    notes:
      "A 9% federal corporate tax applies to business net profit above 375k AED, but individual personal earnings and investments remain 100% tax-free.",
    isZeroGlobalTax: true,
  },
  BS: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate:
      "0% (Standard business license fees apply; domestic minimum top-up tax for large multinationals)",
    residencyRule:
      "Permanent residency available via qualified real estate investment ($750k+ for accelerated processing) or annual residency permits.",
    summary:
      "The Bahamas imposes no personal income tax, capital gains tax, wealth tax, or inheritance tax on residents.",
    notes:
      "Government revenues are primarily derived from customs duties, VAT (10%), stamp taxes, and property taxes.",
    isZeroGlobalTax: true,
  },
  BH: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate: "0% (Except oil and gas exploration sectors)",
    residencyRule:
      "Golden Residency Visa available for property owners, long-term residents, and highly skilled professionals.",
    summary:
      "Bahrain has no personal income tax, withholding tax, or capital gains tax on individuals.",
    notes:
      "Social insurance contributions apply to employed Bahraini and expatriate workers (1% unemployment fund for expats).",
    isZeroGlobalTax: true,
  },
  BM: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate:
      "15% for large multinational enterprise groups (revenue > €750M); 0% for local entities",
    residencyRule:
      "Work permits and economic investment certificates ($2.5M+ qualifying investment).",
    summary:
      "Bermuda has zero direct personal income tax or capital gains tax on global or local income.",
    notes:
      "Employers pay an employer payroll tax, a portion of which may be deducted from employee wages.",
    isZeroGlobalTax: true,
  },
  KY: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate: "0%",
    residencyRule:
      "Residency for Persons of Independent Means (real estate purchase and continuous annual income) or Global Citizen Concierge Program.",
    summary:
      "The Cayman Islands levies 0% personal income tax, 0% corporate tax, 0% capital gains tax, and 0% withholding tax.",
    notes:
      "Public revenues are funded by import duties (typically 22-27%), tourism fees, and financial company licensing.",
    isZeroGlobalTax: true,
  },
  MC: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate:
      "25% (Applicable if >25% of turnover is generated outside Monaco)",
    residencyRule:
      "Requires bank deposit (typically €500,000+), local lease or purchase of property, clean police record, and 3+ months physical residence.",
    summary:
      "Monaco levies no personal income tax on residents, with 0% tax on worldwide capital gains, interest, and dividends.",
    notes:
      "Exception: French nationals residing in Monaco are subject to French income tax under the 1963 bilateral treaty unless resident before 1957.",
    isZeroGlobalTax: true,
  },
  KW: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate:
      "15% on foreign corporate entities; 0% for GCC-owned entities",
    residencyRule:
      "Work visa or investor residency sponsored by local employer or company.",
    summary:
      "Kuwait imposes 0% personal income tax on individuals regardless of source.",
    notes:
      "Social security contributions apply to Kuwaiti nationals; expats are exempt.",
    isZeroGlobalTax: true,
  },
  QA: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate: "10% standard corporate rate on foreign company profits",
    residencyRule:
      "Real estate residency visa ($200k+ or $1M+ for permanent benefits) or employment sponsorship.",
    summary:
      "Qatar levies no personal income tax on wages, salaries, capital gains, or foreign income of individuals.",
    notes:
      "Individual tax residents enjoy 0% income tax on both domestic and global income.",
    isZeroGlobalTax: true,
  },
  OM: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate: "15% standard corporate income tax",
    residencyRule:
      "Investor residency program (5-year and 10-year golden visas) or employment sponsorship.",
    summary:
      "Oman currently has 0% personal income tax on all domestic and global income.",
    notes:
      "Legislation for high-earner income tax has been studied, but the rate remains 0% currently.",
    isZeroGlobalTax: true,
  },
  SA: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0% (for individuals on non-business assets)",
    corporateTaxRate:
      "20% on foreign share of corporate profit; 2.5% Zakat on Saudi/GCC share",
    residencyRule: "Premium Residency (Saudi Green Card) or Iqama work visa.",
    summary:
      "Saudi Arabia levies no personal income tax on individuals' employment income, investments, or foreign earnings.",
    notes:
      "Saudi and GCC citizens pay a 2.5% Zakat religious wealth levy on qualifying net business capital.",
    isZeroGlobalTax: true,
  },
  BN: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate: "18.5% on corporate profits",
    residencyRule:
      "Immigration work permits and government employment sponsorships.",
    summary:
      "Brunei Darussalam levies no personal income tax, capital gains tax, or wealth tax on individuals.",
    notes: "Funded substantially by oil and gas sovereign revenues.",
    isZeroGlobalTax: true,
  },
  VU: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate:
      "0% on international companies; 0% local corporate income tax",
    residencyRule:
      "Citizenship by Investment program (DSP/VCP) or residence visa via investment/retirement.",
    summary:
      "Vanuatu has zero income tax, zero capital gains tax, zero withholding tax, and zero inheritance tax.",
    notes:
      "Revenue is generated from import duties, VAT (15%), and government administrative fees.",
    isZeroGlobalTax: true,
  },
  AG: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate: "25% for domestic corporations",
    residencyRule:
      "Citizenship by Investment (donation, real estate, or university fund) or Permanent Residency scheme.",
    summary:
      "Antigua and Barbuda abolished personal income tax on worldwide and local income in 2016.",
    notes:
      "Permanent Resident Certificate (PRC) holders enjoy 0% income tax without physical presence minimums if qualifying fee paid.",
    isZeroGlobalTax: true,
  },
  KN: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate:
      "33% (resident corporations; international business corporations exempt on foreign operations)",
    residencyRule:
      "Pioneer of Citizenship by Investment since 1984 (Sustainable Island State Contribution or real estate).",
    summary:
      "Saint Kitts and Nevis abolished personal income tax in 1980; residents pay 0% tax on worldwide earnings.",
    notes:
      "Zero capital gains, zero inheritance, and zero wealth taxes apply to individuals.",
    isZeroGlobalTax: true,
  },
  TC: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate: "0%",
    residencyRule:
      "Permanent Residence Certificate via qualifying real estate investment ($300k - $1M depending on island).",
    summary:
      "The Turks and Caicos Islands levy no direct personal income, capital gains, or corporate tax on residents.",
    notes:
      "National Insurance Board (NIB) contributions and National Health Insurance Plan (NHIP) apply to local wages.",
    isZeroGlobalTax: true,
  },
  VG: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate: "0%",
    residencyRule:
      "Residency certificates granted by immigration board (strict quotas and property ownership).",
    summary:
      "The British Virgin Islands impose 0% personal income tax, 0% capital gains tax, and 0% withholding tax.",
    notes:
      "Payroll tax of 10-14% is paid by employers on local salaries, of which up to 8% may be deducted from employees.",
    isZeroGlobalTax: true,
  },
  AI: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate: "0%",
    residencyRule:
      "High Net Worth Residency scheme ($75k/year annual tax payment) or real estate investment ($400k+).",
    summary:
      "Anguilla has zero direct personal income tax, zero capital gains tax, and zero inheritance tax.",
    notes:
      "Revenues derived from customs duties, property taxes, and the Interim Goods and Services Tax (GST).",
    isZeroGlobalTax: true,
  },
  NR: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate:
      "0% (Business profit tax applies to specific commercial sectors)",
    residencyRule: "Immigration permits or government contracts.",
    summary:
      "Nauru has 0% general personal income tax on individual residents.",
    notes: "Employment tax rate for resident individuals is 0%.",
    isZeroGlobalTax: true,
  },
  BL: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate: "0%",
    residencyRule:
      "French overseas collectivity status; 5 consecutive years of continuous residence required to qualify for local tax exemption.",
    summary:
      "Saint Barthélemy grants full exemption from personal income tax and wealth tax after 5 years of local residency.",
    notes:
      "Until 5 continuous years of fiscal residency are reached, French mainland taxation rules apply.",
    isZeroGlobalTax: true,
  },
  SO: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate: "Variable / unenforced",
    residencyRule: "Local entry visa.",
    summary:
      "Somalia does not effectively collect or enforce personal income tax on foreign or domestic earnings.",
    notes: "Informal and developing fiscal governance.",
    isZeroGlobalTax: true,
  },
  EH: {
    systemType: "zero_tax",
    systemLabel: "Zero Income Tax (0%)",
    headlineRate: "0%",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0%",
    capitalGainsTaxRate: "0%",
    corporateTaxRate: "N/A",
    residencyRule: "Disputed territory status.",
    summary:
      "Western Sahara has no independent centralized personal income tax regime.",
    notes: "Administered in parts by Morocco and the Sahrawi Republic.",
    isZeroGlobalTax: true,
  },

  // ==========================================
  // TERRITORIAL TAX SYSTEMS (0% FOREIGN INCOME)
  // ==========================================
  PA: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 15-25% Local",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0% to 25% (Only on Panama-sourced income)",
    capitalGainsTaxRate:
      "0% on foreign assets; 10% flat on Panama real estate/securities",
    corporateTaxRate:
      "25% on Panama-source profit; 0% on offshore/foreign operations",
    residencyRule:
      "Friendly Nations Visa, Qualified Investor Visa ($300k-$500k real estate/fixed deposit), or Pensionado Visa.",
    summary:
      "Panama operates a strict territorial tax system: income sourced outside of Panama is 100% exempt from personal income tax.",
    notes:
      "Only income generated from economic activity, labor, or assets located physically within Panamanian territory is taxable.",
    isZeroGlobalTax: true,
  },
  CR: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 10-25% Local",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "0% to 25% (Only on Costa Rican sourced income)",
    capitalGainsTaxRate:
      "0% on foreign assets; 15% on Costa Rican capital gains",
    corporateTaxRate: "5% to 30% (Only on Costa Rican source profits)",
    residencyRule:
      "Digital Nomad Visa (1-year extendable with $3k/month income), Inversionista ($150k investment), or Rentista ($2.5k/month guaranteed income).",
    summary:
      "Costa Rica follows a territorial source principle where foreign-sourced dividends, salary, and capital gains are tax-free.",
    notes:
      "Costa Rica's Digital Nomad law explicitly grants complete exemption from Costa Rican income tax on all foreign-derived earnings.",
    isZeroGlobalTax: true,
  },
  PY: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 8-10% Local",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate:
      "8% to 10% (Only on Paraguay-sourced income under IRP)",
    capitalGainsTaxRate:
      "0% on foreign assets; 8% on local dividends / capital gains",
    corporateTaxRate: "10% flat (IRE) on Paraguay-source business profits",
    residencyRule:
      "SUACE investor residency ($70k capital over 10 years) or standard temporary/permanent residency process.",
    summary:
      "Paraguay enforces a territorial tax principle (Law 6380/19); individuals pay zero tax on income earned outside Paraguay.",
    notes:
      "Low domestic flat rate of 10% on local income makes it one of South America's most tax-friendly destinations.",
    isZeroGlobalTax: true,
  },
  GE: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 20% Local",
    foreignIncomeTaxRate: "0% (Tax-Free under Tax Code Art. 82.1.u)",
    personalIncomeTaxRate:
      "20% flat on Georgian-source employment; 0% on foreign income; 1% for qualifying Small Business Status",
    capitalGainsTaxRate:
      "0% on foreign assets; 5% on local residential property / vehicles",
    corporateTaxRate:
      "15% Estonian-model (0% tax until distributed as dividends)",
    residencyRule:
      "High Net Worth Individual program (2M GEL net worth + $25k income), real estate visa ($100k+), or 183-day presence rule.",
    summary:
      "Article 82 of the Tax Code of Georgia explicitly exempts personal foreign-source income of resident individuals from Georgian income tax.",
    notes:
      "Entrepreneurs can also register for 'Small Business Status' to pay just 1% tax on turnover up to 500,000 GEL (~$185,000 USD).",
    isZeroGlobalTax: true,
  },
  HK: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 2-17% Local",
    foreignIncomeTaxRate: "0% (Tax-Free on offshore profits/income)",
    personalIncomeTaxRate:
      "2% to 17% progressive (capped at 15% standard rate on HK-source employment)",
    capitalGainsTaxRate:
      "0% (No capital gains tax on domestic or foreign assets)",
    corporateTaxRate:
      "8.25% on first HK$2M; 16.5% standard rate (0% on qualifying offshore profits)",
    residencyRule:
      "Top Talent Pass Scheme (TTPS), Quality Migrant Admission Scheme (QMAS), or employment visa.",
    summary:
      "Hong Kong applies a strict territorial source principle: salaries and profits arising outside Hong Kong are not subject to tax.",
    notes:
      "Zero capital gains tax, zero dividend tax, and zero withholding tax on interest make it a primary Asian financial hub.",
    isZeroGlobalTax: true,
  },
  SG: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 0-24% Local",
    foreignIncomeTaxRate:
      "0% (Tax-Free for individuals receiving foreign funds in Singapore)",
    personalIncomeTaxRate:
      "0% to 24% progressive (Only on Singapore-sourced employment/income)",
    capitalGainsTaxRate: "0% (No capital gains tax)",
    corporateTaxRate: "17% flat (with partial tax exemptions and incentives)",
    residencyRule:
      "Employment Pass (EP), ONE Pass (high earners), Tech.Pass, or Global Investor Programme (GIP).",
    summary:
      "Foreign-sourced income received in Singapore by resident individuals is generally 100% tax-exempt.",
    notes:
      "No tax on capital gains or dividends. Foreign income is only taxable if received through a partnership in Singapore.",
    isZeroGlobalTax: true,
  },
  MY: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 0-30% Local",
    foreignIncomeTaxRate:
      "0% (Exempt for individuals if subject to tax in source jurisdiction)",
    personalIncomeTaxRate: "0% to 30% progressive on Malaysian-sourced income",
    capitalGainsTaxRate:
      "0% on securities (Capital Gains Tax applies to unlisted local shares and real property gains tax)",
    corporateTaxRate: "24% standard rate",
    residencyRule:
      "Malaysia My Second Home (MM2H), Premium Visa Programme (PVIP), or Employment Pass.",
    summary:
      "Malaysia uses a territorial tax regime where individual foreign-sourced income brought into Malaysia is generally tax-exempt.",
    notes:
      "Qualifying criteria apply under the FSIE framework ensuring foreign income has suffered tax in source country.",
    isZeroGlobalTax: true,
  },
  GT: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 5-7% Local",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate:
      "5% to 7% on gross local income (or 25% on net regime)",
    capitalGainsTaxRate: "0% on foreign assets; 10% on Guatemala capital gains",
    corporateTaxRate: "25% on net profit or 7% on gross income",
    residencyRule:
      "Rentista or pensionado residency visas or business permits.",
    summary:
      "Guatemala taxes income on a territorial basis; foreign-source income is exempt from individual income tax.",
    notes:
      "Only income derived within Guatemalan territory is subject to taxation.",
    isZeroGlobalTax: true,
  },
  NI: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 10-30% Local",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "10% to 30% on Nicaraguan-sourced income",
    capitalGainsTaxRate: "0% on foreign assets; 10-15% on local gains",
    corporateTaxRate: "30% on local profits",
    residencyRule:
      "Pensionado / Rentista residency laws ($750-$1,000/month foreign income).",
    summary:
      "Nicaragua taxes individuals solely on income derived from economic activities or assets inside the country.",
    notes: "Foreign pensions and offshore income enjoy statutory exemption.",
    isZeroGlobalTax: true,
  },
  BO: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 13% Local",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate:
      "13% flat (RC-IVA) on Bolivian-source income (offsettable against VAT receipts)",
    capitalGainsTaxRate: "0% on foreign assets",
    corporateTaxRate: "25% (IUE) on Bolivian profits",
    residencyRule:
      "Temporary and permanent residence visas via investment or employment.",
    summary:
      "Bolivia follows a territorial tax regime: income derived from foreign sources is not subject to Bolivian income tax.",
    notes:
      "Only Bolivian-source income generated from services, work, or goods situated in the country is taxed.",
    isZeroGlobalTax: true,
  },
  SC: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 0-20% Local",
    foreignIncomeTaxRate: "0% (Tax-Free for foreign individual income)",
    personalIncomeTaxRate: "0% to 20% on Seychelles employment income",
    capitalGainsTaxRate: "0% (No capital gains tax)",
    corporateTaxRate: "15% to 25% on Seychelles-source profits",
    residencyRule:
      "Permanent residence via investment ($1M+) or residency permit.",
    summary:
      "Seychelles operates a territorial tax system; income generated outside Seychelles by individuals is not taxed.",
    notes: "No tax on capital gains, gifts, or inheritances.",
    isZeroGlobalTax: true,
  },
  BZ: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 25% Local",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate:
      "25% on Belize-source income over BZ$20,000 threshold",
    capitalGainsTaxRate: "0% (No capital gains tax)",
    corporateTaxRate: "1.75% to 19% (Business tax on gross revenue)",
    residencyRule:
      "Qualified Retired Persons (QRP) program (age 45+, $2k/month foreign income) or standard permanent residency.",
    summary:
      "Belize taxes individuals on a territorial basis; foreign income, pensions, and offshore capital gains are tax-free.",
    notes:
      "The QRP program gives statutory tax exemption on all foreign income and duty-free import of personal goods.",
    isZeroGlobalTax: true,
  },
  SV: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 0-30% Local",
    foreignIncomeTaxRate: "0% (Tax-Free following 2024 reform)",
    personalIncomeTaxRate: "0% to 30% progressive on Salvadoran-sourced income",
    capitalGainsTaxRate:
      "0% on foreign assets; 10% on local gains (0% on Bitcoin / crypto gains)",
    corporateTaxRate: "30% (25% for companies with revenue under $150k)",
    residencyRule:
      "Freedom Visa / Passport program ($1M Bitcoin/USDT investment) or investor visa.",
    summary:
      "El Salvador passed landmark reforms in 2024 abolishing income tax on foreign capital, international remittances, and foreign investments.",
    notes:
      "Bitcoin is legal tender with complete exemption from capital gains tax on crypto investments.",
    isZeroGlobalTax: true,
  },
  UY: {
    systemType: "territorial",
    systemLabel: "Territorial (Tax Holiday)",
    headlineRate: "0% Foreign (11-yr holiday) / 10-36% Local",
    foreignIncomeTaxRate:
      "0% for first 11 years for new tax residents, then 12% on foreign dividends/interest",
    personalIncomeTaxRate:
      "0% to 36% progressive on Uruguayan employment income",
    capitalGainsTaxRate:
      "0% on foreign assets during holiday; 12% on local capital gains",
    corporateTaxRate: "25% (IRAE) on Uruguayan-sourced profits",
    residencyRule:
      "Tax residency via real estate investment (~$500k + 60 days presence) or 183-day rule.",
    summary:
      "Uruguay offers newly relocated tax residents an 11-year tax holiday with 0% tax on foreign investment income.",
    notes:
      "After the 11-year holiday, residents can elect to pay a flat 7% indefinitely or standard 12% on foreign dividends and interest.",
    isZeroGlobalTax: true,
  },
  MO: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 7-12% Local",
    foreignIncomeTaxRate: "0% (Tax-Free on foreign income)",
    personalIncomeTaxRate:
      "7% to 12% progressive on Macau-source professional tax",
    capitalGainsTaxRate: "0% (No capital gains tax)",
    corporateTaxRate: "12% maximum complementary tax rate",
    residencyRule:
      "Macau SAR residency schemes and talent recruitment programs.",
    summary:
      "Macau operates a territorial source tax system with low progressive rates on local employment.",
    notes: "No capital gains, dividend, or inheritance taxes.",
    isZeroGlobalTax: true,
  },
  MH: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 8-12% Local",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "8% to 12% on local wages",
    capitalGainsTaxRate: "0%",
    corporateTaxRate:
      "3% gross revenue tax on local business; 0% on foreign maritime/offshore",
    residencyRule: "Immigration permits.",
    summary:
      "The Marshall Islands taxes only domestic wages; foreign-source income is exempt.",
    notes: "Major global offshore maritime registry jurisdiction.",
    isZeroGlobalTax: true,
  },
  FM: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 6-10% Local",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "6% to 10% on domestic wages",
    capitalGainsTaxRate: "0%",
    corporateTaxRate: "Gross revenue tax on local business",
    residencyRule: "Immigration permits.",
    summary:
      "Micronesia taxes only wages earned inside the federation; foreign income is untaxed.",
    notes: "Territorial wage taxation system.",
    isZeroGlobalTax: true,
  },
  PW: {
    systemType: "territorial",
    systemLabel: "Territorial (0% Foreign)",
    headlineRate: "0% Foreign / 6-12% Local",
    foreignIncomeTaxRate: "0% (Tax-Free)",
    personalIncomeTaxRate: "6% to 12% on domestic wages",
    capitalGainsTaxRate: "0%",
    corporateTaxRate: "12% business profit tax",
    residencyRule:
      "Palau Digital Residency (RNS.id) or physical entry permits.",
    summary:
      "Palau taxes local employment income while foreign-sourced personal earnings are not taxed.",
    notes: "Pioneer in digital identity & web3 residency programs.",
    isZeroGlobalTax: true,
  },

  // ==========================================
  // NON-DOM & SPECIAL EXPAT REGIMES
  // ==========================================
  MT: {
    systemType: "non_dom",
    systemLabel: "Non-Dom / Remittance Regime",
    headlineRate: "0% Unremitted Foreign / 15-35% Local",
    foreignIncomeTaxRate:
      "0% if not remitted to Malta (0% on all foreign capital gains even if remitted)",
    personalIncomeTaxRate:
      "0% to 35% progressive (or 15% flat under Global Residence / Nomad Residence Programmes)",
    capitalGainsTaxRate:
      "0% on foreign capital gains (never taxed even if sent to Maltese bank); 12% on local property",
    corporateTaxRate:
      "35% headline rate (effectively 5% net refund system for non-resident shareholders)",
    residencyRule:
      "Malta Nomad Residence Permit (€3,500/mo remote income), Global Residence Programme, or permanent residence by investment.",
    summary:
      "Malta offers a non-domiciled tax regime: foreign income is taxed only if remitted to Malta, and foreign capital gains are 100% tax-free even if remitted.",
    notes:
      "Subject to a minimum annual tax of €5,000 for non-dom residents under certain high-wealth programs.",
    isZeroGlobalTax: true,
  },
  CY: {
    systemType: "non_dom",
    systemLabel: "Non-Dom Exemption Regime",
    headlineRate: "0% Div & Int / 0-35% Local",
    foreignIncomeTaxRate:
      "0% on worldwide dividends & interest (Special Defence Contribution exemption for 17 years)",
    personalIncomeTaxRate:
      "0% to 35% progressive (First €19,500 tax-free; 50% salary exemption for first-time expats earning >€55k)",
    capitalGainsTaxRate:
      "0% on sale of shares, bonds, and securities worldwide; 20% on Cyprus real estate",
    corporateTaxRate:
      "12.5% flat corporate income tax (2.5% effective on IP Box profits)",
    residencyRule:
      "Cyprus 60-day rule tax residency (60 days in Cyprus + no 183 days elsewhere + local property/business).",
    summary:
      "Cyprus Non-Domicile status exempts individuals from tax on worldwide dividend and passive interest income for 17 years.",
    notes:
      "The 60-Day Rule allows achieving EU tax residency with only 60 days of physical presence per tax year.",
    isZeroGlobalTax: true,
  },
  IT: {
    systemType: "non_dom",
    systemLabel: "Non-Dom Lump Sum Flat Tax",
    headlineRate: "€200,000 Flat / 23-43% Local",
    foreignIncomeTaxRate:
      "€200,000 annual flat tax replaces all Italian tax on worldwide income",
    personalIncomeTaxRate: "23% to 43% progressive on Italian-sourced income",
    capitalGainsTaxRate:
      "Covered by flat tax for foreign assets (exempt except qualified holdings sold in first 5 years)",
    corporateTaxRate: "24% (IRES) + 3.9% (IRAP)",
    residencyRule:
      "Article 24-bis of Italian Tax Code: available to individuals who have not been tax resident in Italy in 9 of the last 10 years.",
    summary:
      "Italy's Neo-Resident Flat Tax allows wealthy individuals to pay a fixed €200,000/year lump-sum to cover all foreign-source income and gains.",
    notes:
      "Family members can be added for €25,000/year each. The regime lasts up to 15 years.",
    isZeroGlobalTax: false,
  },
  GR: {
    systemType: "non_dom",
    systemLabel: "Non-Dom Lump Sum Flat Tax",
    headlineRate: "€100,000 Flat / 9-44% Local",
    foreignIncomeTaxRate:
      "€100,000 annual lump-sum tax covers all foreign-source income",
    personalIncomeTaxRate: "9% to 44% progressive on Greek-sourced income",
    capitalGainsTaxRate:
      "Covered by flat tax for foreign assets; 15% on local gains",
    corporateTaxRate: "22% flat corporate tax",
    residencyRule:
      "Non-Dom program (Article 5A): €500,000 minimum investment in Greek real estate, bonds, or shares + not resident in 7 of last 8 years.",
    summary:
      "Greece's Article 5A regime offers a €100,000 annual lump-sum tax covering all foreign-source income for up to 15 years.",
    notes:
      "Exemption from Greek inheritance and gift tax on assets located outside Greece.",
    isZeroGlobalTax: false,
  },
  CH: {
    systemType: "non_dom",
    systemLabel: "Lump-Sum / Forfait Fiscal",
    headlineRate: "Exp-Based / 0-40% Progressive",
    foreignIncomeTaxRate:
      "Tax based on worldwide living expenditure rather than actual global income for qualifying foreigners",
    personalIncomeTaxRate:
      "Federal progressive up to 11.5% + cantonal/communal rates (Total ~15% to 40%)",
    capitalGainsTaxRate:
      "0% on private movable wealth/shares; capital gains on Swiss real estate taxed by cantons",
    corporateTaxRate: "11.9% to 21% depending on canton",
    residencyRule:
      "Lump-sum taxation (Forfait fiscal) for non-Swiss citizens taking up residency for the first time without gainful local employment.",
    summary:
      "Switzerland allows non-working foreign residents to negotiate lump-sum taxation based on their annual living expenses.",
    notes:
      "Standard Swiss tax residents are taxed on worldwide income, but private capital gains on stocks/crypto are 0% tax-free.",
    isZeroGlobalTax: false,
  },
  PT: {
    systemType: "non_dom",
    systemLabel: "Special Expat Regime (IFICI)",
    headlineRate: "20% Flat / Exempt Foreign",
    foreignIncomeTaxRate:
      "Exemption on foreign pensions/dividends under specific treaty rules / 20% flat on qualifying professional income",
    personalIncomeTaxRate:
      "14.5% to 48% standard progressive (or 20% flat under IFICI / NHR 2.0 innovation regime)",
    capitalGainsTaxRate:
      "28% flat on securities; 50% of real estate capital gains taxed at progressive rates",
    corporateTaxRate: "21% standard rate (14.7% in Madeira Autonomous Region)",
    residencyRule:
      "D8 Digital Nomad Visa, D7 Passive Income Visa, or Golden Visa (fund investment).",
    summary:
      "Portugal replaced the original NHR with the IFICI / Tax Incentive for Scientific Research and Innovation scheme offering 20% flat tax.",
    notes:
      "Transitional grandfathered NHR status continues for pre-2024 applicants (10% on foreign pensions, 0% on foreign dividends).",
    isZeroGlobalTax: false,
  },
  ES: {
    systemType: "non_dom",
    systemLabel: "Beckham Law Special Regime",
    headlineRate: "24% Local / 0% Foreign",
    foreignIncomeTaxRate:
      "0% on foreign income and capital gains (only Spanish-sourced income taxed)",
    personalIncomeTaxRate:
      "24% flat on Spanish employment income up to €600,000 (47% thereafter) under Beckham Law; 19-47% standard",
    capitalGainsTaxRate:
      "0% on foreign capital gains under Beckham Law; 19% to 28% for standard residents",
    corporateTaxRate:
      "25% standard corporate rate (15% for newly created companies)",
    residencyRule:
      "Special Expat Regime (Article 93 / Beckham Law) for individuals relocating on an employment contract, digital nomad visa, or startup director.",
    summary:
      "Spain's Beckham Law regime treats qualifying expats as non-residents for tax purposes for 6 years, taxing only Spanish income at 24%.",
    notes:
      "Worldwide assets and foreign-source passive income/capital gains remain 100% exempt from Spanish tax under this regime.",
    isZeroGlobalTax: true,
  },
  IE: {
    systemType: "non_dom",
    systemLabel: "Non-Dom Remittance Basis",
    headlineRate: "0% Unremitted / 20-40% Local",
    foreignIncomeTaxRate:
      "0% on foreign income and gains not remitted to Ireland",
    personalIncomeTaxRate:
      "20% to 40% standard progressive + USC (up to 8%) + PRSI (4%)",
    capitalGainsTaxRate:
      "33% on Irish assets / remitted foreign gains; 0% on unremitted foreign gains",
    corporateTaxRate: "12.5% standard trading rate",
    residencyRule:
      "183-day rule or 280-day two-year test. Non-domiciled status requires foreign domicile of origin.",
    summary:
      "Ireland permits non-domiciled residents to be taxed on the remittance basis: foreign income and capital gains are only taxed if brought into Ireland.",
    notes:
      "Special Assignee Relief Programme (SARP) also provides income tax relief for executives assigned to Ireland.",
    isZeroGlobalTax: true,
  },
  TH: {
    systemType: "non_dom",
    systemLabel: "Remittance Source Regime",
    headlineRate: "0-35% Progressive",
    foreignIncomeTaxRate:
      "Taxable if remitted into Thailand in the year earned (updated Revenue Department Order 2024)",
    personalIncomeTaxRate: "0% to 35% progressive",
    capitalGainsTaxRate:
      "0% on Stock Exchange of Thailand shares; standard rates on foreign gains remitted",
    corporateTaxRate: "20% standard rate",
    residencyRule:
      "Long-Term Resident (LTR) Visa (10-year visa with complete tax exemption on foreign income for high earners/wealthy pensioners) or 180-day rule.",
    summary:
      "Thailand historically operated a remittance basis. The 10-year LTR Visa grants statutory 0% tax on overseas income.",
    notes:
      "Standard tax residents remitting overseas income now face Thai personal income tax unless holding an LTR visa.",
    isZeroGlobalTax: false,
  },

  // ==========================================
  // MAJOR WORLDWIDE TAX JURISDICTIONS
  // ==========================================
  US: {
    systemType: "worldwide",
    systemLabel: "Citizenship-Based Worldwide",
    headlineRate: "10% - 37% + State",
    foreignIncomeTaxRate:
      "Taxed at standard federal rates (Foreign Earned Income Exclusion & Foreign Tax Credits apply)",
    personalIncomeTaxRate:
      "10% to 37% federal progressive + state income tax (0% to 13.3%)",
    capitalGainsTaxRate:
      "0%, 15%, or 20% long-term + 3.8% Net Investment Income Tax (NIIT)",
    corporateTaxRate: "21% federal + state corporate taxes",
    residencyRule:
      "Citizenship-Based Taxation (CBT): all US citizens and green card holders are taxed on worldwide income regardless of where they live.",
    summary:
      "The United States is one of only two countries that taxes its citizens on worldwide income even if they permanently reside abroad.",
    notes:
      "US expats can utilize the Foreign Earned Income Exclusion (FEIE, ~$126k/yr) and Foreign Tax Credit (FTC) to mitigate double taxation.",
    isZeroGlobalTax: false,
  },
  GB: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "0% - 45%",
    foreignIncomeTaxRate:
      "Taxed at standard UK progressive rates (transitioning to new 4-year foreign income and gains regime)",
    personalIncomeTaxRate:
      "0% (Personal Allowance up to £12,570), 20% basic, 40% higher, 45% additional rate",
    capitalGainsTaxRate:
      "10% / 20% standard (18% / 24% for residential property; 18% / 24% from 2024 budget)",
    corporateTaxRate: "25% (19% for small profits under £50k)",
    residencyRule:
      "Statutory Residence Test (SRT) based on day counts and connecting ties.",
    summary:
      "The United Kingdom taxes UK tax residents on their worldwide income and gains.",
    notes:
      "Abolishing the traditional non-dom remittance basis in favour of a modern 4-year foreign income and gains (FIG) regime.",
    isZeroGlobalTax: false,
  },
  CA: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "15% - 33% + Prov",
    foreignIncomeTaxRate:
      "Taxed at standard federal + provincial marginal rates",
    personalIncomeTaxRate:
      "15% to 33% federal + provincial income tax (Total top combined marginal rate up to 54.8%)",
    capitalGainsTaxRate:
      "50% inclusion rate (66.7% inclusion on capital gains above $250k)",
    corporateTaxRate:
      "15% federal (9% small business) + provincial corporate rate",
    residencyRule:
      "Factual residency based on primary residential ties (dwelling, spouse, dependents) or 183-day sojourner rule.",
    summary:
      "Canada taxes its tax residents on worldwide income from all sources. Emigrants face a deemed disposition 'departure tax'.",
    notes:
      "Non-residents are taxed only on Canadian-source income and taxable Canadian property.",
    isZeroGlobalTax: false,
  },
  DE: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "0% - 45% + Soli",
    foreignIncomeTaxRate:
      "Taxed at progressive German income tax rates with foreign tax credit",
    personalIncomeTaxRate:
      "0% to 45% progressive + 5.5% solidarity surcharge (on high incomes) + 8-9% church tax",
    capitalGainsTaxRate:
      "25% flat withholding tax (Abgeltungsteuer) + solidarity surcharge",
    corporateTaxRate:
      "~30% combined (15% corporate tax + 5.5% solidarity + ~14% local trade tax)",
    residencyRule:
      "Habitual abode (physical presence exceeding 6 months) or maintain a permanent home/dwelling in Germany.",
    summary:
      "Germany levies worldwide income tax on all individuals having a domicile or habitual abode in Germany.",
    notes:
      "Strict exit tax (Wegzugsbesteuerung) applies to shareholders owning 1%+ of companies when emigrating.",
    isZeroGlobalTax: false,
  },
  FR: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "0% - 45% + Surtax",
    foreignIncomeTaxRate: "Taxed under progressive scale + social charges",
    personalIncomeTaxRate:
      "0% to 45% progressive + exceptional contribution of 3-4% on high earners + 17.2% social contributions on investment",
    capitalGainsTaxRate:
      "30% flat tax (Prélèvement Forfaitaire Unique - PFU / 12.8% income tax + 17.2% social contributions)",
    corporateTaxRate: "25% standard corporate rate",
    residencyRule:
      "Tax domicile established if primary home, principal place of stay (>183 days), or center of economic interests is in France.",
    summary:
      "France taxes French tax residents on their worldwide income, investments, and global capital gains.",
    notes:
      "Impatriate tax regime offers partial exemptions for up to 8 years for employees relocated to France by their employer.",
    isZeroGlobalTax: false,
  },
  AU: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "0% - 45% + Med",
    foreignIncomeTaxRate:
      "Taxed at Australian marginal tax rates (with Foreign Income Tax Offsets)",
    personalIncomeTaxRate: "0% to 45% progressive + 2% Medicare Levy",
    capitalGainsTaxRate:
      "50% CGT discount for assets held over 12 months; remainder taxed at marginal rates",
    corporateTaxRate: "30% (25% for base rate entities with turnover < $50M)",
    residencyRule:
      "Resides test, domicile test, 183-day test, or superannuation test.",
    summary:
      "Australian tax residents are taxed on their worldwide income from all sources.",
    notes:
      "Temporary resident rules grant exemption on foreign passive investment income and foreign capital gains for qualifying visa holders.",
    isZeroGlobalTax: false,
  },
  NZ: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "10.5% - 39%",
    foreignIncomeTaxRate:
      "Taxed at marginal income tax rates (4-year transitional tax exemption for new migrants)",
    personalIncomeTaxRate: "10.5% to 39% progressive",
    capitalGainsTaxRate:
      "0% general (Bright-line test applies to residential property sold within statutory period)",
    corporateTaxRate: "28% flat corporate tax",
    residencyRule:
      "Permanent place of abode test or 183 days of physical presence within any 12-month period.",
    summary:
      "New Zealand taxes residents on worldwide income, but provides a 4-year foreign income tax holiday for new arrivals.",
    notes:
      "Transitional Resident status provides a 48-month total tax exemption on most types of foreign income for new immigrants.",
    isZeroGlobalTax: false,
  },
  JP: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "5% - 45% + 10% Local",
    foreignIncomeTaxRate:
      "Permanent residents taxed on worldwide income; non-permanent residents taxed only on remitted foreign income for first 5 years",
    personalIncomeTaxRate:
      "5% to 45% national income tax + 10% flat local inhabitant tax + 2.1% reconstruction surtax (top marginal 55.9%)",
    capitalGainsTaxRate:
      "20.315% flat on listed shares (15% national + 5% local + 0.315% surtax)",
    corporateTaxRate: "~30% combined effective corporate rate",
    residencyRule:
      "Non-Permanent Resident for first 5 years (no domicile intent / foreign nationality); Permanent Resident thereafter.",
    summary:
      "Japan taxes permanent tax residents on worldwide income. Non-permanent residents enjoy a temporary remittance-basis for 5 years.",
    notes:
      "High marginal rates on top incomes, but foreign-source income unremitted to Japan is exempt during the initial 5-year Non-Permanent period.",
    isZeroGlobalTax: false,
  },
  IN: {
    systemType: "worldwide",
    systemLabel: "Worldwide (ROR)",
    headlineRate: "0% - 30% + Surch",
    foreignIncomeTaxRate:
      "Worldwide income taxed for Resident and Ordinarily Resident (ROR) individuals",
    personalIncomeTaxRate:
      "0% to 30% progressive (New/Old Tax Regime) + surcharge up to 25% + 4% health & education cess",
    capitalGainsTaxRate:
      "12.5% long-term capital gains on listed securities / 20% short-term (Finance Act 2024)",
    corporateTaxRate:
      "22% standard domestic corporate rate (plus surcharge and cess)",
    residencyRule:
      "Resident and Ordinarily Resident (ROR), Resident but Not Ordinarily Resident (RNOR), or Non-Resident (NR) based on day counts.",
    summary:
      "India taxes worldwide income of Resident and Ordinarily Resident (ROR) taxpayers. RNOR status grants temporary exemption on foreign income.",
    notes:
      "RNOR individuals are exempt from Indian tax on foreign-source income unless derived from a business controlled in or profession set up in India.",
    isZeroGlobalTax: false,
  },
  BR: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "0% - 27.5%",
    foreignIncomeTaxRate:
      "15% flat tax on foreign investments and offshore entities (Law 14,754/2023); progressive on foreign employment",
    personalIncomeTaxRate: "0% to 27.5% progressive on Brazilian income",
    capitalGainsTaxRate:
      "15% to 22.5% progressive on local capital gains; 15% flat on offshore assets",
    corporateTaxRate:
      "34% combined effective corporate tax (15% IRPJ + 10% surtax + 9% CSLL)",
    residencyRule:
      "Permanent visa, employment contract in Brazil, or presence exceeding 183 days within a 12-month period.",
    summary:
      "Brazil taxes tax residents on worldwide income. In 2024, Brazil enacted a 15% flat annual tax on foreign financial assets and trusts.",
    notes:
      "Emigrants must file a formal Exit Declaration (Comunicação e Declaração de Saída Definitiva do País) to cease Brazilian tax residency.",
    isZeroGlobalTax: false,
  },
  CN: {
    systemType: "worldwide",
    systemLabel: "Worldwide (6-yr rule)",
    headlineRate: "3% - 45%",
    foreignIncomeTaxRate:
      "Worldwide income taxed; 6-year exemption rule applies to foreign nationals with no permanent domicile",
    personalIncomeTaxRate:
      "3% to 45% progressive comprehensive individual income tax (IIT)",
    capitalGainsTaxRate: "20% flat tax on property and financial transfers",
    corporateTaxRate:
      "25% standard enterprise income tax (15% for High-New Tech enterprises)",
    residencyRule:
      "183-day rule. Foreign individuals without domicile are exempt from tax on foreign-source income not paid by Chinese entities for up to 6 years.",
    summary:
      "China taxes worldwide income of domiciled residents. Foreigners can reset the 6-year worldwide tax clock by leaving for >30 consecutive days.",
    notes:
      "The 'Six-Year Rule' allows foreign expats to avoid Chinese taxation on non-China-sourced income paid offshore.",
    isZeroGlobalTax: false,
  },
  ZA: {
    systemType: "worldwide",
    systemLabel: "Worldwide (R1.25M Exemption)",
    headlineRate: "18% - 45%",
    foreignIncomeTaxRate:
      "Worldwide taxation; first R1.25M of foreign employment income exempt for SA expats abroad >183 days",
    personalIncomeTaxRate: "18% to 45% progressive",
    capitalGainsTaxRate:
      "40% inclusion rate (effective maximum capital gains tax rate of 18%)",
    corporateTaxRate: "27% flat corporate tax",
    residencyRule:
      "Ordinarily resident test or physical presence test (91 days in current year + 915 days in prior 5 years).",
    summary:
      "South Africa transitioned to a residence-based worldwide tax system in 2001.",
    notes:
      "South African citizens working abroad can exempt up to 1.25 million ZAR of foreign remuneration under Section 10(1)(o)(ii).",
    isZeroGlobalTax: false,
  },
  MX: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "1.92% - 35%",
    foreignIncomeTaxRate:
      "Taxed at standard marginal rates with foreign tax credits (Acreditamiento de ISR)",
    personalIncomeTaxRate: "1.92% to 35% progressive",
    capitalGainsTaxRate:
      "10% flat on listed Mexican securities; up to 35% on real estate and foreign gains",
    corporateTaxRate: "30% standard corporate rate",
    residencyRule:
      "Established primary home in Mexico, or center of vital interests (more than 50% of annual income or professional activity in Mexico).",
    summary:
      "Mexico taxes resident individuals on their worldwide income from all sources.",
    notes:
      "RESICO regime offers simplified low rates (1% to 2.5%) on gross income up to 3.5M MXN for qualifying small business individuals.",
    isZeroGlobalTax: false,
  },
  NL: {
    systemType: "worldwide",
    systemLabel: "Worldwide (Box System)",
    headlineRate: "Box 1: up to 49.5%",
    foreignIncomeTaxRate:
      "Box 1 (wages) up to 49.5%, Box 2 (substantial shareholding) 24.5-33%, Box 3 (deemed asset return) ~36%",
    personalIncomeTaxRate: "Box 1 progressive up to 49.50%",
    capitalGainsTaxRate:
      "Taxed under Box 3 deemed return system (~36% on fictional yield) rather than actual realized gains",
    corporateTaxRate: "19% on first €200k; 25.8% on excess",
    residencyRule:
      "Determined by factual circumstances (center of personal and social life, family ties, home).",
    summary:
      "The Netherlands uses a 3-box tax system taxing worldwide income, business interests, and deemed returns on net wealth.",
    notes:
      "The 30% Ruling grants qualifying incoming expats a 30% tax-free allowance on Dutch salary (subject to recent step-down reforms).",
    isZeroGlobalTax: false,
  },
  SE: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "32% - 52%",
    foreignIncomeTaxRate:
      "Taxed at combined municipal (avg ~32%) and state (20% above threshold) rates",
    personalIncomeTaxRate:
      "Municipal tax ~32% + national state tax 20% on income above threshold (Total top ~52%)",
    capitalGainsTaxRate:
      "30% flat capital income tax (ISK investment accounts offer simplified low taxation on asset value)",
    corporateTaxRate: "20.6% flat corporate tax",
    residencyRule:
      "Permanent residence, habitual abode (continuous 6-month stay), or essential connection (väsentlig anknytning) to Sweden.",
    summary:
      "Sweden taxes residents on worldwide income and capital. Non-residents with essential ties remain tax liable.",
    notes:
      "Expert tax relief provides a 25% tax-free allowance for qualifying foreign experts and researchers for up to 7 years.",
    isZeroGlobalTax: false,
  },
  NO: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "22% + Bracket Tax",
    foreignIncomeTaxRate:
      "Taxed at standard base rate (22%) plus progressive bracket tax (trinnskatt up to 17.6%)",
    personalIncomeTaxRate:
      "22% base rate + progressive bracket tax up to 17.6% (Top marginal ~39.6% on wages) + wealth tax",
    capitalGainsTaxRate:
      "22% multiplied by 1.72 adjustment factor (effective 37.84% on shares and dividends)",
    corporateTaxRate: "22% standard corporate rate",
    residencyRule:
      "Physical presence in Norway for more than 183 days in any 12-month period or 270 days in any 36-month period.",
    summary:
      "Norway taxes Norwegian tax residents on worldwide income and enforces a municipal/state net wealth tax (0.95% to 1.1%).",
    notes:
      "Exit tax (utflyttingsskatt) applies to unrealized capital gains on shares when emigrating from Norway.",
    isZeroGlobalTax: false,
  },
  DK: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "Up to ~55.9%",
    foreignIncomeTaxRate:
      "Taxed at standard Danish progressive rates (top bracket 55.9% including municipal and health taxes)",
    personalIncomeTaxRate:
      "Progressive rates up to ~55.9% (including state, municipal, and AM-bidrag labour market contribution of 8%)",
    capitalGainsTaxRate: "27% up to DKK 61,000; 42% on excess for share income",
    corporateTaxRate: "22% flat corporate tax",
    residencyRule:
      "Full tax liability triggered by acquiring a permanent residence in Denmark or staying for continuous 6 months.",
    summary:
      "Denmark levies progressive worldwide tax on all resident individuals.",
    notes:
      "Researcher / Expat tax scheme allows qualifying foreign researchers and key employees to pay a flat 32.84% tax for up to 7 years.",
    isZeroGlobalTax: false,
  },
  FI: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "Up to ~51%",
    foreignIncomeTaxRate:
      "Taxed at progressive national rates + municipal tax (4.4% - 10.8%)",
    personalIncomeTaxRate:
      "Progressive national tax up to 31.25% + municipal tax + church tax + health care contributions",
    capitalGainsTaxRate: "30% up to €30,000; 34% on excess",
    corporateTaxRate: "20% flat corporate tax",
    residencyRule:
      "Main home in Finland or staying in Finland for more than 6 consecutive months.",
    summary:
      "Finland taxes residents on worldwide income. Foreign key employees can qualify for a 32% flat tax rate for up to 7 years.",
    notes:
      "Finnish citizens relocating abroad remain subject to the 3-year rule unless proving absence of substantial ties.",
    isZeroGlobalTax: false,
  },
  AT: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "0% - 55%",
    foreignIncomeTaxRate:
      "Taxed at Austrian progressive rates with double tax treaty relief",
    personalIncomeTaxRate:
      "0% to 55% progressive (55% rate applies on taxable income over €1M)",
    capitalGainsTaxRate:
      "27.5% flat special tax rate on securities, dividends, and crypto; 30% on real estate",
    corporateTaxRate:
      "23% flat corporate tax (reduced from 25% in recent tax reform)",
    residencyRule:
      "Domicile (permanent home) or habitual abode (stay exceeding 6 months).",
    summary: "Austria taxes unlimited tax residents on their worldwide income.",
    notes:
      "Favorable tax exemption for incoming scientists, researchers, and athletes under section 103 EStG.",
    isZeroGlobalTax: false,
  },
  BE: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "25% - 50% + Mun",
    foreignIncomeTaxRate:
      "Taxed under standard progressive brackets (plus municipal surcharges of 0% - 9%)",
    personalIncomeTaxRate:
      "25% to 50% progressive + municipal surcharges (Top rate starts at relatively low income ~€46k)",
    capitalGainsTaxRate:
      "0% on private capital gains on shares (under normal management of private wealth); 30% withholding on dividends",
    corporateTaxRate:
      "25% standard corporate rate (20% for SMEs on first €100k)",
    residencyRule:
      "Registered in the National Register of Natural Persons or center of economic interests in Belgium.",
    summary:
      "Belgium taxes resident individuals on worldwide income, but maintains a 0% capital gains tax on private stock portfolios.",
    notes:
      "Special Expat Tax Regime (RSII/RSIR) offers up to 30% tax-free cost allowance for qualifying international recruits.",
    isZeroGlobalTax: false,
  },
  IL: {
    systemType: "worldwide",
    systemLabel: "Worldwide (10-yr holiday)",
    headlineRate: "10% - 50%",
    foreignIncomeTaxRate:
      "Worldwide taxation; 10-year complete tax holiday on foreign income for new immigrants (Olim Hadashim)",
    personalIncomeTaxRate:
      "10% to 50% progressive (including 3% surtax on high incomes)",
    capitalGainsTaxRate:
      "25% standard capital gains tax (30% for substantial shareholders 10%+) / 0% on foreign gains during 10-yr holiday",
    corporateTaxRate: "23% standard corporate tax",
    residencyRule:
      "Center of life test (family, home, economic interests) and day count presumptions (183 days or 30 days + 425 days in 3 years).",
    summary:
      "Israel taxes residents on worldwide income, but offers new immigrants (Olim) a 10-year total tax holiday on all foreign income and capital gains.",
    notes:
      "The 10-year exemption for new immigrants covers foreign salaries, dividends, interest, capital gains, and rent.",
    isZeroGlobalTax: false,
  },
  KR: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "6% - 45% + Local",
    foreignIncomeTaxRate:
      "Worldwide taxation; foreign residents can opt for 19% flat tax on Korean employment income for first 20 years",
    personalIncomeTaxRate:
      "6% to 45% progressive + 10% local income tax (top marginal rate 49.5%)",
    capitalGainsTaxRate:
      "11% to 27.5% depending on asset type and holding period",
    corporateTaxRate: "9% to 24% progressive corporate tax brackets",
    residencyRule:
      "Domicile in Korea or physical residence for 183 days or more.",
    summary: "South Korea taxes resident individuals on worldwide income.",
    notes:
      "Foreign employees can elect a flat 19% tax rate (20.9% with local tax) on employment income for up to 20 years.",
    isZeroGlobalTax: false,
  },
  ID: {
    systemType: "worldwide",
    systemLabel: "Worldwide (4-yr territorial)",
    headlineRate: "5% - 35%",
    foreignIncomeTaxRate:
      "Worldwide taxation; foreign workers with specific skills enjoy a 4-year territorial tax exemption on foreign income",
    personalIncomeTaxRate: "5% to 35% progressive",
    capitalGainsTaxRate:
      "0.1% on listed IDX shares; progressive rates on other capital assets",
    corporateTaxRate: "22% flat corporate tax",
    residencyRule:
      "Residing in Indonesia or staying for more than 183 days within any 12-month period.",
    summary:
      "Indonesia taxes residents on worldwide income, with a 4-year territorial concession for qualifying foreign experts.",
    notes:
      "Second Home Visa and Golden Visa (5-10 years) offer residency pathways for remote workers and investors.",
    isZeroGlobalTax: false,
  },
  TR: {
    systemType: "worldwide",
    systemLabel: "Worldwide Taxation",
    headlineRate: "15% - 40%",
    foreignIncomeTaxRate:
      "Taxed at progressive Turkish income tax rates with foreign tax credit relief",
    personalIncomeTaxRate: "15% to 40% progressive",
    capitalGainsTaxRate:
      "Progressive rates on non-exempt capital assets (0% on Turkish equities held > 2 years)",
    corporateTaxRate:
      "25% standard corporate rate (30% for banks and financial institutions)",
    residencyRule:
      "Legal residence in Turkey or staying continuously for more than 6 months in a calendar year.",
    summary:
      "Turkey taxes full-liability tax residents on their worldwide income.",
    notes:
      "Zero capital gains on Turkish stock exchange shares held for more than two years by individuals.",
    isZeroGlobalTax: false,
  },
};
