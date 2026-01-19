// pages/404.js
import Head from 'next/head'
import Link from 'next/link'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found | School Website</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          {/* Animated 404 */}
          <div className="relative mb-8">
            <div className="text-9xl font-black text-gray-800 opacity-10">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center">
                <span className="text-7xl font-black text-blue-600">4</span>
                <div className="mx-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  </div>
                </div>
                <span className="text-7xl font-black text-teal-600">4</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Oops! Class Dismissed
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Looks like this page decided to take an early recess. 
            Don&apos;t worry, we&apos;ve got plenty of other lessons for you!
          </p>

          {/* Primary CTA */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Return to School Homepage
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}