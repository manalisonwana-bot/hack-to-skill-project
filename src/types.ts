export interface PersonalFootprint {
  // Household
  electricityKwh: number;
  naturalGasKwh: number;
  lpgKg: number;
  energySource: 'grid' | 'hybrid' | 'solar';

  // Transport
  carFuelType: 'gasoline' | 'diesel' | 'ev' | 'hybrid' | 'none';
  carKmPerYear: number;
  publicTransportKmPerYear: number;
  flightsHoursPerYear: number;

  // Diet & Lifestyle
  dietType: 'vegan' | 'vegetarian' | 'low-meat' | 'high-meat';
  locallySourcedPct: number; // 0 to 100
  foodWastePct: number; // 0 to 100
}

export interface WebsiteAudit {
  pageWeightKb: number;
  monthlyPageViews: number;
  isGreenHost: boolean;
  isCached: boolean;
  isMinified: boolean;
  imageOptimization: 'none' | 'basic' | 'high';
  securityHttps: boolean;
}

export interface AuditParameters {
  codeQuality: number; // 0-100
  security: number; // 0-100
  efficiency: number; // 0-100
  testing: number; // 0-100
  accessibility: number; // 0-100
  googleServices: number; // 0-100
  problemStatementAlignment: number; // 0-100
}

export interface TestCase {
  id: string;
  name: string;
  category: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message: string;
}

export interface AIRecResponse {
  totalCarbonKg: number;
  digitalCarbonKg: number;
  ecoScore: number;
  tips: {
    category: string;
    impact: 'High' | 'Medium' | 'Low';
    title: string;
    description: string;
  }[];
}
