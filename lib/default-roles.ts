export const ROLE_GROUPS: { label: string; roles: string[] }[] = [
  {
    label: 'Product',
    roles: [
      'Product Manager',
      'Senior Product Manager',
      'Principal Product Manager',
      'Group Product Manager',
      'Director of Product',
      'VP of Product',
      'Chief Product Officer',
    ],
  },
  {
    label: 'Engineering',
    roles: [
      'Software Engineer',
      'Senior Software Engineer',
      'Staff Engineer',
      'Principal Engineer',
      'Engineering Manager',
      'Director of Engineering',
      'VP of Engineering',
      'CTO',
    ],
  },
  {
    label: 'Design',
    roles: [
      'Product Designer',
      'Senior Designer',
      'Design Lead',
      'Head of Design',
      'VP of Design',
    ],
  },
  {
    label: 'Marketing & Growth',
    roles: [
      'Marketing Manager',
      'Growth PM',
      'Content Strategist',
      'Head of Marketing',
      'CMO',
    ],
  },
  {
    label: 'Data & Analytics',
    roles: [
      'Data Analyst',
      'Data Scientist',
      'Analytics Lead',
      'BI Engineer',
    ],
  },
  {
    label: 'Finance & Operations',
    roles: [
      'Finance Partner',
      'Financial Analyst',
      'COO',
      'CFO',
    ],
  },
  {
    label: 'Leadership & Cross-functional',
    roles: [
      'CEO',
      'Executive Sponsor',
      'Program Manager',
      'Chief of Staff',
      'General Manager',
    ],
  },
  {
    label: 'Relationship',
    roles: [
      'Direct Report',
      'Peer',
      'Manager',
      'Skip-Level Manager',
      'External Stakeholder',
      'Customer',
    ],
  },
]

export const DEFAULT_ROLES = ROLE_GROUPS.flatMap(g => g.roles)

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
