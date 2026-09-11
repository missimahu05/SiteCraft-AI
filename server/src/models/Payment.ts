import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  transactionId: string;
  leadId: string;
  leadTitle?: string;
  amount: number;
  currency: string; // XOF, EUR, USD
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED';
  phoneNumber: string;
  network: 'mtn' | 'moov' | 'orange' | 'wave' | 'celtiis' | 'card' | 'other';
  shopId?: string;
  motif?: string;
  callbackInfo?: string;
  feexpayReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  transactionId: { type: String, required: true, unique: true, index: true },
  leadId: { type: String, required: true, index: true },
  leadTitle: { type: String, default: '' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'XOF' },
  status: { type: String, default: 'PENDING' },
  phoneNumber: { type: String, required: true },
  network: { type: String, default: 'mtn' },
  shopId: { type: String, default: '' },
  motif: { type: String, default: 'Activation Site Web - Forfait Unique' },
  callbackInfo: { type: String, default: '' },
  feexpayReference: { type: String, default: '' }
}, {
  timestamps: true
});

export const PaymentModel = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
