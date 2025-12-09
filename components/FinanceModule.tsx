import React, { useState } from 'react';
import { DollarSign, FileText, ArrowUpRight, ArrowDownLeft, Upload, CheckCircle } from 'lucide-react';
import { FinancialTransaction, TransactionType, InvoiceData } from '../types';
import { parseInvoiceText } from '../services/geminiService';

interface FinanceModuleProps {
  transactions: FinancialTransaction[];
  onAddTransaction: (t: FinancialTransaction) => void;
}

const FinanceModule: React.FC<FinanceModuleProps> = ({ transactions, onAddTransaction }) => {
  const [invoiceText, setInvoiceText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [parsedInvoice, setParsedInvoice] = useState<InvoiceData | null>(null);

  const handleProcessInvoice = async () => {
    if (!invoiceText) return;
    setProcessing(true);
    const result = await parseInvoiceText(invoiceText);
    setParsedInvoice(result);
    setProcessing(false);
  };

  const confirmInvoice = () => {
    if (parsedInvoice) {
      // Automatically create a GL entry from the AI parsed data
      // This enforces Single Source of Truth
      const newTransaction: FinancialTransaction = {
        id: `TXN-${Math.floor(Math.random() * 100000)}`,
        date: parsedInvoice.invoiceDate || new Date().toISOString().split('T')[0],
        description: `Inv: ${parsedInvoice.vendorName} - ${parsedInvoice.lineItems[0]?.description || 'General'}`,
        amount: parsedInvoice.totalAmount,
        type: TransactionType.EXPENSE,
        accountCode: '5001', // AP/Expense
      };
      onAddTransaction(newTransaction);
      setParsedInvoice(null);
      setInvoiceText('');
      alert("Invoice posted to General Ledger successfully.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Financial Hub</h2>
          <p className="text-slate-500 text-sm">General Ledger & Automated Accounting</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: AI Invoice Processor */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Upload size={18} className="text-blue-500" />
              Smart Invoice Entry
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Paste OCR text from vendor invoices here. AI will structure it and prepare the GL entry.
            </p>
            <textarea 
              className="w-full flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-3"
              placeholder="PASTE INVOICE TEXT HERE...&#10;Example:&#10;Vendor: MedSupply Corp&#10;Date: 2023-10-25&#10;Items: Surgical Gloves (50 boxes) - $500&#10;Total: $500"
              value={invoiceText}
              onChange={(e) => setInvoiceText(e.target.value)}
              rows={8}
            />
            <button 
              onClick={handleProcessInvoice}
              disabled={processing || !invoiceText}
              className="w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Analyze & Draft Entry'}
            </button>
          </div>

          {parsedInvoice && (
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm animate-in fade-in zoom-in">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-emerald-900 text-sm">Review Draft</h4>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">
                  {(parsedInvoice.confidence * 100).toFixed(0)}% Match
                </span>
              </div>
              <div className="text-xs space-y-1 text-emerald-800 mb-3">
                <p><strong>Vendor:</strong> {parsedInvoice.vendorName}</p>
                <p><strong>Date:</strong> {parsedInvoice.invoiceDate}</p>
                <p><strong>Total:</strong> ${parsedInvoice.totalAmount.toLocaleString()}</p>
              </div>
              <button 
                onClick={confirmInvoice}
                className="w-full py-1.5 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700 flex justify-center items-center gap-2"
              >
                <CheckCircle size={14} />
                Post to Ledger
              </button>
            </div>
          )}
        </div>

        {/* Right: General Ledger */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">General Ledger (Single Source of Truth)</h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">Live Sync</span>
          </div>
          <div className="overflow-y-auto max-h-[600px] flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-medium sticky top-0">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Transaction ID</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3 text-right">Debit</th>
                  <th className="px-6 py-3 text-right">Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 group">
                    <td className="px-6 py-3 text-slate-500 font-mono text-xs">{txn.date}</td>
                    <td className="px-6 py-3 text-slate-900 font-medium text-xs">{txn.id}</td>
                    <td className="px-6 py-3 text-slate-700">
                      <div className="flex items-center gap-2">
                        {txn.type === TransactionType.REVENUE ? (
                          <div className="p-1 bg-green-100 rounded text-green-600"><ArrowDownLeft size={12}/></div>
                        ) : (
                          <div className="p-1 bg-red-100 rounded text-red-600"><ArrowUpRight size={12}/></div>
                        )}
                        {txn.description}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Acc: {txn.accountCode}</div>
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-slate-600">
                      {txn.type === TransactionType.EXPENSE || txn.type === TransactionType.ASSET 
                        ? `$${txn.amount.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-slate-600">
                      {txn.type === TransactionType.REVENUE || txn.type === TransactionType.LIABILITY 
                        ? `$${txn.amount.toLocaleString()}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceModule;