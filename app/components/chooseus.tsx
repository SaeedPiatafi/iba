// components/WhyChooseUs.tsx
"use client";

import { useEffect } from "react";

export default function WhyChooseUs() {
  // Color palette (matching previous sections)
  const colors = {
    primaryBlue: "#2563EB",
    secondaryTeal: "#0D9488",
    accentGreen: "#16A34A",
    background: "#F9FAFB",
    card: "#FFFFFF",
    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
  };

  // Features data
  const features = [
    {
      id: 2,
      title: "Modern Infrastructure",
      description: "State-of-the-art classrooms, labs, and digital resources for optimal learning.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: colors.secondaryTeal
    },
    {
      id: 3,
      title: "Career Support",
      description: "Comprehensive placement assistance, internships, and career counseling services.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: colors.accentGreen
    },
    {
      id: 6,
      title: "Alumni Network",
      description: "Strong  alumni community providing mentorship and opportunities.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m-9 0v1a6 6 0 006 6h.01M15 10a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: colors.accentGreen
    }
  ];

  // Stats data
  const stats = [
    { value: "25+", label: "Years of Excellence", suffix: "" },
    { value: "1300+", label: "Students", suffix: "" },
    { value: "50+", label: "Teacher's", suffix: "" },
    { value: "5000+", label: "Successful Alumni", suffix: "+" }
  ];

  // Add animation when component mounts
  useEffect(() => {
    const elements = document.querySelectorAll(".feature-card, .stat-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-16 md:py-20" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center mb-6">
            <div
              className="inline-flex items-center px-4 py-2 rounded-full"
              style={{
                backgroundColor: "rgba(37, 99, 235, 0.1)",
              }}
            >
              <span
                className="text-sm font-bold uppercase tracking-wider"
                style={{
                  color: colors.primaryBlue,
                  fontFamily: "var(--font-poppins)",
                  letterSpacing: "0.1em",
                }}
              >
                Why Choose Us
              </span>
            </div>
          </div>

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{
              color: colors.textPrimary,
              fontFamily: "var(--font-montserrat)",
              lineHeight: "1.2",
            }}
          >
            Excellence in Education
          </h1>

          <p
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{
              color: colors.textSecondary,
              fontFamily: "var(--font-inter)",
              lineHeight: "1.6",
            }}
          >
            Discover the unique advantages that make IBA the preferred choice for students seeking quality education and career success.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="feature-card group relative bg-white rounded-2xl p-6 md:p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
              style={{
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                border: `1px solid ${colors.border}`,
              }}
              data-wow-delay={`${index * 0.1}s`}
            >
              {/* Icon Container */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  backgroundColor: `${feature.color}15`,
                }}
              >
                <div style={{ color: feature.color }}>
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <h3
                className="text-xl md:text-2xl font-bold mb-4 transition-colors duration-300 group-hover:text-blue-600"
                style={{
                  color: colors.textPrimary,
                  fontFamily: "var(--font-montserrat)",
                }}
              >
                {feature.title}
              </h3>

              <p
                className="text-base md:text-lg"
                style={{
                  color: colors.textSecondary,
                  fontFamily: "var(--font-inter)",
                  lineHeight: "1.6",
                }}
              >
                {feature.description}
              </p>

              {/* Hover Effect Border */}
              <div
                className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-300 pointer-events-none"
                style={{ borderColor: `${colors.primaryBlue}40` }}
              />
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill={colors.primaryBlue} />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pattern)" />
            </svg>
          </div>

          <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="stat-item text-center p-4 md:p-6"
                  data-wow-delay={`${index * 0.2}s`}
                >
                  <div
                    className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
                    style={{
                      color: colors.primaryBlue,
                      fontFamily: "var(--font-montserrat)",
                    }}
                  >
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-2xl md:text-3xl">{stat.suffix}</span>
                    )}
                  </div>
                  <div
                    className="text-sm md:text-base"
                    style={{
                      color: colors.textSecondary,
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 md:mt-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-bold mb-6"
              style={{
                color: colors.textPrimary,
                fontFamily: "var(--font-montserrat)",
              }}
            >
              Ready to Begin Your Journey?
            </h2>
            <p
              className="text-lg mb-8"
              style={{
                color: colors.textSecondary,
                fontFamily: "var(--font-inter)",
                lineHeight: "1.6",
              }}
            >
              Join thousands of successful students who started their careers with IBA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 border-2"
                style={{
                  color: colors.primaryBlue,
                  borderColor: colors.primaryBlue,
                  fontFamily: "var(--font-poppins)",
                }}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .feature-card,
        .stat-item {
          opacity: 0;
        }

        .feature-card.animated,
        .stat-item.animated {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .feature-card {
            padding: 1.5rem !important;
          }
          
          h1 {
            font-size: 2rem !important;
          }
          
          h2 {
            font-size: 1.5rem !important;
          }
          
          .text-3xl {
            font-size: 2rem !important;
          }
        }

        @media (max-width: 768px) {
          .grid-cols-2 {
            gap: 1rem !important;
          }
          
          .stat-item {
            padding: 1rem !important;
          }
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          .grid-cols-3 {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Smooth transitions */
        * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Container width matching */
        .container {
          max-width: 1320px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}