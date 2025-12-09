import React, { useState } from 'react';
import { UserPlus, Search, FileText, MoreHorizontal } from 'lucide-react';
import { Patient } from '../types';

interface PatientModuleProps {
  patients: Patient[];
  onAddPatient: (p: Patient) => void;
}

const PatientModule: React.FC<PatientModuleProps> = ({ patients, onAddPatient }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    insurance: 'Private',
    type: 'Outpatient'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: Patient = {
      id: `P-${Math.floor(Math.random() * 10000)}`,
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender as 'Male' | 'Female',
      admissionDate: new Date().toISOString().split('T')[0],
      status: formData.type as any,
      insuranceProvider: formData.insurance
    };
    onAddPatient(newPatient);
    setShowModal(false);
    setFormData({ name: '', age: '', gender: 'Male', insurance: 'Private', type: 'Outpatient' });
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Patient Management</h2>
          <p className="text-slate-500 text-sm">Clinical Admission, EMR & CRM</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
        >
          <UserPlus size={16} />
          Register Patient
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-medium">
            <tr>
              <th className="px-6 py-4">Patient ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Age/Gender</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Insurance</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{patient.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{patient.name}</div>
                  <div className="text-xs text-slate-400">Admitted: {patient.admissionDate}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{patient.age} / {patient.gender}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${patient.status === 'Inpatient' ? 'bg-purple-100 text-purple-800' : 
                      patient.status === 'Discharged' ? 'bg-slate-100 text-slate-800' : 'bg-green-100 text-green-800'}`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{patient.insuranceProvider}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-blue-600">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPatients.length === 0 && (
            <div className="p-8 text-center text-slate-500">No patients found.</div>
        )}
      </div>

      {/* Modal for New Patient */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">New Patient Registration</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                  <input required type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>Outpatient</option>
                  <option>Inpatient</option>
                  <option>Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Insurance</label>
                <select value={formData.insurance} onChange={e => setFormData({...formData, insurance: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>Private</option>
                  <option>National Health</option>
                  <option>Self Pay</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientModule;