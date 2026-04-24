export const DEFAULT_ROLES = [
  // Product
  'Product Manager',
  'Senior Product Manager',
  'Principal Product Manager',
  'Group Product Manager',
  'Director of Product',
  'VP of Product',
  'Chief Product Officer',
  // Engineering
  'Software Engineer',
  'Senior Software Engineer',
  'Staff Engineer',
  'Principal Engineer',
  'Engineering Manager',
  'Director of Engineering',
  'VP of Engineering',
  'CTO',
  // Design
  'Product Designer',
  'Senior Designer',
  'Design Lead',
  'Head of Design',
  'VP of Design',
  // Data & Analytics
  'Data Analyst',
  'Data Scientist',
  'Analytics Lead',
  // Marketing & Growth
  'Marketing Manager',
  'Growth PM',
  'Head of Marketing',
  'CMO',
  // Finance
  'Finance Partner',
  'Financial Analyst',
  'CFO',
  // Leadership & Cross-functional
  'CEO',
  'COO',
  'Executive Sponsor',
  'Program Manager',
  'Chief of Staff',
  // Relationship roles
  'Direct Report',
  'Peer',
  'Manager',
  'Skip-Level Manager',
  'External Stakeholder',
  'Customer',
] as const

const CUSTOM_ROLES_KEY = 'signal_custom_roles'

export function getCustomRoles(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_ROLES_KEY) || '[]')
  } catch {
    return []
  }
}

export function addCustomRole(role: string): void {
  const roles = getCustomRoles()
  if (!roles.includes(role)) {
    roles.push(role)
    localStorage.setItem(CUSTOM_ROLES_KEY, JSON.stringify(roles))
  }
}

export function getAllRoles(): string[] {
  return [...DEFAULT_ROLES, ...getCustomRoles()]
}
