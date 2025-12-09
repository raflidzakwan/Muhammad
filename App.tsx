import React, { useState } from 'react';
import { LayoutGrid, Users, Pill, Banknote, Menu, X, Bell } from 'lucide-react';
import Dashboard from './components/Dashboard';
import PatientModule from './components/PatientModule';
import PharmacyModule from './components/PharmacyModule';
import FinanceModule from './components/FinanceModule';
import { ModuleType, Patient, InventoryItem, FinancialTransaction, TransactionType } from './types';

// --- MOCK DATA INITIALIZATION ---
const INITIAL_PATIENTS: Patient[] = [
  { id: 'P-1001', name: 'Sarah Connor', age: 34, gender: 'Female', admissionDate: '2023-10-20', status: 'Inpatient', insuranceProvider: 'Aetna' },
  { id: 'P-1002', name: 'John Doe', age: 45, gender: 'Male', admissionDate: '2023-10-21', status: 'Outpatient', insuranceProvider: 'BlueCross' },
  { id: 'P-1003', name: 'Emily Blunt', age: 28, gender: 'Female', admissionDate: '2023-10-22', status: 'Inpatient', insuranceProvider: 'Private' },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'INV-001', name: 'Amoxicillin 500mg', category: 'Medicine', currentStock: 120, unitPrice: 15, reorderLevel: 150, lastUsageRate: 45 },
  { id: 'INV-002', name: 'Surgical Masks', category: 'Consumable', currentStock: 4500, unitPrice: 0.5, reorderLevel: 1000, lastUsageRate: 500 },
  { id: 'INV-003', name: 'Paracetamol IV', category: 'Medicine', currentStock: 40, unitPrice: 25, reorderLevel: 50, lastUsageRate: 15 },
  { id: 'INV-004', name: 'MRI Contrast Dye', category: 'Consumable', currentStock: 12, unitPrice: 200, reorderLevel: 10, lastUsageRate: 4 },
];

const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  { id: 'TXN-9001', date: '2023-10-24', description: 'Patient P-1001 Service Payment', amount: 1200, type: TransactionType.REVENUE, accountCode: '4001' },
  { id: 'TXN-9002', date: '2023-10-24', description: 'Pharmacy Restock: Vendor ABC', amount: 4500, type: TransactionType.EXPENSE, accountCode: '5001' },
  { id: 'TXN-9003', date: '2023-10-23', description: 'Utilities - Electricity', amount: 850, type: TransactionType.EXPENSE, accountCode: '5002' },
  { id: 'TXN-9004', date: '2023-10-22', description: 'Insurance Claim P-0098', amount: 3200, type: TransactionType.REVENUE, accountCode: '4002' },
];

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Central State - Single Source of Truth
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [inventory] = useState<InventoryItem[]>(INITIAL_INVENTORY); // In real app, setInventory would be used
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);

  // --- INTEGRATION LOGIC ---
  // When a patient is registered, we assume a registration fee is collected (Simulated Integration)
  const addPatient = (patient: Patient) => {
    setPatients(prev => [patient, ...prev]);
    
    // Auto-generate GL Entry (Integration)
    const newTxn: FinancialTransaction = {
      id: `TXN-${Math.floor(Math.random() * 90000) + 10000}`,
      date: new Date().toISOString().split('T')[0],
      description: `Registration Fee: ${patient.name} (${patient.id})`,
      amount: 150, // Flat fee
      type: TransactionType.REVENUE,
      accountCode: '4001',
      relatedModuleId: patient.id
    };
    setTransactions(prev => [newTxn, ...prev]);
  };

  const addTransaction = (txn: FinancialTransaction) => {
    setTransactions(prev => [txn, ...prev]);
  };

  const NavItem = ({ module, icon: Icon, label }: { module: ModuleType, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveModule(module);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        ${activeModule === module 
          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-200' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center gap-2 px-4 py-6 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">M</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Medius-AI</h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Hospital ERP</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            <NavItem module={ModuleType.DASHBOARD} icon={LayoutGrid} label="Dashboard" />
            <NavItem module={ModuleType.PATIENTS} icon={Users} label="Patient Mgmt" />
            <NavItem module={ModuleType.PHARMACY} icon={Pill} label="Pharmacy & Ops" />
            <NavItem module={ModuleType.FINANCE} icon={Banknote} label="Finance & GL" />
          </nav>

          <div className="mt-auto px-4 py-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Dr. A. Smith</p>
                <p className="text-xs text-slate-500">Chief Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-slate-500">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
          
          <div className="flex-1 lg:flex-none"></div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeModule === ModuleType.DASHBOARD && <Dashboard transactions={transactions} />}
            {activeModule === ModuleType.PATIENTS && <PatientModule patients={patients} onAddPatient={addPatient} />}
            {activeModule === ModuleType.PHARMACY && <PharmacyModule inventory={inventory} />}
            {activeModule === ModuleType.FINANCE && <FinanceModule transactions={transactions} onAddTransaction={addTransaction} />}
          </div>
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default App;