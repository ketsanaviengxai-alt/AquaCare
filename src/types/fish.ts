export type WaterType = 'Freshwater' | 'Saltwater';

export type CareLevel = 'Beginner' | 'Intermediate' | 'Expert';

export type Temperament = 'Peaceful' | 'Semi-Aggressive' | 'Aggressive' | 'Schooling' | 'Territorial';

export type DietType = 'Omnivore' | 'Carnivore' | 'Herbivore';

export type SwimmingLevel = 'Top' | 'Middle' | 'Bottom' | 'All Levels';

export interface FishSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  family: string;
  category: string;
  waterType: WaterType;
  careLevel: CareLevel;
  temperament: Temperament;
  diet: DietType;
  swimmingLevel: SwimmingLevel;
  
  // Water Parameters
  tempMinC: number;
  tempMaxC: number;
  tempMinF: number;
  tempMaxF: number;
  phMin: number;
  phMax: number;
  hardnessMinDgh?: number;
  hardnessMaxDgh?: number;
  specificGravity?: string; // For saltwater
  
  // Tank Requirements
  minTankSizeGallons: number;
  minTankSizeLiters: number;
  maxSizeInches: number;
  maxSizeCm: number;
  lifespanYears: string;
  schoolingSize?: string;
  waterFlow: 'Gentle' | 'Moderate' | 'Strong';
  
  // Image & Aesthetics
  imageUrl: string;
  accentColor: string;
  swimSpeedSec: number;
  
  // Guide Information (Strictly English)
  origin: string;
  description: string;
  dietDetails: string;
  tankSetup: string;
  compatibleTankMates: string[];
  incompatibleTankMates: string[];
  careTips: string[];
}

export interface TankEnvironment {
  waterType: WaterType;
  temperatureC: number;
  ph: number;
  lightingMode: 'Daylight' | 'Dusk' | 'Actinic Night';
  aeration: boolean;
}
