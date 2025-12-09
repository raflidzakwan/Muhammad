// Enums
export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  PATIENTS = 'PATIENTS',
  PHARMACY = 'PHARMACY',
  FINANCE = 'FINANCE',
}

export enum TransactionType {
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY'
}

// Data Models
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  admissionDate: string;
  status: 'Inpatient' | 'Outpatient' | 'Discharged';
  insuranceProvider: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Medicine' | 'Equipment' | 'Consumable';
  currentStock: number;
  unitPrice: number;
  reorderLevel: number;
  lastUsageRate: number; // units per week
}

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  accountCode: string; // e.g., 4001-Revenue, 5001-COGS
  relatedModuleId?: string; // Link to Patient ID or PO ID
}

export interface ForecastResult {
  itemId: string;
  itemName: string;
  predictedDemand: number;
  recommendedOrder: number;
  reasoning: string;
}

export interface InsightResult {
  title: string;
  insight: string;
  actionable: string;
  severity: 'low' | 'medium' | 'high';
}

export interface InvoiceData {
  vendorName: string;
  invoiceDate: string;
  totalAmount: number;
  lineItems: Array<{description: string, amount: number}>;
  confidence: number;
}