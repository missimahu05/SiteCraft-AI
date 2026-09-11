export type LeadStatus = 
  | 'nouveau'
  | 'opportunite_creation' 
  | 'opportunite_refonte' 
  | 'qualifie' 
  | 'audité'
  | 'site_genere' 
  | 'généré'
  | 'contacte' 
  | 'contacté'
  | 'cloture'
  | 'clos';

export interface CriterionScores {
  modernite: number; // 0-10
  lisibilite: number; // 0-10
  cta: number; // 0-10
  visuels: number; // 0-10
}

export interface AuditResult {
  score_global: number;
  criteres?: CriterionScores;
  mobile?: number;
  seo?: number;
  performance?: number;
  points_forts?: string[];
  points_faibles?: string[];
  defauts_majeurs?: string[];
  eligible_refonte?: boolean;
  oldSiteScreenshot?: string;
  auditDate?: string;
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
  img?: string;
  features?: string[];
}

export interface FeexPayPayment {
  transactionId: string;
  leadId: string;
  leadTitle?: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED';
  phoneNumber: string;
  network: 'mtn' | 'moov' | 'orange' | 'wave' | 'celtiis' | 'card';
  shopId?: string;
  motif?: string;
  feexpayReference?: string;
  createdAt: string;
}

export interface BusinessProfile {
  id: string;
  title: string;
  rating: number;
  reviewsCount: number;
  category: string;
  phone: string;
  address: string;
  city?: string;
  website: string | null;
  photos: string[];
  screenshot_url?: string;
  tagline?: string;
  description?: string;
  openingHours?: string[];
  services?: ServiceItem[];
  topReviews?: ReviewItem[];
  status: LeadStatus;
  audit?: AuditResult;
  deploymentUrl?: string;
  cloudflareUrl?: string;
  customDomain?: string;
  claimed?: boolean;
  generatedSite?: {
    slug: string;
    cloudflareUrl: string;
    customDomain?: string;
    status: string;
    deployedAt?: string;
  };
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
