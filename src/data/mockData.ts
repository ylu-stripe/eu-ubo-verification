// Mock data for UBO verification flow

export interface BeneficialOwner {
  id: string;
  name: string;
  percentage: number;
  ownershipType: 'direct' | 'indirect';
  role?: string;
  isExisting?: boolean;
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

// Mock government database response
export const mockCompanyData: CompanyData = {
  companyName: "Cactus Practice LLC",
  beneficialOwners: [
    {
      id: "owner_1",
      name: "Tony Stark",
      percentage: 45,
      ownershipType: "direct",
    },
    {
      id: "owner_2", 
      name: "Peper Pots",
      percentage: 35,
      ownershipType: "direct",
    },
    {
      id: "owner_3",
      name: "Peter Parker", 
      percentage: 20,
      ownershipType: "indirect",
    }
  ],
  directors: [
    {
      id: "director_1",
      name: "James Rhodes",
      percentage: 0,
      ownershipType: "direct",
      role: "Chief Executive Officer"
    },
    {
      id: "director_2", 
      name: "Happy Hogan",
      percentage: 0,
      ownershipType: "direct",
      role: "Chief Financial Officer"
    },
    {
      id: "director_3",
      name: "May Parker",
      percentage: 0,
      ownershipType: "direct", 
      role: "Board Member"
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