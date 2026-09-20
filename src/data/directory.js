// Illustrative sample data for the member directory and certificate
// verification pages. There is no backend yet (see src/lib/submitForm.js),
// so these pages work against this static list rather than a live register.
// Replace with a real data source — an API, a spreadsheet export, or a
// database query — once the Secretariat is issuing real memberships and
// certificates. Every name below is a fictional placeholder.

export const sampleMembers = [
  { name: 'Baobab Capital Partners', type: 'Organisation', category: 'Corporate', sector: 'Financial services', country: 'Ghana', since: 2026 },
  { name: 'Sahel Renewables Group', type: 'Organisation', category: 'Enterprise', sector: 'Energy and climate finance', country: 'Senegal', since: 2026 },
  { name: 'Kilimo Growers Cooperative', type: 'Organisation', category: 'Small and Growing', sector: 'Agriculture', country: 'Kenya', since: 2026 },
  { name: 'Nomad Builders Ltd', type: 'Organisation', category: 'Startup and Micro', sector: 'The built environment', country: 'Nigeria', since: 2026 },
  { name: 'Pan-African Mining Association', type: 'Organisation', category: 'Association and Affiliate', sector: 'Mining', country: 'South Africa', since: 2026 },
  { name: 'Delta Oilfield Services', type: 'Organisation', category: 'Corporate', sector: 'Oil and gas', country: 'Nigeria', since: 2026 },
  { name: 'Green Cities Infrastructure', type: 'Organisation', category: 'Enterprise', sector: 'Infrastructure and projects', country: 'Rwanda', since: 2026 },
  { name: 'Urban Waste Solutions', type: 'Organisation', category: 'Small and Growing', sector: 'Waste management', country: 'Ghana', since: 2026 },
  { name: 'Coastal Insurance Group', type: 'Organisation', category: 'Corporate', sector: 'Financial services', country: 'Kenya', since: 2026 },
  { name: 'EcoAgri Ventures', type: 'Organisation', category: 'Startup and Micro', sector: 'Agriculture', country: "Côte d'Ivoire", since: 2026 },
  { name: 'A. Mensah', type: 'Individual', category: 'Fellow', sector: 'Financial services', country: 'Ghana', since: 2026 },
  { name: 'K. Owusu', type: 'Individual', category: 'Member', sector: 'Mining', country: 'South Africa', since: 2026 },
  { name: 'N. Adjei', type: 'Individual', category: 'Associate', sector: 'Oil and gas', country: 'Nigeria', since: 2026 },
  { name: 'F. Suleiman', type: 'Individual', category: 'Affiliate or Student', sector: 'Agriculture', country: 'Kenya', since: 2026 },
  { name: 'R. Karanja', type: 'Individual', category: 'Member', sector: 'The built environment', country: 'Kenya', since: 2026 },
  { name: 'T. Diallo', type: 'Individual', category: 'Associate', sector: 'Energy and climate finance', country: 'Senegal', since: 2026 },
  { name: 'B. Okoro', type: 'Individual', category: 'Fellow', sector: 'Cities', country: 'Nigeria', since: 2026 },
  { name: 'L. Mwangi', type: 'Individual', category: 'Affiliate or Student', sector: 'Waste management', country: 'Kenya', since: 2026 },
  { name: 'C. Asante', type: 'Individual', category: 'Member', sector: 'Infrastructure and projects', country: 'Ghana', since: 2026 },
  { name: 'S. Abara', type: 'Individual', category: 'Associate', sector: 'Financial services', country: 'Nigeria', since: 2026 },
]

export const sampleCertificates = [
  { id: 'ACEL-EXP-2026-0006', holder: 'A. Mensah', level: 'Expert', issued: '2026-01', status: 'Active' },
  { id: 'ACEL-PRA-2026-0003', holder: 'N. Adjei', level: 'Practitioner', issued: '2026-02', status: 'Active' },
  { id: 'ACEL-PRA-2026-0009', holder: 'R. Karanja', level: 'Practitioner', issued: '2026-02', status: 'Active' },
  { id: 'ACEL-EXP-2026-0007', holder: 'K. Owusu', level: 'Expert', issued: '2026-03', status: 'Active' },
  { id: 'ACEL-EXP-2026-0008', holder: 'B. Okoro', level: 'Expert', issued: '2026-04', status: 'Active' },
  { id: 'ACEL-FND-2026-0002', holder: 'L. Mwangi', level: 'Foundation', issued: '2026-04', status: 'Active' },
  { id: 'ACEL-PRA-2026-0004', holder: 'T. Diallo', level: 'Practitioner', issued: '2026-05', status: 'Active' },
  { id: 'ACEL-PRA-2026-0005', holder: 'S. Abara', level: 'Practitioner', issued: '2026-06', status: 'Active' },
  { id: 'ACEL-FND-2026-0001', holder: 'F. Suleiman', level: 'Foundation', issued: '2026-03', status: 'Active' },
  { id: 'ACEL-FND-2025-0010', holder: 'C. Asante', level: 'Foundation', issued: '2025-12', status: 'Expired' },
]
