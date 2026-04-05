export interface CityData {
  slug: string;
  city: string;
  state: string;
  stateCode: string;
  county: string;
  population: string;
  medianHomeValue: string;
  avgAutoRate: string;
  avgHealthRate: string;
  description: string;
  neighborhoods: string[];
  faqs: { q: string; a: string }[];
}

export const CITIES: CityData[] = [
  {
    slug: 'frisco-tx',
    city: 'Frisco',
    state: 'Texas',
    stateCode: 'TX',
    county: 'Collin County',
    population: '210,000+',
    medianHomeValue: '$520,000',
    avgAutoRate: '$112–$165/mo',
    avgHealthRate: '$380–$520/mo',
    description: 'One of the fastest-growing cities in America, Frisco combines master-planned communities with top-rated schools and a booming economy. Home values have grown significantly, making the right homeowner coverage more important than ever.',
    neighborhoods: ['Starwood', 'Stonebriar', 'Panther Creek', 'Phillips Creek Ranch', 'Edgewood'],
    faqs: [
      { q: 'What is the average homeowner insurance rate in Frisco, TX?', a: 'Frisco homeowners typically pay $140–$220/month depending on home value, deductible, and carrier. Homes in the $400K–$600K range average around $175/month with standard coverage.' },
      { q: 'Does Frisco TX require flood insurance?', a: 'Frisco is not in a high-risk FEMA flood zone, but some areas near Bois d\'Arc Creek may qualify. We recommend reviewing your FEMA flood map and considering an affordable flood rider.' },
      { q: 'Which carriers write home insurance in Frisco?', a: 'We work with State Farm, Travelers, Nationwide, Farmers, and 16 other carriers licensed in Texas. We shop all of them to find your best rate.' },
      { q: 'Is auto insurance expensive in Frisco?', a: 'Frisco rates are slightly above the national average due to higher vehicle values and traffic density on the Tollway corridor. Bundling home and auto typically saves 10–15%.' },
    ],
  },
  {
    slug: 'mckinney-tx',
    city: 'McKinney',
    state: 'Texas',
    stateCode: 'TX',
    county: 'Collin County',
    population: '205,000+',
    medianHomeValue: '$460,000',
    avgAutoRate: '$105–$155/mo',
    avgHealthRate: '$375–$510/mo',
    description: 'McKinney blends a charming historic downtown with rapidly expanding suburban neighborhoods. As home values rise and new construction booms, protecting your investment with the right policy is essential.',
    neighborhoods: ['Craig Ranch', 'Stonebridge Ranch', 'Tucker Hill', 'Adriatica', 'Eldorado'],
    faqs: [
      { q: 'What does homeowner insurance cover in McKinney TX?', a: 'A standard HO-3 policy covers your dwelling, personal property, liability, and additional living expenses. In North Texas, we also recommend wind/hail coverage given Collin County\'s storm exposure.' },
      { q: 'Can I get insurance for new construction in McKinney?', a: 'Yes. We work with carriers that specialize in newly built homes, including builder\'s risk policies during construction and standard HO-3 policies at closing.' },
      { q: 'How do I find the cheapest auto insurance in McKinney?', a: 'As an independent broker, we compare 20+ carriers to find the lowest rate for your driving profile. Bundling with home insurance and maintaining a clean record are the two biggest discounts.' },
      { q: 'Do I need renters insurance in McKinney?', a: 'If you\'re renting, your landlord\'s policy does not cover your personal belongings. Renters insurance in McKinney typically costs $15–$25/month and covers theft, fire, and liability.' },
    ],
  },
  {
    slug: 'allen-tx',
    city: 'Allen',
    state: 'Texas',
    stateCode: 'TX',
    county: 'Collin County',
    population: '105,000+',
    medianHomeValue: '$430,000',
    avgAutoRate: '$102–$148/mo',
    avgHealthRate: '$370–$500/mo',
    description: 'Allen is a premier suburb known for excellent schools, safe neighborhoods, and high quality of life. With strong home values and a predominantly owner-occupied housing stock, the right insurance coverage is a key part of protecting your investment.',
    neighborhoods: ['Twin Creeks', 'Watters Crossing', 'Cottonwood Bend', 'The Village at Allen', 'Ridgemont'],
    faqs: [
      { q: 'What is the best home insurance company in Allen TX?', a: 'There is no single best carrier — rates vary by home value, age, construction type, and claims history. We compare State Farm, Travelers, Chubb, and 17 others to find your best match.' },
      { q: 'Does Allen TX have hail risk?', a: 'Yes. Collin County is in the southern portion of the Dallas-Fort Worth hail corridor. We recommend verifying your policy includes wind and hail coverage with an acceptable deductible.' },
      { q: 'How much is health insurance for a family in Allen TX?', a: 'A family of four on a Silver ACA plan in Collin County typically pays $1,100–$1,600/month before subsidies. Subsidies are available for households earning up to 400% of the federal poverty level.' },
      { q: 'Can I bundle home and auto in Allen TX?', a: 'Yes, and it\'s usually the best way to save. Most carriers offer 10–20% off both policies when bundled. We\'ll show you side-by-side comparisons of bundled vs. separate pricing.' },
    ],
  },
  {
    slug: 'plano-tx',
    city: 'Plano',
    state: 'Texas',
    stateCode: 'TX',
    county: 'Collin County',
    population: '285,000+',
    medianHomeValue: '$410,000',
    avgAutoRate: '$108–$158/mo',
    avgHealthRate: '$380–$520/mo',
    description: 'Plano is home to dozens of Fortune 500 corporate headquarters and one of the most educated workforces in Texas. With a mix of established neighborhoods and luxury homes, Plano residents need coverage that matches their assets.',
    neighborhoods: ['West Plano', 'Willow Bend', 'Legacy', 'Spring Creek', 'Los Rios'],
    faqs: [
      { q: 'Is homeowner insurance required in Plano TX?', a: 'It is not legally required, but virtually all mortgage lenders require it. Even if you own your home outright, going uninsured in a high-value market like Plano carries significant financial risk.' },
      { q: 'What does liability coverage protect me from in Plano?', a: 'Personal liability on a homeowner policy covers you if someone is injured on your property or if you accidentally damage someone else\'s property. For high-net-worth households, we recommend a personal umbrella policy.' },
      { q: 'Are there group health insurance options in Plano for small businesses?', a: 'Yes. We offer group health insurance for businesses with 2+ employees. Plano has a large small-business community and strong carrier participation in the group market.' },
      { q: 'How do I lower my homeowner premium in Plano?', a: 'Common discounts include: impact-resistant roof (10–25% off), security system, claims-free history, bundling with auto, and raising your deductible. We\'ll identify every discount you qualify for.' },
    ],
  },
  {
    slug: 'the-colony-tx',
    city: 'The Colony',
    state: 'Texas',
    stateCode: 'TX',
    county: 'Denton County',
    population: '45,000+',
    medianHomeValue: '$340,000',
    avgAutoRate: '$98–$142/mo',
    avgHealthRate: '$360–$490/mo',
    description: 'The Colony sits on the shores of Lewisville Lake and offers affordable living close to the DFW metroplex. With lakefront properties and standard suburban homes, insurance needs vary widely across the city.',
    neighborhoods: ['The Tribute', 'Northshore', 'Stewart Creek Estates', 'Destination Hills', 'Cascades'],
    faqs: [
      { q: 'Do I need flood insurance for a lakefront home in The Colony?', a: 'Properties near Lewisville Lake may fall in FEMA flood zones. Standard homeowner policies exclude flood. We can help you assess your flood risk and quote NFIP or private flood coverage.' },
      { q: 'What is the average home insurance rate in The Colony TX?', a: 'Rates in The Colony range from $110–$180/month for a typical home in the $300K–$400K range, depending on carrier, deductible, and coverage level.' },
      { q: 'Can I insure a watercraft or boat in The Colony?', a: 'Yes. Boat and watercraft coverage is available as a standalone policy or endorsement. Given the proximity to Lewisville Lake, many residents add this to their portfolio.' },
      { q: 'Is health insurance available through the ACA marketplace in Denton County?', a: 'Yes. Denton County residents have access to ACA marketplace plans with multiple carrier options. We help you compare Silver, Gold, and Bronze plans and calculate any subsidy you may qualify for.' },
    ],
  },
  {
    slug: 'prosper-tx',
    city: 'Prosper',
    state: 'Texas',
    stateCode: 'TX',
    county: 'Collin / Denton County',
    population: '35,000+',
    medianHomeValue: '$580,000',
    avgAutoRate: '$115–$168/mo',
    avgHealthRate: '$390–$530/mo',
    description: 'Prosper is one of DFW\'s most rapidly developing luxury suburbs, with high-end master-planned communities and top-rated schools. High home values make comprehensive coverage critical.',
    neighborhoods: ['Windsong Ranch', 'Star Trail', 'Lakes of La Cima', 'Gentle Creek', 'Prestonwood'],
    faqs: [
      { q: 'What coverage do I need for a luxury home in Prosper TX?', a: 'High-value homes in Prosper (typically $500K+) benefit from a Chubb or Nationwide Prestige policy, which includes guaranteed replacement cost, better jewelry/art sublimits, and superior claims service.' },
      { q: 'How does new construction affect my insurance in Prosper?', a: 'New construction in Prosper may qualify for credits due to modern materials, fire suppression systems, and updated electrical. We make sure your builder\'s completion timeline is covered.' },
      { q: 'What auto discounts are available in Prosper TX?', a: 'Common discounts include good driver, multi-vehicle, new vehicle, advanced safety features (lane assist, auto-brake), and bundling with your homeowner policy.' },
      { q: 'Does my Prosper HOA affect my homeowner insurance?', a: 'Your HOA\'s master policy covers common areas but not your dwelling or personal property. You still need your own HO-6 or HO-3 policy. We can review your HOA docs to identify any coverage gaps.' },
    ],
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return CITIES.find(c => c.slug === slug);
}

export function getAllSlugs(): string[] {
  return CITIES.map(c => c.slug);
}
