// components/VisionSection.tsx
"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function VisionSection() {
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

  // Vision & Mission items
  const visionMission = [
    {
      id: 1,
      type: "vision",
      title: "Our Vision",
      description: "To be a globally recognized center of excellence in business education, fostering innovation, ethical leadership, and sustainable development through transformative learning experiences.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      bgColor: "rgba(37, 99, 235, 0.1)",
      textColor: colors.primaryBlue
    },
    {
      id: 2,
      type: "mission",
      title: "Our Mission",
      description: "To provide world-class education that empowers students with knowledge, skills, and values to excel in their careers and contribute meaningfully to society through innovation and ethical practices.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      bgColor: "rgba(13, 148, 136, 0.1)",
      textColor: colors.secondaryTeal
    }
  ];

  // Core Values
  const coreValues = [
    {
      id: 1,
      title: "Excellence",
      description: "Commitment to highest standards in teaching, research, and innovation",
      icon: "⭐"
    },
    {
      id: 2,
      title: "Integrity",
      description: "Upholding ethical principles and academic honesty in all endeavors",
      icon: "⚖️"
    },
    {
      id: 3,
      title: "Innovation",
      description: "Fostering creativity and embracing new ideas and technologies",
      icon: "💡"
    },
    {
      id: 4,
      title: "Inclusion",
      description: "Creating an environment that respects diversity and promotes equity",
      icon: "🤝"
    },
    {
      id: 5,
      title: "Leadership",
      description: "Developing future leaders who drive positive change in society",
      icon: "👑"
    },
    {
      id: 6,
      title: "Sustainability",
      description: "Promoting practices that ensure long-term social and environmental wellbeing",
      icon: "🌱"
    }
  ];

  // Add animation when component mounts
  useEffect(() => {
    const elements = document.querySelectorAll(".vision-card, .value-card");
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
                Our Vision & Mission
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
            Shaping Future Leaders
          </h1>

          <p
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{
              color: colors.textSecondary,
              fontFamily: "var(--font-inter)",
              lineHeight: "1.6",
            }}
          >
            Guided by a clear vision and mission, we are committed to transforming education and empowering the next generation of business leaders.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-20">
          {visionMission.map((item, index) => (
            <div
              key={item.id}
              className="vision-card group relative bg-white rounded-2xl p-8 md:p-10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
              style={{
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                border: `1px solid ${colors.border}`,
              }}
              data-wow-delay={`${index * 0.2}s`}
            >
              {/* Icon Header */}
              <div className="flex items-start mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mr-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    backgroundColor: item.bgColor,
                  }}
                >
                  <div style={{ color: item.textColor }}>
                    {item.icon}
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <span
                      className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: item.type === "vision" 
                          ? "rgba(37, 99, 235, 0.1)" 
                          : "rgba(13, 148, 136, 0.1)",
                        color: item.textColor,
                      }}
                    >
                      {item.type === "vision" ? "Vision" : "Mission"}
                    </span>
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold"
                    style={{
                      color: colors.textPrimary,
                      fontFamily: "var(--font-montserrat)",
                    }}
                  >
                    {item.title}
                  </h2>
                </div>
              </div>

              {/* Description */}
              <p
                className="text-lg leading-relaxed"
                style={{
                  color: colors.textSecondary,
                  fontFamily: "var(--font-inter)",
                  lineHeight: "1.8",
                }}
              >
                {item.description}
              </p>

              {/* Decorative Line */}
              <div className="mt-8 pt-8 relative">
                <div
                  className="absolute top-0 left-0 w-16 h-1 rounded-full"
                  style={{
                    backgroundColor: item.textColor,
                  }}
                />
                <div
                  className="text-sm font-medium"
                  style={{
                    color: item.textColor,
                    fontFamily: "var(--font-poppins)",
                  }}
                >
                  Driving {item.type === "vision" ? "Future" : "Present"} Excellence
                </div>
              </div>

              {/* Hover Effect Border */}
              <div
                className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-300 pointer-events-none"
                style={{ borderColor: `${item.textColor}40` }}
              />
            </div>
          ))}
        </div>

        {/* Core Values Section */}
        <div className="mb-16 md:mb-20">
          <div className="text-center mb-12">
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4"
              style={{
                color: colors.textPrimary,
                fontFamily: "var(--font-montserrat)",
              }}
            >
              Our Core Values
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{
                color: colors.textSecondary,
                fontFamily: "var(--font-inter)",
                lineHeight: "1.6",
              }}
            >
              The fundamental principles that guide our actions and shape our institutional culture
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {coreValues.map((value, index) => (
              <div
                key={value.id}
                className="value-card group bg-white rounded-2xl p-6 md:p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
                style={{
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
                  border: `1px solid ${colors.border}`,
                }}
                data-wow-delay={`${index * 0.1}s`}
              >
                <div className="flex items-start">
                  <div className="text-3xl mr-4 transition-transform duration-500 group-hover:scale-125">
                    {value.icon}
                  </div>
                  <div>
                    <h3
                      className="text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-blue-600"
                      style={{
                        color: colors.textPrimary,
                        fontFamily: "var(--font-montserrat)",
                      }}
                    >
                      {value.title}
                    </h3>
                    <p
                      className="text-base"
                      style={{
                        color: colors.textSecondary,
                        fontFamily: "var(--font-inter)",
                        lineHeight: "1.6",
                      }}
                    >
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="mb-6">
                <div
                  className="inline-flex items-center px-4 py-2 rounded-full mb-4"
                  style={{
                    backgroundColor: "rgba(22, 163, 74, 0.1)",
                  }}
                >
                  <span
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{
                      color: colors.accentGreen,
                      fontFamily: "var(--font-poppins)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Our Strategy
                  </span>
                </div>
                <h2
                  className="text-2xl md:text-3xl font-bold mb-6"
                  style={{
                    color: colors.textPrimary,
                    fontFamily: "var(--font-montserrat)",
                  }}
                >
                  Building a Sustainable Future
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  "Continuous curriculum innovation aligned with industry needs",
                  "Strategic partnerships with global institutions and corporations",
                  "Investment in cutting-edge research and technology infrastructure",
                  "Focus on student-centric learning and holistic development",
                  "Commitment to community engagement and social responsibility"
                ].map((strategy, index) => (
                  <div key={index} className="flex items-center group">
                    <div className="mr-4 transition-transform duration-300 group-hover:translate-x-1">
                      <svg
                        className="w-5 h-5"
                        style={{ color: colors.accentGreen }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span
                      className="text-lg transition-colors duration-300 group-hover:text-green-600"
                      style={{
                        color: colors.textPrimary,
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      {strategy}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl md:text-8xl mb-4" style={{ color: colors.primaryBlue }}>
                    🎯
                  </div>
                  <h3
                    className="text-xl md:text-2xl font-bold mb-2"
                    style={{
                      color: colors.textPrimary,
                      fontFamily: "var(--font-montserrat)",
                    }}
                  >
                    Strategic Excellence
                  </h3>
                  <p
                    className="text-base md:text-lg"
                    style={{
                      color: colors.textSecondary,
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    Guided by purpose, driven by innovation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="mt-16 md:mt-20 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <svg
                className="w-12 h-12 mx-auto opacity-20"
                style={{ color: colors.primaryBlue }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p
              className="text-xl md:text-2xl italic mb-6"
              style={{
                color: colors.textSecondary,
                fontFamily: "var(--font-inter)",
                lineHeight: "1.8",
              }}
            >
              "We don't just prepare students for the world as it is; we empower them to shape the world as it could be."
            </p>
            <div
              className="text-lg font-medium"
              style={{
                color: colors.primaryBlue,
                fontFamily: "var(--font-poppins)",
              }}
            >
              — IBA Leadership Team
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

        .vision-card,
        .value-card {
          opacity: 0;
        }

        .vision-card.animated,
        .value-card.animated {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .vision-card {
            padding: 1.5rem !important;
          }
          
          .value-card {
            padding: 1.25rem !important;
          }
          
          h1 {
            font-size: 2rem !important;
          }
          
          h2 {
            font-size: 1.5rem !important;
          }
          
          .text-xl {
            font-size: 1.125rem !important;
          }
          
          .text-lg {
            font-size: 1rem !important;
          }
        }

        @media (max-width: 768px) {
          .grid-cols-2 {
            gap: 1.5rem !important;
          }
          
          .grid-cols-3 {
            grid-template-columns: repeat(1, 1fr);
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