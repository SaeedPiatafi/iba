// components/AboutSection.tsx
"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function AboutSection() {
  // Color palette (from your specifications)
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

  // Features list
  const features = [
    "Skilled Instructors",
    "Online Classes",
    "International Certificate",
    "Modern Curriculum",
    "Career Support",
    "Research Facilities",
  ];

  // Add fadeInUp animation when component mounts
  useEffect(() => {
    const elements = document.querySelectorAll(".wow");
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
    <div className="py-16 md:py-20" style={{ backgroundColor: colors.card }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column - Image */}
          <div
            className="wow fadeInUp lg:w-1/2"
            data-wow-delay="0.1s"
            style={{ minHeight: "400px" }}
          >
            <div className="relative w-full h-[400px] lg:h-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/about-section.jpg"
                alt="IBA Institute Campus"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-[1]"></div>

              {/* Image overlay for better text contrast if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-[1]"></div>

              {/* Stats overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div
                      className="text-2xl md:text-3xl font-bold"
                      style={{ color: colors.primaryBlue }}
                    >
                      25+
                    </div>
                    <div
                      className="text-xs md:text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      Years Experience
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-2xl md:text-3xl font-bold"
                      style={{ color: colors.secondaryTeal }}
                    >
                      5K+
                    </div>
                    <div
                      className="text-xs md:text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      Students
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-2xl md:text-3xl font-bold"
                      style={{ color: colors.accentGreen }}
                    >
                      50+
                    </div>
                    <div
                      className="text-xs md:text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      Programs
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="wow fadeInUp lg:w-1/2" data-wow-delay="0.3s">
            {/* Section Title */}
            <div className="flex items-center mb-6">
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
                  About Us
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              style={{
                color: colors.textPrimary,
                fontFamily: "var(--font-montserrat)",
                lineHeight: "1.2",
              }}
            >
              Welcome to IBA Institute
            </h1>

            {/* Description Paragraphs */}
            <p
              className="text-lg mb-4"
              style={{
                color: colors.textSecondary,
                fontFamily: "var(--font-inter)",
                lineHeight: "1.7",
              }}
            >
              Established in 1995, IBA Institute has been at the forefront of
              business education, nurturing future leaders with innovative
              teaching methods and industry-relevant curriculum. We extend
              excellence beyond academics by offering hands-on experience,
              research opportunities, and global exposure to equip students for
              successful business careers.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center group">
                  <div className="mr-3 transition-transform duration-300 group-hover:translate-x-1">
                    <svg
                      className="w-5 h-5"
                      style={{ color: colors.primaryBlue }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                  <span
                    className="text-base transition-colors duration-300 group-hover:text-blue-600"
                    style={{
                      color: colors.textPrimary,
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Read More Button */}
            <a
              href="/about"
              className="inline-flex items-center px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              style={{
                backgroundColor: colors.primaryBlue,
                fontFamily: "var(--font-poppins)",
              }}
            >
              <span>Read More</span>
              <svg
                className="w-5 h-5 ml-3 transform transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
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

        .wow {
          visibility: hidden;
        }

        .wow.animated {
          visibility: visible;
          animation-name: fadeInUp;
          animation-duration: 1s;
          animation-fill-mode: both;
        }

        .fadeInUp {
          animation-name: fadeInUp;
        }

        /* Hover effects */
        .hover-lift:hover {
          transform: translateY(-5px);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          h1 {
            font-size: 2rem !important;
          }

          .grid-cols-2 {
            gap: 2rem;
          }
        }

        @media (max-width: 640px) {
          .image-container {
            min-height: 300px !important;
          }

          .stats-overlay {
            bottom: 1rem;
            left: 1rem;
            right: 1rem;
            padding: 0.75rem;
          }
        }

        /* Smooth transitions */
        * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Container width matching original */
        .container {
          max-width: 1320px;
          margin: 0 auto;
        }

        /* Original padding classes */
        .py-5 {
          padding-top: 3rem;
          padding-bottom: 3rem;
        }

        @media (min-width: 768px) {
          .py-5 {
            padding-top: 5rem;
            padding-bottom: 5rem;
          }
        }

        /* Spacing matching original */
        .gap-5 {
          gap: 3rem;
        }

        .mb-4 {
          margin-bottom: 1rem;
        }

        .mb-6 {
          margin-bottom: 1.5rem;
        }

        .mb-8 {
          margin-bottom: 2rem;
        }

        .mt-2 {
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
