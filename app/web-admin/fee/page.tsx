// app/web-admin/fees/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Icons components
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const AddIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const MoneyIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const CategoryBadge = ({ category }) => {
  const colors = {
    'Pre-School': 'bg-pink-100 text-pink-800',
    'Primary': 'bg-blue-100 text-blue-800',
    'Middle School': 'bg-green-100 text-green-800',
    'Secondary': 'bg-yellow-100 text-yellow-800',
    'Higher Secondary': 'bg-purple-100 text-purple-800'
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colors[category] || 'bg-gray-100 text-gray-800'}`}>
      {category}
    </span>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export default function AdminFeesPage() {
  const router = useRouter();
  const [fees, setFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feeToDelete, setFeeToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDetails, setShowDetails] = useState({});

  // Mock API call to fetch fees
  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        // In real app, this would be an API call
        setTimeout(() => {
          const mockFees = [
            {
              id: 1,
              class: "KG (Kindergarten)",
              category: "Pre-School",
              admissionFee: "Rs. 15,000",
              monthlyFee: "Rs. 8,000",
              annualFee: "Rs. 96,000",
              otherCharges: "Rs. 5,000",
              totalAnnual: "Rs. 116,000",
              description: "Includes basic learning materials, art supplies, and activity fees",
              isActive: true
            },
            {
              id: 2,
              class: "PG (Play Group)",
              category: "Pre-School",
              admissionFee: "Rs. 12,000",
              monthlyFee: "Rs. 7,000",
              annualFee: "Rs. 84,000",
              otherCharges: "Rs. 4,500",
              totalAnnual: "Rs. 100,500",
              description: "Includes play materials, story books, and creative activities",
              isActive: true
            },
            {
              id: 3,
              class: "Class 1",
              category: "Primary",
              admissionFee: "Rs. 18,000",
              monthlyFee: "Rs. 9,000",
              annualFee: "Rs. 108,000",
              otherCharges: "Rs. 7,000",
              totalAnnual: "Rs. 133,000",
              description: "Includes textbooks, notebook, and basic stationery",
              isActive: true
            },
            {
              id: 4,
              class: "Class 5",
              category: "Primary",
              admissionFee: "Rs. 22,000",
              monthlyFee: "Rs. 11,000",
              annualFee: "Rs. 132,000",
              otherCharges: "Rs. 9,000",
              totalAnnual: "Rs. 163,000",
              description: "Includes textbooks, computer lab, and sports equipment",
              isActive: true
            },
            {
              id: 5,
              class: "Class 6",
              category: "Middle School",
              admissionFee: "Rs. 25,000",
              monthlyFee: "Rs. 12,000",
              annualFee: "Rs. 144,000",
              otherCharges: "Rs. 10,000",
              totalAnnual: "Rs. 179,000",
              description: "Includes science lab, computer lab, and library access",
              isActive: true
            },
            {
              id: 6,
              class: "Class 9",
              category: "Secondary",
              admissionFee: "Rs. 30,000",
              monthlyFee: "Rs. 15,000",
              annualFee: "Rs. 180,000",
              otherCharges: "Rs. 15,000",
              totalAnnual: "Rs. 225,000",
              description: "Includes science labs, computer lab, and career counseling",
              isActive: true
            },
            {
              id: 7,
              class: "Class 11",
              category: "Higher Secondary",
              admissionFee: "Rs. 35,000",
              monthlyFee: "Rs. 18,000",
              annualFee: "Rs. 216,000",
              otherCharges: "Rs. 20,000",
              totalAnnual: "Rs. 271,000",
              description: "Science/Commerce/Arts streams with specialized labs",
              isActive: false
            },
            {
              id: 8,
              class: "Class 12",
              category: "Higher Secondary",
              admissionFee: "Rs. 35,000",
              monthlyFee: "Rs. 18,000",
              annualFee: "Rs. 216,000",
              otherCharges: "Rs. 22,000",
              totalAnnual: "Rs. 273,000",
              description: "Board exam preparation, university counseling, and career guidance",
              isActive: true
            }
          ];
          setFees(mockFees);
          setFilteredFees(mockFees);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load fee structure');
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  // Handle search and filter
  useEffect(() => {
    let filtered = fees;

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(fee =>
        fee.class.toLowerCase().includes(query) ||
        fee.category.toLowerCase().includes(query) ||
        fee.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(fee => fee.category === selectedCategory);
    }

    setFilteredFees(filtered);
  }, [searchQuery, selectedCategory, fees]);

  const handleAddNew = () => {
    router.push('/web-admin/fee/new');
  };

  const handleEdit = (id) => {
    router.push(`/web-admin/fee/edit/${id}`);
  };

  const handleDeleteClick = (fee) => {
    setFeeToDelete(fee);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (feeToDelete) {
      setFees(prev => prev.filter(f => f.id !== feeToDelete.id));
      setFilteredFees(prev => prev.filter(f => f.id !== feeToDelete.id));
      setShowDeleteModal(false);
      setFeeToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setFeeToDelete(null);
  };

  const toggleDetails = (id) => {
    setShowDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Get unique categories
  const categories = ['all', ...new Set(fees.map(fee => fee.category))];

  // Calculate totals
  const calculateTotals = () => {
    const activeFees = fees.filter(f => f.isActive);
    const totalAnnualSum = activeFees.reduce((sum, fee) => {
      const amount = parseInt(fee.totalAnnual.replace(/[^\d]/g, ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    const avgAnnual = activeFees.length > 0 ? Math.round(totalAnnualSum / activeFees.length) : 0;
    
    return {
      totalClasses: activeFees.length,
      totalAnnualSum,
      avgAnnual
    };
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fee Structure Management</h1>
          <p className="text-gray-600">Manage fee structure for different classes and categories</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <MoneyIcon />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Classes</p>
                <p className="text-2xl font-bold text-gray-900">{totals.totalClasses}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Annual Fee</p>
                <p className="text-2xl font-bold text-gray-900">Rs. {totals.avgAnnual.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by class name or category..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <button
              onClick={handleAddNew}
              className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <AddIcon />
              Add New Fee Structure
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-sm text-gray-600">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Active: {fees.filter(f => f.isActive).length}
              </span>
              <span className="flex items-center text-sm text-gray-600">
                <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                Inactive: {fees.filter(f => !f.isActive).length}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Fees List */}
        {filteredFees.length > 0 ? (
          <div className="space-y-6">
            {filteredFees.map((fee) => (
              <div
                key={fee.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Fee Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{fee.class}</h3>
                        <CategoryBadge category={fee.category} />
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${fee.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {fee.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-gray-600">{fee.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleDetails(fee.id)}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors duration-200"
                      >
                        {showDetails[fee.id] ? 'Hide Details' : 'View Details'}
                      </button>
                      <button
                        onClick={() => handleEdit(fee.id)}
                        className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors duration-200"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(fee)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors duration-200"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fee Details */}
                {showDetails[fee.id] && (
                  <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Admission Fee</p>
                        <p className="text-lg font-bold text-gray-900">{fee.admissionFee}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Monthly Fee</p>
                        <p className="text-lg font-bold text-gray-900">{fee.monthlyFee}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Annual Fee</p>
                        <p className="text-lg font-bold text-gray-900">{fee.annualFee}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Other Charges</p>
                        <p className="text-lg font-bold text-gray-900">{fee.otherCharges}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                        <p className="text-sm text-gray-600 mb-1">Total Annual</p>
                        <p className="text-xl font-bold text-gray-900">{fee.totalAnnual}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick View */}
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Admission Fee</p>
                      <p className="font-semibold text-gray-900">{fee.admissionFee}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Monthly Fee</p>
                      <p className="font-semibold text-gray-900">{fee.monthlyFee}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Annual Fee</p>
                      <p className="font-semibold text-gray-900">{fee.annualFee}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Other Charges</p>
                      <p className="font-semibold text-gray-900">{fee.otherCharges}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Annual</p>
                      <p className="text-lg font-bold text-gray-900">{fee.totalAnnual}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No fee structure found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== 'all' 
                ? "No fee structure matches your search criteria." 
                : "No fee structure has been added yet."}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-gray-600">
                Showing <span className="font-semibold text-blue-600">{filteredFees.length}</span> of{' '}
                <span className="font-semibold text-blue-600">{fees.length}</span> fee structures
              </p>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Categories: </span>
              {categories.slice(1).join(', ')}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && feeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Fee Structure</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete the fee structure for <span className="font-semibold">{feeToDelete.class}</span>?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-600">
                  This action cannot be undone. All fee information for this class will be permanently deleted.
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Delete Fee Structure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}