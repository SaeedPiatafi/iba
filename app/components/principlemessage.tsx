// components/PrincipalMessage.tsx
"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function PrincipalMessage() {
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

  // Education details
  const education = [
    "PhD in Business Administration - Harvard University",
    "MSc in Economics - London School of Economics",
    "Postdoctoral Fellowship - Stanford Graduate School of Business",
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
          {/* Left Column - Principal Image (Top on mobile, Left on desktop) */}
          <div
            className="wow fadeInUp lg:w-1/2"
            data-wow-delay="0.1s"
          >
            <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
              {/* Fallback background */}
              <div className="absolute inset-0 bg-gray-200"></div>
              
              <Image
                src="https://cfmnrikwmscegidvmqzd.supabase.co/storage/v1/object/public/teacher-images/teacher-1770038722417-kgyolvsmjk.jpg"
                alt="Dr. Sarah Johnson - Principal"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-[1]"></div>

              {/* Education Overlay */}
              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-2xl">
                <div className="flex items-center mb-3 md:mb-4">
                  <div
                    className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg mr-2 md:mr-3"
                    style={{ backgroundColor: colors.primaryBlue }}
                  >
                    <svg
                      className="w-4 h-4 md:w-6 md:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      />
                    </svg>
                  </div>
                  <h3
                    className="text-base md:text-lg font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    Education
                  </h3>
                </div>

                <ul className="space-y-2 md:space-y-3">
                  {education.map((item, index) => (
                    <li key={index} className="flex items-start group">
                      <div className="mr-2 md:mr-3 mt-0.5 md:mt-1 flex-shrink-0">
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5"
                          style={{ color: colors.primaryBlue }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span
                        className="text-xs md:text-sm leading-relaxed"
                        style={{ color: colors.textSecondary }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Principal Name & Title Overlay */}
              <div className="absolute top-4 md:top-6 left-4 md:left-6 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 md:px-4 md:py-3 shadow-lg">
                <h4
                  className="font-bold text-base md:text-lg"
                  style={{ color: colors.textPrimary }}
                >
                  Dr. Sarah Johnson
                </h4>
                <p className="text-xs md:text-sm" style={{ color: colors.primaryBlue }}>
                  Principal & Director
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Message Content */}
          <div
            className="wow fadeInUp lg:w-1/2"
            data-wow-delay="0.3s"
          >
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
                  Message
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
              A Message from Our Principal
            </h1>

            {/* Quote Icon */}
            <div className="mb-6">
              <svg
                className="w-12 h-12 opacity-20"
                style={{ color: colors.primaryBlue }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            {/* Message Content */}
            <div className="space-y-6">
              <p
                className="text-lg italic"
                style={{
                  color: colors.textSecondary,
                  fontFamily: "var(--font-inter)",
                  lineHeight: "1.8",
                }}
              >
                "Education is not just about acquiring knowledge; it's about
                transforming lives and shaping futures. At IBA, we are committed
                to providing an environment where innovation meets tradition,
                and where every student is empowered to reach their fullest
                potential. We believe in fostering critical thinking, ethical
                leadership, and entrepreneurial spirit through our dedicated
                faculty, state-of-the-art facilities, and industry partnerships."
              </p>
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

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          h1 {
            font-size: 2rem !important;
          }

          .flex-col {
            display: flex;
            flex-direction: column;
          }

          .gap-8 {
            gap: 2rem;
          }
        }

        @media (max-width: 640px) {
          .h-\\[400px\\] {
            height: 350px !important;
          }
          
          h1 {
            font-size: 1.75rem !important;
          }
          
          p {
            font-size: 1rem !important;
            line-height: 1.6 !important;
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
      `}</style>
    </div>
  );
}