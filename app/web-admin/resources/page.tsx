// app/web-admin/resources/page.tsx
'use client';

import { useState, useEffect } from 'react';

// Define types
type ResourceType = 'Book' | 'Video' | 'Article' | 'Practice' | 'Exam';

interface Resource {
  id: number;
  title: string;
  type: ResourceType;
  link: string;
  description: string;
  class: string;
  subject: string;
}

export default function AdminResourcesPage() {
  // Color palette
  const colors = {
    primaryBlue: "#2563EB",
    secondaryTeal: "#0D9488",
    accentGreen: "#16A34A",
    accentPurple: "#7C3AED",
    accentOrange: "#F97316",
    background: "#F9FAFB",
    card: "#FFFFFF",
    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    sidebarBg: "#F8FAFC",
  };

  // Classes data
  const classes = [
    "Class 6", "Class 7", "Class 8", "Class 9", 
    "Class 10", "Class 11 Science", "Class 11 Commerce", 
    "Class 11 Arts", "Class 12 Science", "Class 12 Commerce", 
    "Class 12 Arts"
  ];

  // Subjects data for each class category
  const subjectsByClass: Record<string, string[]> = {
    "Class 6-8": [
      "Mathematics", "Science", "English", "Social Studies", 
      "Computer Science", "Urdu", "Islamiyat", "General Knowledge"
    ],
    "Class 9-10": [
      "Mathematics", "Physics", "Chemistry", "Biology", 
      "English", "Urdu", "Islamiyat", "Pakistan Studies",
      "Computer Science"
    ],
    "Science": [
      "Mathematics", "Physics", "Chemistry", "Biology",
      "English", "Urdu", "Islamiyat", "Pakistan Studies",
      "Computer Science"
    ],
    "Commerce": [
      "Principles of Accounting", "Business Studies", "Economics",
      "Mathematics", "Statistics", "English", "Urdu",
      "Islamiyat", "Pakistan Studies"
    ],
    "Arts": [
      "English Literature", "Urdu Literature", "Islamic Studies",
      "Pakistan Studies", "Sociology", "Psychology", "Geography",
      "History", "Political Science"
    ]
  };

  // State for resources
  const [resources, setResources] = useState<Resource[]>([
    { id: 1, title: "Basic Algebra Guide", type: "Book", link: "https://example.com/math6-book", description: "Complete guide to algebra basics", class: "Class 6", subject: "Mathematics" },
    { id: 2, title: "Fractions and Decimals", type: "Video", link: "https://khanacademy.org/fractions", description: "Video lessons on fractions", class: "Class 6", subject: "Mathematics" },
    { id: 3, title: "Math Practice Problems", type: "Practice", link: "https://example.com/math-practice", description: "Interactive practice problems", class: "Class 6", subject: "Mathematics" },
    { id: 5, title: "Science Textbook", type: "Book", link: "https://example.com/science6-book", description: "Full science curriculum", class: "Class 6", subject: "Science" },
    { id: 6, title: "Biology Basics", type: "Video", link: "https://khanacademy.org/biology-basics", description: "Introduction to biology", class: "Class 6", subject: "Science" },
    { id: 17, title: "Physics Concepts", type: "Book", link: "https://example.com/physics9-book", description: "Complete physics guide", class: "Class 9", subject: "Physics" },
    { id: 18, title: "Motion and Force", type: "Video", link: "https://khanacademy.org/physics-motion", description: "Video lectures on motion", class: "Class 9", subject: "Physics" },
  ]);

  // Form state for adding/editing
  const [formData, setFormData] = useState<Omit<Resource, 'id'>>({
    title: "",
    type: "Book",
    link: "",
    description: "",
    class: "Class 6",
    subject: "Mathematics"
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // Filter states
  const [filterClass, setFilterClass] = useState("All Classes");
  const [filterSubject, setFilterSubject] = useState("All Subjects");
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique subjects based on filter
  const getFilteredSubjects = () => {
    if (filterClass === "All Classes") {
      const allSubjects = new Set<string>();
      resources.forEach(r => allSubjects.add(r.subject));
      return Array.from(allSubjects);
    }
    
    // Get subjects for the selected class category
    if (filterClass.includes("6") || filterClass.includes("7") || filterClass.includes("8")) {
      return subjectsByClass["Class 6-8"];
    } else if (filterClass.includes("9") || filterClass.includes("10")) {
      return subjectsByClass["Class 9-10"];
    } else if (filterClass.includes("Science")) {
      return subjectsByClass["Science"];
    } else if (filterClass.includes("Commerce")) {
      return subjectsByClass["Commerce"];
    } else if (filterClass.includes("Arts")) {
      return subjectsByClass["Arts"];
    }
    return [];
  };

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesClass = filterClass === "All Classes" || resource.class === filterClass;
    const matchesSubject = filterSubject === "All Subjects" || resource.subject === filterSubject;
    const matchesSearch = searchTerm === "" || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesClass && matchesSubject && matchesSearch;
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing resource
      setResources(prev => prev.map(resource => 
        resource.id === editingId ? { ...formData, id: editingId } : resource
      ));
      setEditingId(null);
    } else {
      // Add new resource
      const newId = resources.length > 0 ? Math.max(...resources.map(r => r.id)) + 1 : 1;
      setResources(prev => [...prev, { ...formData, id: newId }]);
    }
    
    // Reset form
    setFormData({
      title: "",
      type: "Book",
      link: "",
      description: "",
      class: "Class 6",
      subject: "Mathematics"
    });
    setShowForm(false);
  };

  // Handle edit
  const handleEdit = (resource: Resource) => {
    setFormData({
      title: resource.title,
      type: resource.type,
      link: resource.link,
      description: resource.description,
      class: resource.class,
      subject: resource.subject
    });
    setEditingId(resource.id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      setResources(prev => prev.filter(resource => resource.id !== id));
    }
  };

  // Get type color
  const getTypeColor = (type: ResourceType) => {
    switch (type) {
      case 'Book': return colors.primaryBlue;
      case 'Video': return colors.secondaryTeal;
      case 'Article': return colors.accentGreen;
      case 'Practice': return colors.accentPurple;
      case 'Exam': return colors.accentOrange;
      default: return colors.textPrimary;
    }
  };

  // Get type icon
  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'Book':
        return "📚";
      case 'Video':
        return "🎬";
      case 'Article':
        return "📄";
      case 'Practice':
        return "📝";
      case 'Exam':
        return "📊";
      default:
        return "📁";
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4" style={{ color: colors.textPrimary }}>
            Manage Student Resources
          </h1>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
            Add, edit, and delete resources for students. Changes will appear on the public website.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-2xl font-bold" style={{ color: colors.primaryBlue }}>
              {resources.length}
            </div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              Total Resources
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-2xl font-bold" style={{ color: colors.secondaryTeal }}>
              {new Set(resources.map(r => r.class)).size}
            </div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              Classes Covered
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-2xl font-bold" style={{ color: colors.accentGreen }}>
              {new Set(resources.map(r => r.subject)).size}
            </div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              Subjects Covered
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-2xl font-bold" style={{ color: colors.accentPurple }}>
              {resources.filter(r => r.type === 'Video').length}
            </div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              Video Resources
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Filters and Add Form */}
          <div className="lg:col-span-1">
            {/* Filters Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                Filter Resources
              </h3>
              
              <div className="space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                    Search
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title or description..."
                    className="w-full p-3 rounded-lg border"
                    style={{ 
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      backgroundColor: 'white'
                    }}
                  />
                </div>

                {/* Class Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                    Filter by Class
                  </label>
                  <select
                    value={filterClass}
                    onChange={(e) => {
                      setFilterClass(e.target.value);
                      setFilterSubject("All Subjects");
                    }}
                    className="w-full p-3 rounded-lg border"
                    style={{ 
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="All Classes">All Classes</option>
                    {classes.map(className => (
                      <option key={className} value={className}>{className}</option>
                    ))}
                  </select>
                </div>

                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                    Filter by Subject
                  </label>
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="w-full p-3 rounded-lg border"
                    style={{ 
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="All Subjects">All Subjects</option>
                    {getFilteredSubjects().map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setFilterClass("All Classes");
                    setFilterSubject("All Subjects");
                    setSearchTerm("");
                  }}
                  className="w-full p-3 rounded-lg border transition-colors"
                  style={{ 
                    borderColor: colors.border,
                    color: colors.textSecondary,
                    backgroundColor: 'white'
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Add/Edit Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  {editingId ? 'Edit Resource' : 'Add New Resource'}
                </h3>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 rounded-lg font-medium"
                    style={{ 
                      backgroundColor: colors.primaryBlue,
                      color: 'white'
                    }}
                  >
                    + Add New
                  </button>
                )}
              </div>

              {showForm && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 rounded-lg border"
                      style={{ 
                        borderColor: colors.border,
                        color: colors.textPrimary,
                        backgroundColor: 'white'
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                        Class *
                      </label>
                      <select
                        name="class"
                        value={formData.class}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 rounded-lg border"
                        style={{ 
                          borderColor: colors.border,
                          color: colors.textPrimary,
                          backgroundColor: 'white'
                        }}
                      >
                        {classes.map(className => (
                          <option key={className} value={className}>{className}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 rounded-lg border"
                        style={{ 
                          borderColor: colors.border,
                          color: colors.textPrimary,
                          backgroundColor: 'white'
                        }}
                      >
                        {(formData.class.includes("6") || formData.class.includes("7") || formData.class.includes("8")) && 
                          subjectsByClass["Class 6-8"].map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))
                        }
                        {(formData.class.includes("9") || formData.class.includes("10")) && 
                          subjectsByClass["Class 9-10"].map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))
                        }
                        {formData.class.includes("Science") && 
                          subjectsByClass["Science"].map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))
                        }
                        {formData.class.includes("Commerce") && 
                          subjectsByClass["Commerce"].map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))
                        }
                        {formData.class.includes("Arts") && 
                          subjectsByClass["Arts"].map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                      Resource Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 rounded-lg border"
                      style={{ 
                        borderColor: colors.border,
                        color: colors.textPrimary,
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="Book">Book</option>
                      <option value="Video">Video</option>
                      <option value="Article">Article</option>
                      <option value="Practice">Practice</option>
                      <option value="Exam">Exam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                      Link URL *
                    </label>
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      required
                      placeholder="https://example.com/resource"
                      className="w-full p-3 rounded-lg border"
                      style={{ 
                        borderColor: colors.border,
                        color: colors.textPrimary,
                        backgroundColor: 'white'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full p-3 rounded-lg border"
                      style={{ 
                        borderColor: colors.border,
                        color: colors.textPrimary,
                        backgroundColor: 'white'
                      }}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 rounded-lg font-medium"
                      style={{ 
                        backgroundColor: colors.primaryBlue,
                        color: 'white'
                      }}
                    >
                      {editingId ? 'Update Resource' : 'Add Resource'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                        setFormData({
                          title: "",
                          type: "Book",
                          link: "",
                          description: "",
                          class: "Class 6",
                          subject: "Mathematics"
                        });
                      }}
                      className="flex-1 px-4 py-3 rounded-lg border font-medium"
                      style={{ 
                        borderColor: colors.border,
                        color: colors.textSecondary
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column - Resources List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                    Resources ({filteredResources.length})
                  </h3>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    {filterClass !== "All Classes" && `Class: ${filterClass} • `}
                    {filterSubject !== "All Subjects" && `Subject: ${filterSubject}`}
                  </p>
                </div>
                <div className="text-sm" style={{ color: colors.textSecondary }}>
                  Showing {filteredResources.length} of {resources.length} resources
                </div>
              </div>

              {filteredResources.length > 0 ? (
                <div className="space-y-4">
                  {filteredResources.map(resource => (
                    <div 
                      key={resource.id}
                      className="rounded-xl p-4 border transition-all duration-300 hover:shadow-md"
                      style={{ 
                        borderColor: colors.border,
                        backgroundColor: 'white'
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                              style={{ backgroundColor: `${getTypeColor(resource.type)}15` }}
                            >
                              {getTypeIcon(resource.type)}
                            </div>
                            <span 
                              className="text-xs font-medium px-2 py-1 rounded-full"
                              style={{ 
                                backgroundColor: `${getTypeColor(resource.type)}15`,
                                color: getTypeColor(resource.type)
                              }}
                            >
                              {resource.type}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full border"
                              style={{ 
                                borderColor: colors.border,
                                color: colors.textSecondary
                              }}
                            >
                              {resource.class}
                            </span>
                          </div>
                          
                          <h4 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
                            {resource.title}
                          </h4>
                          
                          <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                            {resource.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm" style={{ color: colors.textPrimary }}>
                              <span className="font-medium">Subject:</span> {resource.subject}
                            </div>
                            <a
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm px-3 py-1 rounded border transition-colors hover:shadow-sm"
                              style={{ 
                                borderColor: colors.primaryBlue,
                                color: colors.primaryBlue
                              }}
                            >
                              Visit Link
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(resource)}
                            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{ 
                              backgroundColor: `${colors.secondaryTeal}10`,
                              color: colors.secondaryTeal
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(resource.id)}
                            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{ 
                              backgroundColor: `${colors.accentOrange}10`,
                              color: colors.accentOrange
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${colors.textSecondary}10` }}>
                    <svg className="w-10 h-10" style={{ color: colors.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                    No Resources Found
                  </h4>
                  <p className="max-w-md mx-auto mb-6" style={{ color: colors.textSecondary }}>
                    {searchTerm ? 'Try changing your search terms.' : 'Add your first resource using the form on the left.'}
                  </p>
                  {!showForm && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-6 py-3 rounded-lg font-medium"
                      style={{ 
                        backgroundColor: colors.primaryBlue,
                        color: 'white'
                      }}
                    >
                      + Add New Resource
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}