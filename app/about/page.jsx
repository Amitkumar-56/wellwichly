import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-4">About Us</h1>
            <p className="text-xl md:text-2xl">Learn more about our story and mission</p>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-center bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">Our Story</h2>
              <div className="prose prose-lg mx-auto text-gray-700">
                <p className="mb-6 text-lg leading-relaxed">
                  Wellwichly was founded with a simple mission: to serve the freshest, 
                  most delicious sandwiches made with love and care at market rates. What started as a small 
                  local business has grown into a beloved destination for sandwich lovers.
                </p>
                <p className="mb-6 text-lg leading-relaxed">
                  Our journey began when we realized that people deserved better than the 
                  average fast-food sandwich. We set out to create something special - 
                  sandwiches that are not just food, but an experience. We work with franchise 
                  partners to bring quality food to every corner.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, we continue to uphold our commitment to quality, freshness, and 
                  customer satisfaction. Every sandwich is prepared with the finest ingredients 
                  at affordable market rates and served with a smile.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-indigo-200">
                <h2 className="text-3xl font-black mb-4 text-indigo-600">Our Mission</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To provide fresh, delicious, and affordable sandwiches to every corner of the country 
                  through our franchise network. We aim to make quality food accessible to everyone while 
                  maintaining the highest standards of hygiene and taste.
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-indigo-200">
                <h2 className="text-3xl font-black mb-4 text-indigo-600">Our Vision</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To become the most trusted and loved sandwich brand in India, known for our 
                  commitment to quality, innovation, and customer satisfaction. We envision a future 
                  where Wellwichly outlets are present in every city, serving fresh sandwiches to millions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-black mb-12 text-center bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Why Choose Wellwichly?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl shadow-xl border-4 border-indigo-200">
                <div className="text-6xl mb-4">🥬</div>
                <h3 className="text-2xl font-black mb-4 text-gray-800">Fresh Ingredients</h3>
                <p className="text-gray-700">
                  We use only the freshest ingredients, sourced daily to ensure the best quality and taste in every bite.
                </p>
              </div>
              <div className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl shadow-xl border-4 border-indigo-200">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-2xl font-black mb-4 text-gray-800">Fast Service</h3>
                <p className="text-gray-700">
                  Our efficient system ensures quick preparation and delivery, so you get your food fresh and hot.
                </p>
              </div>
              <div className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl shadow-xl border-4 border-indigo-200">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-2xl font-black mb-4 text-gray-800">Affordable Prices</h3>
                <p className="text-gray-700">
                  Quality food at market rates. We believe everyone deserves great food without breaking the bank.
                </p>
              </div>
              <div className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl shadow-xl border-4 border-indigo-200">
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-2xl font-black mb-4 text-gray-800">Franchise Network</h3>
                <p className="text-gray-700">
                  Join our growing franchise network and be part of the Wellwichly family. Low investment, high returns.
                </p>
              </div>
              <div className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl shadow-xl border-4 border-indigo-200">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-2xl font-black mb-4 text-gray-800">Quality Assured</h3>
                <p className="text-gray-700">
                  Every sandwich is prepared with care, following strict quality standards and hygiene protocols.
                </p>
              </div>
              <div className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl shadow-xl border-4 border-indigo-200">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-2xl font-black mb-4 text-gray-800">Easy Ordering</h3>
                <p className="text-gray-700">
                  Order online through our website or call directly. Multiple payment options available for your convenience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section (Optional) */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-black mb-12 text-center bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Our Team
            </h2>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Behind Wellwichly is a dedicated team of food enthusiasts, chefs, and business professionals 
                who are passionate about bringing you the best sandwich experience. From our kitchen staff 
                to our franchise partners, everyone is committed to excellence.
              </p>
              <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-indigo-200">
                <p className="text-xl text-gray-700 font-semibold">
                  We're always looking for passionate individuals to join our team. 
                  If you share our vision, reach out to us!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
