// components/SchoolFacilities.tsx
'use client';

export default function SchoolFacilities() {
  // Color palette
  const colors = {
    primaryBlue: "#2563EB",
    secondaryTeal: "#0D9488",
    accentGreen: "#16A34A",
    accentOrange: "#F59E0B",
    background: "#F9FAFB",
    card: "#FFFFFF",
    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
  };

  // Facilities data with alternating layout
  const facilities = [
    {
      id: 1,
      title: "Library",
      description: "Our school library is a treasure trove of knowledge with over 10,000 books spanning various subjects, genres, and reading levels. It provides a quiet, comfortable space for students to study, research, and develop a love for reading. The library is equipped with digital resources, e-books, and computer stations for modern research needs, making it a comprehensive learning hub for all students.",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=600&fit=crop",
      layout: "image-left"
    },
    {
      id: 2,
      title: "Science Lab",
      description: "Well-equipped science laboratories for Physics, Chemistry, and Biology provide hands-on learning experiences where students conduct experiments under proper supervision to understand scientific concepts practically. The labs feature modern equipment, safety apparatus, and are regularly updated to meet curriculum requirements, ensuring students get practical exposure to scientific principles in a safe environment.",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
      layout: "image-right"
    },
    {
      id: 3,
      title: "Computer Lab",
      description: "State-of-the-art computer lab equipped with the latest technology to provide students with essential digital skills. From basic computer literacy to advanced programming, our lab supports comprehensive IT education with modern computers, high-speed internet, and the latest software. Students learn programming, graphic design, and multimedia skills in a technology-rich environment that prepares them for the digital world.",
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop",
      layout: "image-left"
    },
    {
      id: 4,
      title: "Playground",
      description: "Spacious and well-maintained playground provides students with opportunities for physical activities, sports, and recreational games. Designed to promote physical fitness, teamwork, and healthy competition, it includes football and cricket fields, basketball and volleyball courts, running tracks, and indoor games facilities. The playground is a space where students develop sportsmanship, physical health, and social skills through various athletic activities.",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop",
      layout: "image-right"
    }
  ];

  return (
    <div className="min-h-screen py-8 md:py-12" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ 
              color: colors.textPrimary,
              fontFamily: "var(--font-montserrat)",
              lineHeight: "1.2"
            }}
          >
            School Facilities
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
            Explore our modern facilities designed to support holistic education and student development
          </p>
        </div>

        {/* Facilities Sections */}
        <div className="space-y-8 md:space-y-12">
          {facilities.map((facility) => (
            <div 
              key={facility.id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              style={{ border: `1px solid ${colors.border}` }}
            >
              {/* Mobile View */}
              <div className="block md:hidden">
                <div className="h-64 w-full overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${facility.image})` }}
                  />
                </div>
                
                <div className="p-6 h-auto min-h-[250px] flex flex-col justify-center">
                  <h2 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                    {facility.title}
                  </h2>
                  <p className="text-base md:text-lg" style={{ color: colors.textSecondary }}>
                    {facility.description}
                  </p>
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden md:flex h-[500px]">
                <div className={`flex w-full ${facility.layout === 'image-left' ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Image Section - Equal Height */}
                  <div className="w-1/2 h-full">
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${facility.image})` }}
                    />
                  </div>

                  {/* Text Section - Equal Height */}
                  <div className="w-1/2 h-full p-10 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                      {facility.title}
                    </h2>
                    <p className="text-lg md:text-xl" style={{ color: colors.textSecondary }}>
                      {facility.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}