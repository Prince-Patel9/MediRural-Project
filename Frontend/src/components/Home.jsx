import React, { useState, useEffect } from 'react';
import { Search, Shield, Truck, Clock, Star, ArrowRight, Heart, Stethoscope, Pill, Activity, CheckCircle, Users, Award, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animatedNumbers, setAnimatedNumbers] = useState({ customers: 0, medicines: 0, doctors: 0 });
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [richCategories, setRichCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const testimonials = [
    { name: "Sarah Johnson", role: "Regular Customer", text: "Fast delivery and genuine medicines. Highly recommended!", rating: 5 },
    { name: "Dr. Michael Chen", role: "Healthcare Professional", text: "Reliable platform for authentic pharmaceutical products.", rating: 5 },
    { name: "Emma Wilson", role: "Chronic Patient", text: "Life-saver for my monthly medication needs. Never disappoints!", rating: 5 }
  ];

  useEffect(() => {
    let fetchCategories = async () => {
      let response = await axios.get("https://medirural.onrender.com/api/medicines/categories");
      setCategories(response.data.categories);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      // Define a list of icons and gradients to cycle through
      const iconGradientList = [
        { icon: '💊', gradient: 'from-blue-500 to-blue-700' },
        { icon: '🌿', gradient: 'from-emerald-500 to-emerald-700' },
        { icon: '🧴', gradient: 'from-purple-500 to-purple-700' },
        { icon: '👶', gradient: 'from-pink-500 to-pink-700' },
        { icon: '🩺', gradient: 'from-red-500 to-red-700' },
        { icon: '🌱', gradient: 'from-yellow-500 to-yellow-700' },
        { icon: '💪', gradient: 'from-orange-500 to-orange-700' },
        { icon: '👴', gradient: 'from-indigo-500 to-indigo-700' }
      ];
      setRichCategories(
        categories.map((category, idx) => {
          const { icon, gradient } = iconGradientList[idx % iconGradientList.length];
          const popular = idx === 0 || idx === 4;
          return {
            name: category,
            icon,
            gradient,
            popular
          };
        })
      );
    }
  }, [categories]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 overflow-hidden">
      {/* Hero Section (Left only, minimal animation) */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-600/10 rounded-3xl"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-10">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-lg">
              <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-700">Trusted by 50K+ customers</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl lg:text-7xl font-black text-slate-900 leading-none tracking-tight lg:whitespace-nowrap">
                Your Health, Our Mission
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-xl font-light">
                Experience premium healthcare with authenticated medicines, expert consultations, and lightning-fast delivery - all in one trusted platform.
              </p>
            </div>
            {/* Search Bar */}
            <div className="relative max-w-xl group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search medicines, supplements, health products..."
                  className="w-full pl-16 pr-6 py-5 bg-transparent text-slate-700 placeholder-slate-400 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                />
                <button
                  className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={() => {
                    if (searchInput.trim()) {
                      navigate('/medicines', { state: { search: searchInput.trim(), category: selectedCategory } });
                    } else {
                      navigate('/medicines');
                    }
                  }}
                >
                  Search
                </button>
              </div>
            </div>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white px-10 py-5 rounded-3xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                <span className="relative flex items-center justify-center" onClick={() => {
                  if (searchInput.trim()) {
                    navigate('/medicines', { state: { search: searchInput.trim(), category: selectedCategory } });
                  } else {
                    navigate('/medicines');
                  }
                }}>
                  Shop Premium Medicines
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </button>
            </div>
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-8 pt-6">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current drop-shadow-sm" />
                ))}
              </div>
              <span className="text-slate-600 font-semibold">4.9/5 (2,847 reviews)</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
                <span className="text-slate-600 font-semibold">FDA Approved</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-500" />
                <span className="text-slate-600 font-semibold">100% Authentic</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Premium Categories Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-slate-900 mb-6">Curated Health Categories</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover premium healthcare products organized for your specific needs and lifestyle.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {richCategories.map((category, index) => (
              <div key={index} className="group cursor-pointer relative" onClick={() => {
                setSelectedCategory(category.name);
                navigate('/medicines', { state: { category: category.name } });
              }}>
                {category.popular && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">
                    Popular
                  </div>
                )}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 group-hover:scale-105 border border-white/50">
                  <div className={`bg-gradient-to-br ${category.gradient} w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                    <span className="filter drop-shadow-sm">{category.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 text-center mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <div className="text-center">
                    <span className="inline-flex items-center text-slate-500 text-sm font-medium group-hover:text-blue-600 transition-colors">
                      Explore Collection
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Award className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-blue-700 font-semibold">Why We're Different</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-6">Premium Healthcare Experience</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We've revolutionized online pharmacy with cutting-edge technology, uncompromising quality, and personalized care that puts your health first.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">100% Authentic Guarantee</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Every medicine undergoes rigorous verification. We partner directly with licensed manufacturers and maintain complete supply chain transparency.
                </p>
                <div className="flex items-center text-blue-600 font-semibold">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Verified Supply Chain</span>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-3xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Lightning Fast Delivery</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Advanced logistics network ensures same-day delivery in major cities with temperature-controlled packaging for sensitive medications.
                </p>
                <div className="flex items-center text-emerald-600 font-semibold">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Cold Chain Maintained</span>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Expert Care Team</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Round-the-clock support from licensed pharmacists and healthcare professionals. Get personalized advice anytime you need it.
                </p>
                <div className="flex items-center text-purple-600 font-semibold">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Licensed Professionals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Testimonials Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-16">What Our Customers Say</h2>
          
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50">
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-8 w-8 text-yellow-400 fill-current mx-1" />
              ))}
            </div>
            
            <blockquote className="text-2xl font-light text-slate-700 mb-8 italic leading-relaxed">
              "{testimonials[currentTestimonial].text}"
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {testimonials[currentTestimonial].name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 text-lg">{testimonials[currentTestimonial].name}</div>
                <div className="text-slate-600">{testimonials[currentTestimonial].role}</div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-blue-600 w-8' : 'bg-slate-300'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;