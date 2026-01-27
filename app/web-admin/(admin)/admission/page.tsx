"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdmissionStep {
  _id?: string;
  step: number;
  title: string;
  description: string;
}

interface ImportantDate {
  _id?: string;
  date: string;
  event: string;
}

interface EligibilityCriteria {
  _id?: string;
  class: string;
  requirement: string;
}

interface AdmissionData {
  admissionSteps: AdmissionStep[];
  documentRequirements: string[];
  importantDates: ImportantDate[];
  eligibilityCriteria: EligibilityCriteria[];
  importantNotes?: string[];
  admissionTestDetails?: string[];
  feeInformation?: string[];
  contactInfo?: {
    email: string;
    phone: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: AdmissionData;
  timestamp: string;
  error?: string;
}

export default function AdminAdmissionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<AdmissionData | null>(null);
  const [activeTab, setActiveTab] = useState('steps');
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);

  // Color palette for admin interface
  const colors = {
    primaryBlue: "#2563EB",
    secondaryTeal: "#0D9488",
    accentGreen: "#16A34A",
    accentYellow: "#F59E0B",
    accentRed: "#DC2626",
    background: "#F8FAFC",
    card: "#FFFFFF",
    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  };

  // Fetch admission data
  useEffect(() => {
    fetchAdmissionData();
  }, []);

  const fetchAdmissionData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admission');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load admission data');
      }
      
      setData(result.data);
    } catch (err) {
      console.error('Error fetching admission data:', err);
      // Initialize with empty data structure if API fails
      setData({
        admissionSteps: [],
        documentRequirements: [],
        importantDates: [],
        eligibilityCriteria: [],
        importantNotes: [],
        admissionTestDetails: [],
        feeInformation: [],
        contactInfo: {
          email: 'admissions@school.edu.pk',
          phone: '021-111-222-333'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Save admission data
  const saveAdmissionData = async (section: string, updatedData: any) => {
    try {
      setSaving(true);
      
      // Prepare the payload based on section
      let payload = {};
      if (section === 'steps') {
        payload = { admissionSteps: updatedData };
      } else if (section === 'documents') {
        payload = { documentRequirements: updatedData };
      } else if (section === 'dates') {
        payload = { importantDates: updatedData };
      } else if (section === 'eligibility') {
        payload = { eligibilityCriteria: updatedData };
      } else if (section === 'notes') {
        payload = { importantNotes: updatedData };
      } else if (section === 'test') {
        payload = { admissionTestDetails: updatedData };
      } else if (section === 'fee') {
        payload = { feeInformation: updatedData };
      } else if (section === 'contact') {
        payload = { contactInfo: updatedData };
      }

      const response = await fetch('/api/admission/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setData(prev => ({
          ...prev!,
          ...payload
        }));
        
        // Exit edit mode
        setEditMode(null);
        setEditData(null);
        
        // Show success message
        alert('Data saved successfully!');
      }
    } catch (error) {
      console.error('Error saving admission data:', error);
      alert('Failed to save data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle edit actions
  const handleEdit = (section: string, item?: any, index?: number) => {
    setEditMode(section);
    
    if (section === 'new-step') {
      setEditData({ step: (data?.admissionSteps.length || 0) + 1, title: '', description: '' });
    } else if (section === 'edit-step' && index !== undefined) {
      setEditData({ ...item, index });
    } else if (section === 'new-document') {
      setEditData({ text: '' });
    } else if (section === 'edit-document' && index !== undefined) {
      setEditData({ text: item, index });
    } else if (section === 'new-date') {
      setEditData({ date: '', event: '' });
    } else if (section === 'edit-date' && index !== undefined) {
      setEditData({ ...item, index });
    } else if (section === 'new-eligibility') {
      setEditData({ class: '', requirement: '' });
    } else if (section === 'edit-eligibility' && index !== undefined) {
      setEditData({ ...item, index });
    } else if (section === 'new-note') {
      setEditData({ text: '' });
    } else if (section === 'edit-note' && index !== undefined) {
      setEditData({ text: item, index });
    } else if (section === 'new-test-detail') {
      setEditData({ text: '' });
    } else if (section === 'edit-test-detail' && index !== undefined) {
      setEditData({ text: item, index });
    } else if (section === 'new-fee-info') {
      setEditData({ text: '' });
    } else if (section === 'edit-fee-info' && index !== undefined) {
      setEditData({ text: item, index });
    } else if (section === 'contact') {
      setEditData({ ...data?.contactInfo });
    }
  };

  // Handle save
  const handleSave = (section: string) => {
    if (!editData) return;

    let updatedData: any = [];

    if (section === 'steps') {
      if (editData.index !== undefined) {
        // Edit existing step
        updatedData = [...(data?.admissionSteps || [])];
        updatedData[editData.index] = {
          step: editData.step,
          title: editData.title,
          description: editData.description
        };
      } else {
        // Add new step
        updatedData = [...(data?.admissionSteps || []), {
          step: editData.step,
          title: editData.title,
          description: editData.description
        }];
      }
    } else if (section === 'documents') {
      if (editData.index !== undefined) {
        updatedData = [...(data?.documentRequirements || [])];
        updatedData[editData.index] = editData.text;
      } else {
        updatedData = [...(data?.documentRequirements || []), editData.text];
      }
    } else if (section === 'dates') {
      if (editData.index !== undefined) {
        updatedData = [...(data?.importantDates || [])];
        updatedData[editData.index] = {
          date: editData.date,
          event: editData.event
        };
      } else {
        updatedData = [...(data?.importantDates || []), {
          date: editData.date,
          event: editData.event
        }];
      }
    } else if (section === 'eligibility') {
      if (editData.index !== undefined) {
        updatedData = [...(data?.eligibilityCriteria || [])];
        updatedData[editData.index] = {
          class: editData.class,
          requirement: editData.requirement
        };
      } else {
        updatedData = [...(data?.eligibilityCriteria || []), {
          class: editData.class,
          requirement: editData.requirement
        }];
      }
    } else if (section === 'notes') {
      if (editData.index !== undefined) {
        updatedData = [...(data?.importantNotes || [])];
        updatedData[editData.index] = editData.text;
      } else {
        updatedData = [...(data?.importantNotes || []), editData.text];
      }
    } else if (section === 'test') {
      if (editData.index !== undefined) {
        updatedData = [...(data?.admissionTestDetails || [])];
        updatedData[editData.index] = editData.text;
      } else {
        updatedData = [...(data?.admissionTestDetails || []), editData.text];
      }
    } else if (section === 'fee') {
      if (editData.index !== undefined) {
        updatedData = [...(data?.feeInformation || [])];
        updatedData[editData.index] = editData.text;
      } else {
        updatedData = [...(data?.feeInformation || []), editData.text];
      }
    } else if (section === 'contact') {
      saveAdmissionData('contact', editData);
      return;
    }

    saveAdmissionData(section, updatedData);
  };

  // Handle delete
  const handleDelete = (section: string, index: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    let updatedData: any = [];

    if (section === 'steps') {
      updatedData = data?.admissionSteps.filter((_, i) => i !== index) || [];
    } else if (section === 'documents') {
      updatedData = data?.documentRequirements.filter((_, i) => i !== index) || [];
    } else if (section === 'dates') {
      updatedData = data?.importantDates.filter((_, i) => i !== index) || [];
    } else if (section === 'eligibility') {
      updatedData = data?.eligibilityCriteria.filter((_, i) => i !== index) || [];
    } else if (section === 'notes') {
      updatedData = data?.importantNotes?.filter((_, i) => i !== index) || [];
    } else if (section === 'test') {
      updatedData = data?.admissionTestDetails?.filter((_, i) => i !== index) || [];
    } else if (section === 'fee') {
      updatedData = data?.feeInformation?.filter((_, i) => i !== index) || [];
    }

    saveAdmissionData(section, updatedData);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: colors.background }}>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Admission Management
          </h1>
          <p className="text-gray-600">
            Manage admission procedures, requirements, and important information
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b" style={{ borderColor: colors.border }}>
            {['steps', 'documents', 'dates', 'eligibility', 'notes', 'test', 'fee', 'contact'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === tab 
                  ? `border-b-2 ${tab === 'steps' ? 'border-blue-600 text-blue-600' : 
                    tab === 'documents' ? 'border-green-600 text-green-600' :
                    tab === 'dates' ? 'border-yellow-600 text-yellow-600' :
                    tab === 'eligibility' ? 'border-teal-600 text-teal-600' :
                    tab === 'notes' ? 'border-purple-600 text-purple-600' :
                    tab === 'test' ? 'border-orange-600 text-orange-600' :
                    tab === 'fee' ? 'border-red-600 text-red-600' :
                    'border-gray-600 text-gray-600'}`
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                {tab === 'steps' && 'Admission Steps'}
                {tab === 'documents' && 'Document Requirements'}
                {tab === 'dates' && 'Important Dates'}
                {tab === 'eligibility' && 'Eligibility Criteria'}
                {tab === 'notes' && 'Important Notes'}
                {tab === 'test' && 'Test Details'}
                {tab === 'fee' && 'Fee Information'}
                {tab === 'contact' && 'Contact Information'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          
          {/* Admission Steps Section */}
          {activeTab === 'steps' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  Admission Procedure Steps
                </h2>
                <button
                  onClick={() => handleEdit('new-step')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Step
                </button>
              </div>

              {/* Edit Step Form */}
              {editMode && editMode.includes('step') && (
                <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                  <h3 className="text-lg font-bold mb-4">
                    {editMode === 'new-step' ? 'Add New Step' : 'Edit Step'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Step Number</label>
                      <input
                        type="number"
                        value={editData.step}
                        onChange={(e) => setEditData({...editData, step: parseInt(e.target.value)})}
                        className="w-full p-2 border rounded"
                        style={{ borderColor: colors.border }}
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={editData.title}
                        onChange={(e) => setEditData({...editData, title: e.target.value})}
                        className="w-full p-2 border rounded"
                        style={{ borderColor: colors.border }}
                        placeholder="Enter step title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={editData.description}
                        onChange={(e) => setEditData({...editData, description: e.target.value})}
                        className="w-full p-2 border rounded"
                        style={{ borderColor: colors.border }}
                        rows={3}
                        placeholder="Enter step description"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave('steps')}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Step'}
                      </button>
                      <button
                        onClick={() => { setEditMode(null); setEditData(null); }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        style={{ borderColor: colors.border }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Steps List */}
              <div className="space-y-6">
                {data?.admissionSteps.sort((a, b) => a.step - b.step).map((step, index) => (
                  <div key={index} className="p-6 rounded-lg border" style={{ borderColor: colors.border }}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" 
                          style={{ backgroundColor: colors.primaryBlue }}>
                          {step.step}
                        </div>
                        <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                          {step.title}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit('edit-step', step, index)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete('steps', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Requirements Section */}
          {activeTab === 'documents' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  Document Requirements
                </h2>
                <button
                  onClick={() => handleEdit('new-document')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Document
                </button>
              </div>

              {/* Edit Document Form */}
              {editMode && editMode.includes('document') && (
                <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                  <h3 className="text-lg font-bold mb-4">
                    {editMode === 'new-document' ? 'Add New Document Requirement' : 'Edit Document Requirement'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Document Requirement</label>
                      <textarea
                        value={editData.text}
                        onChange={(e) => setEditData({...editData, text: e.target.value})}
                        className="w-full p-2 border rounded"
                        style={{ borderColor: colors.border }}
                        rows={3}
                        placeholder="Enter document requirement description"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave('documents')}
                        disabled={saving}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Document'}
                      </button>
                      <button
                        onClick={() => { setEditMode(null); setEditData(null); }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        style={{ borderColor: colors.border }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents List */}
              <div className="space-y-3">
                {data?.documentRequirements.map((doc, index) => (
                  <div key={index} className="flex items-start justify-between p-4 rounded-lg hover:bg-gray-50">
                    <div className="flex items-start">
                      <span className="mr-3 mt-1 w-6 h-6 rounded-full flex items-center justify-center" 
                        style={{ backgroundColor: `${colors.accentGreen}15`, color: colors.accentGreen }}>
                        {index + 1}
                      </span>
                      <span>{doc}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit('edit-document', doc, index)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete('documents', index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Dates Section */}
          {activeTab === 'dates' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  Important Dates
                </h2>
                <button
                  onClick={() => handleEdit('new-date')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Date
                </button>
              </div>

              {/* Edit Date Form */}
              {editMode && editMode.includes('date') && (
                <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                  <h3 className="text-lg font-bold mb-4">
                    {editMode === 'new-date' ? 'Add New Important Date' : 'Edit Important Date'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Date</label>
                      <input
                        type="text"
                        value={editData.date}
                        onChange={(e) => setEditData({...editData, date: e.target.value})}
                        className="w-full p-2 border rounded"
                        style={{ borderColor: colors.border }}
                        placeholder="e.g., January 15, 2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Event</label>
                      <input
                        type="text"
                        value={editData.event}
                        onChange={(e) => setEditData({...editData, event: e.target.value})}
                        className="w-full p-2 border rounded"
                        style={{ borderColor: colors.border }}
                        placeholder="e.g., Admission Test for Class 1-5"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave('dates')}
                        disabled={saving}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Date'}
                      </button>
                      <button
                        onClick={() => { setEditMode(null); setEditData(null); }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        style={{ borderColor: colors.border }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Dates List */}
              <div className="space-y-4">
                {data?.importantDates.map((item, index) => (
                  <div key={index} className="flex items-start justify-between p-4 rounded-lg hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className="w-16 h-16 flex-shrink-0 rounded-lg flex flex-col items-center justify-center mr-4" 
                        style={{ backgroundColor: `${colors.primaryBlue}10`, color: colors.primaryBlue }}>
                        <div className="text-lg font-bold">{item.date.split(' ')[1]}</div>
                        <div className="text-xs">{item.date.split(' ')[0]}</div>
                      </div>
                      <div>
                        <div className="font-medium">{item.event}</div>
                        <div className="text-sm text-gray-600">{item.date}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit('edit-date', item, index)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete('dates', index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eligibility Criteria Section */}
          {activeTab === 'eligibility' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  Eligibility Criteria
                </h2>
                <button
                  onClick={() => handleEdit('new-eligibility')}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Criteria
                </button>
              </div>

              {/* Edit Eligibility Form */}
              {editMode && editMode.includes('eligibility') && (
                <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                  <h3 className="text-lg font-bold mb-4">
                    {editMode === 'new-eligibility' ? 'Add New Eligibility Criteria' : 'Edit Eligibility Criteria'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Class/Grade</label>
                      <input
                        type="text"
                        value={editData.class}
                        onChange={(e) => setEditData({...editData, class: e.target.value})}
                        className="w-full p-2 border rounded"
                        style={{ borderColor: colors.border }}
                        placeholder="e.g., Class 1-5 or Kindergarten"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Academic Requirement</label>
                      <textarea
                        value={editData.requirement}
                        onChange={(e) => setEditData({...editData, requirement: e.target.value})}
                        className="w-full p-2 border rounded"
                        style={{ borderColor: colors.border }}
                        rows={3}
                        placeholder="Enter academic requirements"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave('eligibility')}
                        disabled={saving}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Criteria'}
                      </button>
                      <button
                        onClick={() => { setEditMode(null); setEditData(null); }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        style={{ borderColor: colors.border }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Eligibility Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left font-bold text-gray-700">Class/Grade</th>
                      <th className="py-3 px-4 text-left font-bold text-gray-700">Academic Requirement</th>
                      <th className="py-3 px-4 text-left font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.eligibilityCriteria.map((criteria, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-3 px-4 font-medium">{criteria.class}</td>
                        <td className="py-3 px-4">{criteria.requirement}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit('edit-eligibility', criteria, index)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete('eligibility', index)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Important Notes Section */}
          {activeTab === 'notes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  Important Notes
                </h2>
                <button
                  onClick={() => handleEdit('new-note')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Note
                </button>
              </div>

              {/* Edit Note Form */}
              {editMode && editMode.includes('note') && (
                <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                  <h3 className="text-lg font-bold mb-4">
                    {editMode === 'new-note' ? 'Add New Important Note' : 'Edit Important Note'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Note</label>
                      <textarea
                        value={editData.text}
                        onChange={(e) => setEditData({...editData, text: e.target.value})}
                        className="w-full p-2 border rounded"
                        style={{ borderColor: colors.border }}
                        rows={4}
                        placeholder="Enter important note for applicants"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave('notes')}
                        disabled={saving}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Note'}
                      </button>
                      <button
                        onClick={() => { setEditMode(null); setEditData(null); }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        style={{ borderColor: colors.border }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes List */}
              <div className="space-y-4">
                {data?.importantNotes?.map((note, index) => (
                  <div key={index} className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="font-medium">Important Note</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit('edit-note', note, index)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete('notes', index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admission Test Details Section */}
          {activeTab === 'test' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  Admission Test Details
                </h2>
                <button
                  onClick={() => handleEdit('new-test-detail')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Test Detail
                </button>
              </div>

              {/* Edit Test Detail Form */}
              {editMode && editMode.includes('test-detail') && (
                <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                  <h3 className="text-lg font-bold mb-4">
                    {editMode === 'new-test-detail' ? 'Add New Test Detail' : 'Edit Test Detail'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Test Detail</label>
                      <textarea
                        value={editData.text}
                        onChange={(e) => setEditData({...editData, text: e.target.value})}
                        className="w-full p-2 border rounded"
                        style={{ borderColor: colors.border }}
                        rows={3}
                        placeholder="Enter admission test detail"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave('test')}
                        disabled={saving}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Detail'}
                      </button>
                      <button
                        onClick={() => { setEditMode(null); setEditData(null); }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        style={{ borderColor: colors.border }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Test Details List */}
              <div className="space-y-3">
                {data?.admissionTestDetails?.map((detail, index) => (
                  <div key={index} className="flex items-start justify-between p-3 hover:bg-gray-50 rounded">
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">•</span>
                      <span>{detail}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit('edit-test-detail', detail, index)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete('test', index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fee Information Section */}
          {activeTab === 'fee' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  Fee Information
                </h2>
                <button
                  onClick={() => handleEdit('new-fee-info')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Fee Info
                </button>
              </div>

              {/* Edit Fee Info Form */}
              {editMode && editMode.includes('fee-info') && (
                <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                  <h3 className="text-lg font-bold mb-4">
                    {editMode === 'new-fee-info' ? 'Add New Fee Information' : 'Edit Fee Information'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Fee Information</label>
                      <textarea
                        value={editData.text}
                        onChange={(e) => setEditData({...editData, text: e.target.value})}
                        className="w-full p-2 border rounded"
                        style={{ borderColor: colors.border }}
                        rows={3}
                        placeholder="Enter fee information detail"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave('fee')}
                        disabled={saving}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Information'}
                      </button>
                      <button
                        onClick={() => { setEditMode(null); setEditData(null); }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        style={{ borderColor: colors.border }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Fee Info List */}
              <div className="space-y-3">
                {data?.feeInformation?.map((info, index) => (
                  <div key={index} className="flex items-start justify-between p-3 hover:bg-gray-50 rounded">
                    <div className="flex items-start">
                      <span className="mr-3 mt-1">•</span>
                      <span>{info}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit('edit-fee-info', info, index)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete('fee', index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information Section */}
          {activeTab === 'contact' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  Contact Information
                </h2>
                <button
                  onClick={() => handleEdit('contact')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Contact Info
                </button>
              </div>

              {/* Edit Contact Form */}
              {editMode === 'contact' && (
                <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                  <h3 className="text-lg font-bold mb-4">Edit Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full p-2 border rounded"
                        style={{ borderColor: colors.border }}
                        placeholder="admissions@school.edu.pk"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input
                        type="text"
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className="w-full p-2 border rounded"
                        style={{ borderColor: colors.border }}
                        placeholder="021-111-222-333"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave('contact')}
                        disabled={saving}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Contact Info'}
                      </button>
                      <button
                        onClick={() => { setEditMode(null); setEditData(null); }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        style={{ borderColor: colors.border }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-lg border" style={{ borderColor: colors.border }}>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" 
                      style={{ backgroundColor: `${colors.primaryBlue}15`, color: colors.primaryBlue }}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Email</h3>
                  </div>
                  <p className="text-lg" style={{ color: colors.primaryBlue }}>
                    {data?.contactInfo?.email}
                  </p>
                </div>

                <div className="p-6 rounded-lg border" style={{ borderColor: colors.border }}>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" 
                      style={{ backgroundColor: `${colors.accentGreen}15`, color: colors.accentGreen }}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Phone</h3>
                  </div>
                  <p className="text-lg" style={{ color: colors.accentGreen }}>
                    {data?.contactInfo?.phone}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{data?.admissionSteps.length || 0}</div>
            <div className="text-sm text-gray-600">Admission Steps</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{data?.documentRequirements.length || 0}</div>
            <div className="text-sm text-gray-600">Document Requirements</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{data?.importantDates.length || 0}</div>
            <div className="text-sm text-gray-600">Important Dates</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-teal-600">{data?.eligibilityCriteria.length || 0}</div>
            <div className="text-sm text-gray-600">Eligibility Criteria</div>
          </div>
        </div>
      </div>
    </div>
  );
}