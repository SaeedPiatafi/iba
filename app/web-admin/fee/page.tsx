"use client";

import { useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";

// Icons components
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
      clipRule="evenodd"
    />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const AddIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const MoneyIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);

// Define TypeScript interfaces
interface FeeStructure {
  id: number;
  className: string;
  category: string;
  admissionFee: string;
  monthlyFee: string;
  annualFee: string;
  otherCharges: string;
  totalAnnual: string;
  description: string;
}

interface FeeStructureWithCalculations extends FeeStructure {
  calculatedAnnualFee: string;
  calculatedTotalAnnual: string;
}

interface CategoryBadgeProps {
  category: string;
}

interface ShowDetailsState {
  [key: number]: boolean;
}

interface ApiResponse {
  success: boolean;
  data: {
    feeStructure: FeeStructure[];
  };
}

const CategoryBadge = ({ category }: CategoryBadgeProps): JSX.Element => {
  const colors: { [key: string]: string } = {
    "Pre-School": "bg-pink-100 text-pink-800",
    Primary: "bg-blue-100 text-blue-800",
    "Middle School": "bg-green-100 text-green-800",
    Secondary: "bg-yellow-100 text-yellow-800",
    "Higher Secondary": "bg-purple-100 text-purple-800",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${colors[category] || "bg-gray-100 text-gray-800"}`}
    >
      {category}
    </span>
  );
};

// Helper function to parse currency string to number
const parseCurrency = (currencyStr: string): number => {
  if (!currencyStr) return 0;
  try {
    // Remove currency symbols, commas, and spaces
    const cleaned = currencyStr.replace(/[^\d]/g, "");
    return parseInt(cleaned) || 0;
  } catch (error) {
    console.error("Error parsing currency:", currencyStr, error);
    return 0;
  }
};

// Helper function to format number to currency string
const formatCurrency = (amount: number): string => {
  return `Rs. ${amount.toLocaleString()}`;
};

// Calculate annual and total fees based on the formulas
const calculateFees = (
  fee: FeeStructure,
): { calculatedAnnualFee: string; calculatedTotalAnnual: string } => {
  // Parse currency values
  const monthlyFeeNum = parseCurrency(fee.monthlyFee);
  const admissionFeeNum = parseCurrency(fee.admissionFee);
  const otherChargesNum = parseCurrency(fee.otherCharges);

  // Calculate annual fee: Monthly Fee * 12
  const annualFeeNum = monthlyFeeNum * 12;

  // Calculate total annual: Admission Fee + Annual Fee + Other Charges
  const totalAnnualNum = admissionFeeNum + annualFeeNum + otherChargesNum;

  return {
    calculatedAnnualFee: formatCurrency(annualFeeNum),
    calculatedTotalAnnual: formatCurrency(totalAnnualNum),
  };
};

// Skeleton Loading Components (only for fees list)
const SkeletonCard = (): JSX.Element => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Calculate total annual fees from all fee structures with proper null checks
const calculateTotalAnnual = (fees: FeeStructure[]): string => {
  if (!fees || !Array.isArray(fees) || fees.length === 0) {
    return "Rs. 0";
  }

  const total = fees.reduce((sum, fee) => {
    if (!fee) return sum;

    try {
      // Use calculated total annual
      const calculations = calculateFees(fee);
      const amountStr = calculations.calculatedTotalAnnual.replace(
        /[^\d]/g,
        "",
      );
      const amount = parseInt(amountStr) || 0;
      return sum + amount;
    } catch (error) {
      console.error("Error parsing fee amount:", error, fee);
      return sum;
    }
  }, 0);

  return `Rs. ${total.toLocaleString()}`;
};

// Calculate total number of classes with null check
const calculateTotalClasses = (fees: FeeStructure[]): number => {
  if (!fees || !Array.isArray(fees)) return 0;
  return fees.length;
};

export default function AdminFeesPage(): JSX.Element {
  const router = useRouter();
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [filteredFees, setFilteredFees] = useState<FeeStructure[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [feeToDelete, setFeeToDelete] = useState<FeeStructure | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showDetails, setShowDetails] = useState<ShowDetailsState>({});
  const [deleting, setDeleting] = useState<boolean>(false);

  // Fetch fees from API
  useEffect(() => {
    const fetchFees = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/fee");

        if (!response.ok) {
          throw new Error(`Failed to fetch fee data: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debug log

        if (
          data.success &&
          data.data &&
          Array.isArray(data.data.feeStructure)
        ) {
          // Ensure all fee structures have required fields and calculate missing values
          const formattedFees = data.data.feeStructure.map((fee: any) => {
            // Parse the fee data from API
            const admissionFee = fee.admissionFee || "Rs. 0";
            const monthlyFee = fee.monthlyFee || "Rs. 0";
            const otherCharges = fee.otherCharges || "Rs. 0";

            // Calculate annual and total fees
            const calculations = calculateFees({
              ...fee,
              admissionFee,
              monthlyFee,
              otherCharges,
              annualFee: fee.annualFee || "Rs. 0",
              totalAnnual: fee.totalAnnual || "Rs. 0",
            });

            return {
              id: fee.id || 0,
              className: fee.className || "Unknown Class",
              category: fee.category || "Uncategorized",
              admissionFee,
              monthlyFee,
              annualFee: calculations.calculatedAnnualFee, // Use calculated annual fee
              otherCharges,
              totalAnnual: calculations.calculatedTotalAnnual, // Use calculated total annual
              description: fee.description || "No description",
            };
          });

          setFees(formattedFees);
          setFilteredFees(formattedFees);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (err: any) {
        console.error("Error fetching fees:", err);
        setError(err.message || "Failed to load fee structure");
        // Set empty arrays to prevent further errors
        setFees([]);
        setFilteredFees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  // Handle search and filter
  useEffect(() => {
    let filtered = fees;

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (fee) =>
          (fee.className && fee.className.toLowerCase().includes(query)) ||
          (fee.category && fee.category.toLowerCase().includes(query)) ||
          (fee.description && fee.description.toLowerCase().includes(query)),
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((fee) => fee.category === selectedCategory);
    }

    setFilteredFees(filtered);
  }, [searchQuery, selectedCategory, fees]);

  const handleAddNew = (): void => {
    router.push("/web-admin/fee/new");
  };

  const handleEdit = (id: number): void => {
    router.push(`/web-admin/fee/edit/${id}`);
  };

  const handleDeleteClick = (fee: FeeStructure): void => {
    setFeeToDelete(fee);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!feeToDelete) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/fee?id=${feeToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete fee structure");
      }

      // Update local state
      setFees((prev) => prev.filter((f) => f.id !== feeToDelete.id));
      setFilteredFees((prev) => prev.filter((f) => f.id !== feeToDelete.id));

      setShowDeleteModal(false);
      setFeeToDelete(null);
    } catch (err: any) {
      console.error("Error deleting fee:", err);
      setError(err.message || "Failed to delete fee structure");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = (): void => {
    setShowDeleteModal(false);
    setFeeToDelete(null);
  };

  const toggleDetails = (id: number): void => {
    setShowDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Get unique categories
  const categories: string[] = [
    "all",
    ...new Set(fees.map((fee) => fee.category).filter(Boolean)),
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Always visible, no skeleton */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fee Structure Management
          </h1>
          <p className="text-gray-600">
            Manage fee structure for different classes and categories
          </p>
        </div>

        {/* Controls - Always visible, no skeleton */}
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
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
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

          {/* Category Filter */}
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
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State - Only for fees list */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Fees List */}
            {filteredFees.length > 0 ? (
              <div className="space-y-6">
                {filteredFees.map((fee) => (
                  <div
                    key={fee.id || Math.random()}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    {/* Fee Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {fee.className}
                            </h3>
                            <CategoryBadge category={fee.category} />
                          </div>
                          <p className="text-gray-600">{fee.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleDetails(fee.id)}
                            className="px-4 py-2 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors duration-200"
                          >
                            {showDetails[fee.id]
                              ? "Hide Details"
                              : "View Details"}
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
                            <p className="text-sm text-gray-600 mb-1">
                              Admission Fee
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {fee.admissionFee}
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">
                              Monthly Fee
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {fee.monthlyFee}
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">
                              Annual Fee (Monthly × 12)
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {fee.annualFee}
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">
                              Other Charges
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {fee.otherCharges}
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                            <p className="text-sm text-gray-600 mb-1">
                              Total Annual
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                              {fee.totalAnnual}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick View */}
                    <div className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Admission Fee
                          </p>
                          <p className="font-semibold text-gray-900">
                            {fee.admissionFee}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Monthly Fee
                          </p>
                          <p className="font-semibold text-gray-900">
                            {fee.monthlyFee}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Annual Fee (Monthly × 12)
                          </p>
                          <p className="font-semibold text-gray-900">
                            {fee.annualFee}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Other Charges
                          </p>
                          <p className="font-semibold text-gray-900">
                            {fee.otherCharges}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">
                            Total Annual
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {fee.totalAnnual}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No fee structure found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || selectedCategory !== "all"
                    ? "No fee structure matches your search criteria."
                    : "No fee structure has been added yet."}
                </p>
                {(searchQuery || selectedCategory !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Stats Footer - Show when data is loaded */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-gray-600">
                    Showing{" "}
                    <span className="font-semibold text-blue-600">
                      {filteredFees.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-blue-600">
                      {fees.length}
                    </span>{" "}
                    fee structures
                  </p>
                </div>

                {/* Total Stats */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-3 min-w-[200px]">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Classes</p>
                        <p className="text-lg font-bold text-gray-900">
                          {calculateTotalClasses(fees)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-3 min-w-[200px]">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <MoneyIcon />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Total Annual Fees
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {calculateTotalAnnual(fees)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <span className="font-medium">Categories: </span>
                  {categories.slice(1).join(", ")}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && feeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Delete Fee Structure
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete the fee structure for{" "}
                <span className="font-semibold">{feeToDelete.className}</span>?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-600">
                  This action cannot be undone. All fee information for this
                  class will be permanently deleted.
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete Fee Structure"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
