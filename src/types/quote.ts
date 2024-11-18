export interface QuoteData {
  companyName: string
  industry: string
  desiredDomain: string
  customIndustry?: string
  primaryGoal: string
  secondaryGoals: string[]
  targetAgeRange: string
  geographicFocus: string
  features: string[]
  colorScheme: string
  style: string
  websiteExamples: string
  numberOfPages: string
  hasOwnContent: boolean
  needsContentSupport: boolean
  seoRequirements: string[]
  budget: string
  deadline: string
  maintenanceContract: boolean
  needsTraining: boolean
  contactPerson: string
  email: string
  phone: string
  status?: string
} 