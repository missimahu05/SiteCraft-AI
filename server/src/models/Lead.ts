import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  id: string;
  title: string;
  category: string;
  address: string;
  city?: string;
  phone?: string;
  website?: string;
  rating: number;
  reviewsCount: number;
  photos: string[];
  lat?: number;
  lng?: number;
  screenshot_url?: string;
  audit?: {
    score_global: string;
    mobile: number;
    seo: number;
    performance: number;
    points_forts: string[];
    points_faibles: string[];
  };
  generatedSite?: {
    slug: string;
    cloudflareUrl: string;
    customDomain?: string;
    status: 'building' | 'deployed' | 'error';
    deployedAt?: Date;
  };
  status: 'nouveau' | 'audité' | 'généré' | 'contacté' | 'clos';
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  phone: { type: String, default: '' },
  website: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  lat: { type: Number, default: 9.3371 },
  lng: { type: Number, default: 2.6303 },
  photos: { type: [String], default: [] },
  screenshot_url: { type: String, default: '' },
  audit: {
    score_global: { type: String, default: '4.5' },
    mobile: { type: Number, default: 40 },
    seo: { type: Number, default: 45 },
    performance: { type: Number, default: 50 },
    points_forts: { type: [String], default: [] },
    points_faibles: { type: [String], default: [] }
  },
  generatedSite: {
    slug: { type: String, default: '' },
    cloudflareUrl: { type: String, default: '' },
    customDomain: { type: String, default: '' },
    status: { type: String, default: 'deployed' },
    deployedAt: { type: Date }
  },
  status: { type: String, default: 'nouveau' }
}, {
  timestamps: true
});

export const LeadModel = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
