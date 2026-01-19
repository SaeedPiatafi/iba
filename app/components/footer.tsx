// components/Footer.tsx
"use client";

export default function Footer() {
  // Color palette for black theme
  const colors = {
    primaryBlue: "#2563EB",
    secondaryTeal: "#0D9488",
    accentGreen: "#16A34A",
    background: "#000000",
    card: "#1F2937",
    textPrimary: "#FFFFFF",
    textSecondary: "#D1D5DB",
    border: "#374151",
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-black border-t"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1: IBA Logo and Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-lg"
                style={{ backgroundColor: colors.primaryBlue }}
              >
                <span className="text-white font-bold text-xl">IBA</span>
              </div>
              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{ color: colors.textPrimary }}
                >
                  IBA
                </h2>
                <h2
                  className="text-xl font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  eLEARNING
                </h2>
              </div>
            </div>

            <p
              className="text-base leading-relaxed"
              style={{ color: colors.textSecondary }}
            >
              Transforming education through innovative digital learning
              platforms and industry-relevant curriculum.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              {[
                { icon: "facebook", color: "#1877F2" },
                { icon: "twitter", color: "#1DA1F2" },
                { icon: "instagram", color: "#E4405F" },
                { icon: "linkedin", color: "#0A66C2" },
                { icon: "youtube", color: "#FF0000" },
              ].map((social) => (
                <a
                  key={social.icon}
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  style={{
                    backgroundColor: colors.card,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                  aria-label={social.icon}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: social.color }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {social.icon === "facebook" && (
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    )}
                    {social.icon === "twitter" && (
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    )}
                    {social.icon === "instagram" && (
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    )}
                    {social.icon === "linkedin" && (
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    )}
                    {social.icon === "youtube" && (
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          {/* Column 2: Quick Links */}
          <div>
            <h3
              className="text-xl font-bold mb-6 pb-2"
              style={{
                color: colors.textPrimary,
                borderBottom: `2px solid ${colors.primaryBlue}`,
                display: "inline-block",
              }}
            >
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                {
                  name: "Home",
                  icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                },
                {
                  name: "About",
                  icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                },
                {
                  name: "Teacher",
                  // Teacher/Instructor icon
                  icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
                },
                {
                  name: "Contact",
                  icon: "M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                },
                {
                  name: "Alumni",
                  // People/group icon for alumni
                  icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m-9 0v1a6 6 0 006 6h.01M15 10a4 4 0 11-8 0 4 4 0 018 0z",
                },
                {
                  name: "Gallery",
                  // Camera/gallery icon
                  icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
                },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href="#"
                    className="flex items-center space-x-3 text-base transition-all duration-300 hover:translate-x-2 hover:text-blue-400 group"
                    style={{ color: colors.textSecondary }}
                  >
                    <svg
                      className="w-5 h-5 group-hover:text-blue-400"
                      style={{ color: colors.primaryBlue }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={link.icon}
                      />
                    </svg>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3
              className="text-xl font-bold mb-6 pb-2"
              style={{
                color: colors.textPrimary,
                borderBottom: `2px solid ${colors.primaryBlue}`,
                display: "inline-block",
              }}
            >
              Contact Us
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: colors.card }}
                  >
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4
                    className="font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    Address
                  </h4>
                  <p
                    className="text-sm mt-1"
                    style={{ color: colors.textSecondary }}
                  >
                    IBA school system
                    <br />
                    Ghotki
                    <br />
                    Pakistan
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: colors.card }}
                  >
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4
                    className="font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    Phone
                  </h4>
                  <a
                    href="tel:+922199911122"
                    className="text-sm mt-1 block transition-colors duration-300 hover:text-blue-400"
                    style={{ color: colors.textSecondary }}
                  >
                    +92 21 999 111 22
                  </a>
                </div>
              </li>

              <li className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: colors.card }}
                  >
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
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4
                    className="font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    Email
                  </h4>
                  <a
                    href="mailto:info@ibaelearning.edu.pk"
                    className="text-sm mt-1 block transition-colors duration-300 hover:text-blue-400"
                    style={{ color: colors.textSecondary }}
                  >
                    info@ibaelearning.edu.pk
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t py-6"
        style={{
          borderColor: colors.border,
          backgroundColor: "#111827",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p
              className="text-sm text-center md:text-left"
              style={{ color: colors.textSecondary }}
            >
              © {currentYear} Institute of Business Administration (IBA)
                All rights reserved.
            </p>

          </div>
        </div>
      </div>

      {/* Responsive CSS */}
      <style jsx>{`
        /* Mobile-first responsive design */
        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .grid {
            gap: 2.5rem;
          }

          h2 {
            font-size: 1.5rem;
          }

          .social-links a {
            width: 2.5rem;
            height: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .grid-cols-3 {
            grid-template-columns: 1fr;
          }

          .quick-links,
          .contact-us {
            margin-top: 2rem;
          }
        }

        /* Tablet adjustments */
        @media (min-width: 769px) and (max-width: 1024px) {
          .grid-cols-3 {
            grid-template-columns: repeat(2, 1fr);
          }

          .quick-links {
            margin-top: 0;
          }

          .contact-us {
            margin-top: 2rem;
            grid-column: span 2;
          }
        }

        /* Desktop optimizations */
        @media (min-width: 1025px) {
          .grid-cols-3 {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Smooth transitions */
        a,
        button {
          transition: all 0.3s ease;
        }
      `}</style>
    </footer>
  );
}
