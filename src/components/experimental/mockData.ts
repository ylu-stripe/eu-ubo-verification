// Mock data for UBO verification flow

export interface BeneficialOwner {
  id: string;
  name: string;
  percentage: number;
  ownershipType: 'direct' | 'indirect';
  role?: string;
  isExisting?: boolean;
  // New properties for 2-way matching
  ownerGroup?: 'existing-match' | 'new-match' | 'unexpected';
  isPrefillMatch?: boolean;
}

export interface CompanyData {
  companyName: string;
  beneficialOwners: BeneficialOwner[];
  directors: BeneficialOwner[];
}

export interface UserSession {
  userId: string;
  companyId: string;
  entryPoint: 'email' | 'ash';
  isExistingUser: boolean;
  hasFailedKYB?: boolean;
  isHighRisk?: boolean;
}

// Mock government database response (prefill data)
export const mockCompanyData: CompanyData = {
  companyName: "Cactus Practice LLC",
  beneficialOwners: [
    {
      id: "owner_1",
      name: "Tony Stark",
      percentage: 45,
      ownershipType: "direct",
      isPrefillMatch: true
    },
    {
      id: "owner_2", 
      name: "Peper Pots",
      percentage: 35,
      ownershipType: "direct",
      isPrefillMatch: true
    },
    {
      id: "owner_3",
      name: "Peter Parker", 
      percentage: 20,
      ownershipType: "indirect",
      isPrefillMatch: true
    }
  ],
  directors: [
    {
      id: "director_1",
      name: "James Rhodes",
      percentage: 0,
      ownershipType: "direct",
      role: "Chief Executive Officer",
      isPrefillMatch: true
    },
    {
      id: "director_2", 
      name: "Happy Hogan",
      percentage: 0,
      ownershipType: "direct",
      role: "Chief Financial Officer",
      isPrefillMatch: true
    },
    {
      id: "director_3",
      name: "May Parker",
      percentage: 0,
      ownershipType: "direct", 
      role: "Board Member",
      isPrefillMatch: true
    }
  ]
};

// Mock 2-way matching scenario with existing user data
export const mockTwoWayMatchingData: CompanyData = {
  companyName: "Cactus Practice LLC",
  beneficialOwners: [
    // Group A: Existing matches (already in system, match prefill)
    {
      id: "owner_1",
      name: "Tony Stark",
      percentage: 45,
      ownershipType: "direct",
      isExisting: true,
      ownerGroup: 'existing-match',
      isPrefillMatch: true
    },
    // Group B: New matches (not in system, but match prefill)
    {
      id: "owner_2", 
      name: "Peper Pots",
      percentage: 35,
      ownershipType: "direct",
      ownerGroup: 'new-match',
      isPrefillMatch: true
    },
    // Group C: Unexpected owners (in system, but don't match prefill)
    {
      id: "owner_unexpected_1",
      name: "Bruce Banner",
      percentage: 15,
      ownershipType: "direct",
      isExisting: true,
      ownerGroup: 'unexpected',
      isPrefillMatch: false
    },
    {
      id: "owner_unexpected_2",
      name: "Natasha Romanoff",
      percentage: 5,
      ownershipType: "indirect",
      isExisting: true,
      ownerGroup: 'unexpected',
      isPrefillMatch: false
    }
  ],
  directors: [
    // Similar grouping for directors
    {
      id: "director_1",
      name: "James Rhodes",
      percentage: 0,
      ownershipType: "direct",
      role: "Chief Executive Officer",
      isExisting: true,
      ownerGroup: 'existing-match',
      isPrefillMatch: true
    },
    {
      id: "director_unexpected_1", 
      name: "Steve Rogers",
      percentage: 0,
      ownershipType: "direct",
      role: "Operations Manager",
      isExisting: true,
      ownerGroup: 'unexpected',
      isPrefillMatch: false
    }
  ]
};

// Mock existing user with some owners already in system
export const mockExistingUserData: CompanyData = {
  ...mockCompanyData,
  beneficialOwners: [
    {
      id: "owner_1",
      name: "Sarah Johnson",
      percentage: 45,
      ownershipType: 'direct',
      role: "CEO & Founder",
      isExisting: true
    },
    {
      id: "owner_4",
      name: "David Wilson", // Different from gov data
      percentage: 55,
      ownershipType: 'direct',
      role: "Partner",
      isExisting: true
    }
  ]
};

// Mock user sessions for different scenarios
export const mockUserSessions: UserSession[] = [
  {
    userId: "user_new_email",
    companyId: "comp_123",
    entryPoint: 'email',
    isExistingUser: false
  },
  {
    userId: "user_existing_ash", 
    companyId: "comp_123",
    entryPoint: 'ash',
    isExistingUser: true
  },
  {
    userId: "user_kyb_failed",
    companyId: "comp_123", 
    entryPoint: 'email',
    isExistingUser: true,
    hasFailedKYB: true
  },
  {
    userId: "user_high_risk",
    companyId: "comp_123",
    entryPoint: 'ash', 
    isExistingUser: false,
    isHighRisk: true
  }
];

// Helper functions to get mock data
export const getMockCompanyData = (isExistingUser: boolean): CompanyData => {
  return isExistingUser ? mockExistingUserData : mockCompanyData;
};

export const getMockUserSession = (sessionType: string = 'new_email'): UserSession => {
  const sessions = {
    'new_email': mockUserSessions[0],
    'existing_ash': mockUserSessions[1], 
    'kyb_failed': mockUserSessions[2],
    'high_risk': mockUserSessions[3]
  };
  return sessions[sessionType as keyof typeof sessions] || mockUserSessions[0];
}; 