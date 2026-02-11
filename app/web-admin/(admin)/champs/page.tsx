"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

// Define TypeScript interfaces
interface Champ {
  id: number;
  name: string;
  percentage: number;
  image: string;
  year: number;
  class: string;
}

interface ApiResponse {
  success: boolean;
  data: Champ[];
  count: number;
  timestamp: string;
  error?: string;
}

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
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83 -2.828z" />
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

const TrophyIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
  </svg>
);

// Skeleton Loading Components
const SkeletonChampCard = () => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-pulse">
    <div className="relative h-48 bg-gray-300">
      <div className="absolute top-4 right-4">
        <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="h-4 bg-gray-400 rounded w-1/3"></div>
      </div>
    </div>

    <div className="p-5">
      <div className="h-5 bg-gray-300 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>

      <div className="grid grid-cols-2 gap-2">
        <div className="h-10 bg-gray-200 rounded-lg"></div>
        <div className="h-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export default function AdminChampsPage() {
  const router = useRouter();
  const [champs, setChamps] = useState<Champ[]>([]);
  const [filteredChamps, setFilteredChamps] = useState<Champ[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [champToDelete, setChampToDelete] = useState<Champ | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");

  // Fetch champs from API
  useEffect(() => {
    fetchChamps();
  }, []);

  const fetchChamps = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/champs?minimal=true");

      if (!response.ok) {
        throw new Error(`Failed to fetch champs: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to load champs");
      }

      setChamps(result.data);
      setFilteredChamps(result.data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load champs");
      setLoading(false);
    }
  };

  // Handle search and filter
  useEffect(() => {
    let filtered = [...champs];

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (champ) =>
          champ.name.toLowerCase().includes(query) ||
          champ.class.toLowerCase().includes(query) ||
          champ.year.toString().includes(query),
      );
    }

    // Apply year filter
    if (selectedYear !== "all") {
      filtered = filtered.filter(
        (champ) => champ.year.toString() === selectedYear,
      );
    }

    // Apply class filter
    if (selectedClass !== "all") {
      filtered = filtered.filter((champ) => champ.class === selectedClass);
    }

    setFilteredChamps(filtered);
  }, [searchQuery, selectedYear, selectedClass, champs]);

  const handleAddNew = () => {
    router.push("/web-admin/champs/new");
  };

  const handleEdit = (id: number) => {
    router.push(`/web-admin/champs/edit/${id}`);
  };

  const handleDeleteClick = (champ: Champ) => {
    setChampToDelete(champ);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!champToDelete) return;

    try {
      setDeleteLoading(true);

      const response = await fetch(`/api/admin/champs?id=${champToDelete.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete champ");
      }

      // Remove champ from local state
      setChamps((prev) => prev.filter((c) => c.id !== champToDelete.id));

      // Close modal and reset
      setShowDeleteModal(false);
      setChampToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete champ");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setChampToDelete(null);
  };

  // Get unique years and classes for filters
  const uniqueYears = Array.from(
    new Set(champs.map((champ) => champ.year)),
  ).sort((a, b) => b - a);
  const uniqueClasses = Array.from(
    new Set(champs.map((champ) => champ.class)),
  ).sort();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Champs Management
          </h1>
          <p className="text-gray-600">
            Manage top performing students and achievers
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search champs by name, class, or year..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
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
              className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 w-full md:w-auto text-base"
            >
              <AddIcon />
              <span className="whitespace-nowrap">Add New Champ</span>
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="all">All Years</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="all">All Classes</option>
                {uniqueClasses.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedYear("all");
                  setSelectedClass("all");
                  setSearchQuery("");
                }}
                className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center text-gray-600">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Total Champs:{" "}
              <span className="font-semibold ml-1">{champs.length}</span>
            </span>
            <span className="flex items-center text-gray-600">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Showing:{" "}
              <span className="font-semibold ml-1">
                {filteredChamps.length}
              </span>
            </span>
            {selectedYear !== "all" && (
              <span className="flex items-center text-gray-600">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                Year: <span className="font-semibold ml-1">{selectedYear}</span>
              </span>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-red-600 font-medium mb-1">
                  Error loading champs
                </p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700 p-1"
                aria-label="Dismiss error"
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
            </div>
          </div>
        )}

        {/* Champs Grid */}
        <div className="mb-8">
          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                // Show skeleton loading cards
                Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonChampCard key={index} />
                ))
              ) : filteredChamps.length > 0 ? (
                // Show actual champ cards
                filteredChamps.map((champ) => (
                  <div
                    key={champ.id}
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
                  >
                    {/* Champ Image */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                      {champ.image ? (
                        <img
                          src={champ.image}
                          alt={champ.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.parentElement!.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center">
                                <div class="text-white text-4xl font-bold">${champ.name.charAt(0)}</div>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-white text-4xl font-bold">
                            {champ.name.charAt(0)}
                          </div>
                        </div>
                      )}

                      {/* Percentage Badge */}
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {champ.percentage}%
                        </div>
                      </div>

                      {/* Class Badge */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <div className="text-white text-sm font-medium">
                          {champ.class} - {champ.year}
                        </div>
                      </div>
                    </div>

                    {/* Champ Info */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3
                        className="text-lg font-semibold text-gray-900 mb-1 truncate"
                        title={champ.name}
                      >
                        {champ.name}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <p className="text-blue-600 font-medium truncate">
                          {champ.class}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Year: {champ.year}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleEdit(champ.id)}
                          className="inline-flex items-center justify-center p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200"
                          aria-label={`Edit ${champ.name}`}
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(champ)}
                          className="inline-flex items-center justify-center p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
                          aria-label={`Delete ${champ.name}`}
                          title="Delete"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // No results message
                <div className="col-span-full text-center py-12 px-4">
                  <div className="text-gray-400 mb-4 mx-auto w-20 h-20">
                    <TrophyIcon />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {searchQuery ||
                    selectedYear !== "all" ||
                    selectedClass !== "all"
                      ? "No champs found"
                      : "No champs available"}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchQuery ||
                    selectedYear !== "all" ||
                    selectedClass !== "all"
                      ? "No champs match your search criteria."
                      : "Get started by adding your first champ."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {searchQuery ||
                    selectedYear !== "all" ||
                    selectedClass !== "all" ? (
                      <button
                        onClick={() => {
                          setSelectedYear("all");
                          setSelectedClass("all");
                          setSearchQuery("");
                        }}
                        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        Clear Filters
                      </button>
                    ) : (
                      <button
                        onClick={handleAddNew}
                        className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        <AddIcon />
                        <span>Add First Champ</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {!loading && !error && filteredChamps.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-blue-600">
                  {filteredChamps.length}
                </span>{" "}
                champs
                {selectedYear !== "all" && ` for year ${selectedYear}`}
                {selectedClass !== "all" && ` in ${selectedClass}`}
              </div>

              {filteredChamps.length > 0 && (
                <div className="text-sm text-gray-600">
                  Highest Percentage:{" "}
                  <span className="font-semibold text-green-600">
                    {Math.max(...filteredChamps.map((c) => c.percentage))}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && champToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Delete Champ
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{champToDelete.name}</span>?
                This action cannot be undone.
              </p>

              {/* Champ Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    {champToDelete.image ? (
                      <img
                        src={champToDelete.image}
                        alt={champToDelete.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {champToDelete.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {champToDelete.name}
                    </p>
                    <p className="text-gray-600 truncate">
                      {champToDelete.class} ({champToDelete.year}) -{" "}
                      {champToDelete.percentage}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {deleteLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Delete Champ"
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