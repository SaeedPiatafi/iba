// components/ContactSection.tsx
'use client';

import { useEffect, useState } from 'react';

export default function ContactSection() {
  // Color palette
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

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="py-16 md:py-20" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
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
                Contact Us
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
            Contact For Any Query
          </h1>

          <p
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{
              color: colors.textSecondary,
              fontFamily: "var(--font-inter)",
              lineHeight: "1.6",
            }}
          >
            We're here to help! Reach out to us with any questions or concerns you may have.
          </p>
        </div>

        {/* Contact Content - Just Get In Touch and Send Message */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column - Get In Touch */}
          <div className={`bg-white rounded-2xl p-8 shadow-lg transform transition-all duration-700 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.textPrimary }}>
              Get In Touch
            </h2>
            
            <p className="text-lg mb-8 leading-relaxed" style={{ color: colors.textSecondary }}>
              Feel free to reach out to us for any inquiries about admissions, programs, or any other information. Our team is always ready to assist you.
            </p>

            <div className="space-y-6">
              {/* Office Address */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.primaryBlue }}
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
                    Office
                  </h4>
                  <p className="text-base" style={{ color: colors.textSecondary }}>
                    IBA School System<br />
                    Ghotki<br />
                     Pakistan
                  </p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.secondaryTeal }}
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
                    Phone
                  </h4>
                  <a 
                    href="tel:+9221111222333" 
                    className="text-base font-medium block"
                    style={{ color: colors.secondaryTeal }}
                  >
                    +92 21 111 222 333
                  </a>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                    Mon-Fri: 8 AM - 3 PM
                  </p>
                </div>
              </div>

              {/* Email Address */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.accentGreen }}
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
                    Email
                  </h4>
                  <a 
                    href="mailto:info@ibaschool.edu.pk" 
                    className="text-base font-medium block"
                    style={{ color: colors.accentGreen }}
                  >
                    info@ibaschool.edu.pk
                  </a>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                    Response within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Send Message Form */}
          <div className={`bg-white rounded-2xl p-8 shadow-lg transform transition-all duration-700 delay-300 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.textPrimary }}>
              Send Message
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.textPrimary }}
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:outline-none focus:border-blue-500"
                      style={{
                        borderColor: colors.border,
                        backgroundColor: colors.background,
                        color: colors.textPrimary,
                      }}
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="email" 
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.textPrimary }}
                    >
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:outline-none focus:border-blue-500"
                      style={{
                        borderColor: colors.border,
                        backgroundColor: colors.background,
                        color: colors.textPrimary,
                      }}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label 
                    htmlFor="subject" 
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:outline-none focus:border-blue-500"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                      color: colors.textPrimary,
                    }}
                    placeholder="Enter subject"
                  />
                </div>

                {/* Message */}
                <div>
                  <label 
                    htmlFor="message" 
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:outline-none focus:border-blue-500 resize-none"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                      color: colors.textPrimary,
                    }}
                    placeholder="Type your message here..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    backgroundColor: colors.primaryBlue,
                    fontFamily: "var(--font-poppins)",
                  }}
                >
                  Send Message
                  <svg 
                    className="w-5 h-5 ml-2 inline-block" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Form Note */}
            <p className="text-xs mt-6 text-center" style={{ color: colors.textSecondary }}>
              * Required fields. We'll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}