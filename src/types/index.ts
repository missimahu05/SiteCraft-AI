export type LeadStatus = 
  | 'opportunite_creation' 
  | 'opportunite_refonte' 
  | 'qualifie' 
  | 'site_genere' 
  | 'contacte' 
  | 'cloture';

export interface CriterionScores {
  modernite: number; // 0-10
  lisibilite: number; // 0-10
  cta: number; // 0-10
  visuels: number; // 0-10
}

export interface AuditResult {
  score_global: number;
  criteres: CriterionScores;
  defauts_majeurs: string[];
  eligible_refonte: boolean;
  oldSiteScreenshot?: string;
  auditDate: string;
}

export interface ReviewItem {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface ServiceItem {
  name: string;
  description: string;
  price?: string;
  badge?: string;
}

export interface BusinessProfile {
  id: string;
  title: string;
  rating: number;
  reviewsCount: number;
  category: string;
  phone: string;
  address: string;
  website: string | null;
  photos: string[];
  tagline: string;
  description: string;
  openingHours: string[];
  services: ServiceItem[];
  topReviews: ReviewItem[];
  status: LeadStatus;
  audit?: AuditResult;
  deploymentUrl?: string;
  stripeCheckoutUrl?: string;
  claimed?: boolean;
}

export interface StripeEvent {
  id: string;
  type: string;
  amount: number;
  businessName: string;
  domain: string;
  status: 'paid' | 'pending' | 'processing';
  timestamp: string;
  webhookTriggered: {
    n8nWorkflow: boolean;
    domainTicket: boolean;
    twilioSms: boolean;
    prodTransition: boolean;
  };
}

export type ActiveTab = 'discovery' | 'audit' | 'generator' | 'outreach' | 'closing';
