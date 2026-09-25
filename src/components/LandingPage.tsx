import React from 'react';
import {
  Sprout,
  Stethoscope,
  Bot,
  Droplets,
  FlaskConical,
  ShoppingBag,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Wifi,
  Sparkles,
  PhoneCall,
  Users,
  ChevronDown,
  ChevronUp,
  MapPin,
  TrendingUp,
  Award
} from 'lucide-react';
import { Language } from '../types';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreFeature: (view: string) => void;
  language: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreFeature
}) => {
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(0);

  const solutions = [
    {
      id: 'crop-doctor',
      icon: Stethoscope,
      title: '🌿 AI Crop Doctor',
      desc: 'Snap a picture of an infected leaf. Get instant diagnosis of diseases like Blast, Blight, or Rust with organic and chemical remedies in your mother tongue.',
      color: 'from-emerald-500/15 to-emerald-500/5',
      badge: 'Vision AI'
    },
    {
      id: 'assistant',
      icon: Bot,
      title: '🤖 Multilingual AI Assistant',
      desc: 'Speak or type in Telugu, Hindi, Tamil, or English. Ask practical questions about pest controls, mandi rates, and fertilizer calculations without complex terms.',
      color: 'from-blue-500/15 to-blue-500/5',
      badge: 'Voice & Text'
    },
    {
      id: 'soil',
      icon: Droplets,
      title: '💧 Smart IoT Irrigation',
      desc: 'Real-time soil moisture and temperature telemetry from low-cost ESP32 nodes. Avoid over-watering and protect groundwater with predictive irrigation.',
      color: 'from-cyan-500/15 to-cyan-500/5',
      badge: 'IoT Connected'
    },
    {
      id: 'fertilizer',
      icon: FlaskConical,
      title: '🧪 Smart Fertilizer Advisor',
      desc: 'Calculate precise N-P-K nutrient doses customized to your crop stage, soil type, and acreage. Avoid soil acidification and wasteful fertilizer expenditures.',
      color: 'from-amber-500/15 to-amber-500/5',
      badge: 'ICAR Agronomy'
    },
    {
      id: 'marketplace',
      icon: ShoppingBag,
      title: '🛒 Direct Farmer Marketplace',
      desc: 'Eliminate exploitative middlemen. Sell paddy, vegetables, chillies, and grains directly to retailers, hotels, and consumers with benchmark APMC prices.',
      color: 'from-emerald-600/15 to-emerald-600/5',
      badge: '0% Commission'
    },
    {
      id: 'schemes',
      icon: Building2,
      title: '🏛️ Government Scheme Finder',
      desc: 'Instant eligibility matching for PM-KISAN, PMFBY Crop Insurance, PMKSY Drip Subsidies, Soil Health Cards, and Kisan Credit Cards without agent fees.',
      color: 'from-purple-500/15 to-purple-500/5',
      badge: 'Official Portals'
    }
  ];

  const workflowSteps = [
    {
      num: '01',
      title: 'Set Farm & Crop Profile',
      desc: 'Register land size, soil type, and sown crop (e.g. 2.5 acres Sona Masoori Paddy).'
    },
    {
      num: '02',
      title: 'Monitor Soil & Weather',
      desc: 'Live IoT sensor tracks soil moisture (31%) and 7-day rainfall forecasts.'
    },
    {
      num: '03',
      title: 'Diagnose & Apply Advisory',
      desc: 'Detect early leaf diseases with camera AI and calculate balanced split fertilizer dosages.'
    },
    {
      num: '04',
      title: 'Harvest & Sell Direct',
      desc: 'List harvest on the Agrovision Marketplace and capture transparent APMC premium prices.'
    }
  ];

  const testimonials = [
    {
      name: 'Rama Rao Patel',
      village: 'Duggirala, Guntur (AP)',
      crop: 'Paddy & Tomato',
      quote:
        '“The Crop Doctor detected early leaf blast within 5 seconds in Telugu. I sprayed Pseudomonas immediately and saved nearly ₹18,000 in heavy chemical costs!”',
      stat: 'Saved ₹18,000'
    },
    {
      name: 'Baldev Singh',
      village: 'Khanna, Ludhiana (Punjab)',
      crop: 'Wheat & Basmati',
      quote:
        '“The IoT soil moisture alert prevented me from irrigating right before a heavy rainstorm. My borewell diesel expenses dropped by 28% this season.”',
      stat: '28% Water Saved'
    },
    {
      name: 'Suresh Reddy',
      village: 'Miryalaguda, Nalgonda (TS)',
      crop: 'Guntur Chillies',
      quote:
        '“Selling my dry chillies through the Agrovision Marketplace gave me ₹220/kg compared to ₹185 offered by local commission agents in the market.”',
      stat: '+19% Income Gain'
    }
  ];

  const faqs = [
    {
      q: 'Can I use Agrovision AI if I cannot read or type English?',
      a: 'Yes, absolutely! The application is fully multilingual and supports Telugu, Hindi, Tamil, Kannada, Marathi, Bengali, and English. You can even tap the microphone button to speak your farming query in your native dialect and listen to voice responses.'
    },
    {
      q: 'How does the Crop Doctor leaf disease detection work?',
      a: 'You simply capture or upload a clear photo of the infected crop leaf. Our advanced Gemini vision AI model scans discoloration, lesions, and spots against thousands of agronomic patterns to identify the pathogen (fungal, bacterial, or viral) and provide safe organic and chemical recommendations.'
    },
    {
      q: 'Do I need expensive hardware for the Soil Moisture module?',
      a: 'Not at all! Agrovision works seamlessly with ultra-affordable ESP32 or Arduino microcontrollers paired with standard ₹150 capacitive soil moisture probes. We also provide interactive simulation modes and copyable Arduino code right inside the app.'
    },
    {
      q: 'Are the government schemes official and up-to-date?',
      a: 'Yes. All scheme information—including PM-KISAN, PMFBY, PMKSY Drip Subsidy, SMAM Mechanization, and KCC—is curated directly from official Government of India ministries with direct links to official .gov.in portals.'
    },
    {
      q: 'How do farmers receive payment in the Marketplace?',
      a: 'Farmers receive direct bank transfers or UPI payments from buyers. You can also accept Cash on Delivery (COD) for local community buyers without any middleman cuts.'
    }
  ];

  return (
    <div className="bg-stone-50 text-stone-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-emerald-100 bg-gradient-to-b from-emerald-50/70 via-stone-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold mb-6">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>Next-Generation Krishi Technology for Bharat</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-950 tracking-tight font-serif leading-[1.15] mb-6">
              Smart Technology for <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy">Smarter Farming</span>.
            </h1>

            <p className="text-lg sm:text-xl text-stone-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              AI, IoT and local-language assistance helping farmers make better decisions, manage crops and reach markets.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="hero-get-started-btn"
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-explore-features-btn"
                onClick={() => {
                  const el = document.getElementById('solutions-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-base border border-stone-300 transition cursor-pointer"
              >
                Explore Features
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-stone-200/80 text-center">
              <div>
                <div className="text-2xl font-extrabold text-emerald-800">92%+</div>
                <div className="text-xs text-stone-600 font-medium">Crop Vision Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-emerald-800">9 Languages</div>
                <div className="text-xs text-stone-600 font-medium">Telugu, Hindi & more</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-emerald-800">₹0 Middlemen</div>
                <div className="text-xs text-stone-600 font-medium">Direct Mandi Market</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-emerald-800">100% Free</div>
                <div className="text-xs text-stone-600 font-medium">For Indian Farmers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connected Farming Ecosystem Ribbon */}
      <section className="bg-emerald-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm tracking-wide uppercase text-emerald-300">The Connected Ecosystem</div>
                <div className="text-xs text-emerald-100 font-mono">
                  Farmer → Farm Profile → Crop → Monitor → Detect → Understand → Recommend → Act → Sell
                </div>
              </div>
            </div>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer"
            >
              Launch Farmer Suite
            </button>
          </div>
        </div>
      </section>

      {/* The Farming Problem vs Our Solution */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Core Challenges</h2>
            <h3 className="text-3xl font-extrabold text-stone-950 font-serif">Bridging the Agricultural Knowledge Gap</h3>
            <p className="text-stone-600 text-sm mt-2">
              Indian farmers face fragmented challenges that compound into crop loss and debt. Agrovision connects every dot into a single digital companion.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* The Problem */}
            <div className="bg-red-50/60 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-red-700 font-bold text-base mb-4">
                <span className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center text-xs">✕</span>
                The Traditional Struggles
              </div>
              <ul className="space-y-3 text-xs text-stone-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Late Disease Detection:</strong> Fungal blasts identified after 30% yield loss has already occurred.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Language Barriers:</strong> Crucial agronomy bulletins available only in English or Hindi, excluding southern & regional dialects.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Blind Irrigation:</strong> Guesswork leading to over-watering, diesel pump waste, and root rot.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Middleman Exploitation:</strong> Commission agents taking 15-30% cut while dictating below-cost farmgate rates.</span>
                </li>
              </ul>
            </div>

            {/* Our Solution */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base mb-4">
                <span className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-xs text-emerald-800">✓</span>
                The Agrovision AI Solution
              </div>
              <ul className="space-y-3 text-xs text-stone-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Vision Crop Doctor:</strong> 5-second leaf diagnosis with organic recipes and CIBRC chemical dosages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Native Voice Assistant:</strong> Conversational guidance in Telugu, Hindi, Tamil, and English with voice output.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>ESP32 Soil Telemetry:</strong> Precision moisture monitoring with weather-synchronized watering alerts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Direct Farm Marketplace:</strong> Farmers set their own price benchmarked against live APMC Mandi rates.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Six Major Solutions */}
      <section id="solutions-section" className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Platform Features</h2>
            <h3 className="text-3xl font-extrabold text-stone-950 font-serif">Six Pillars of Farmer Empowerment</h3>
            <p className="text-stone-600 text-sm mt-2">
              Every tool is engineered for simplicity, high accessibility, and direct agricultural impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((sol) => {
              const Icon = sol.icon;
              return (
                <div
                  key={sol.id}
                  className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 bg-stone-100 text-stone-700 rounded-full border border-stone-200">
                        {sol.badge}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-stone-900 mb-2">{sol.title}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed mb-6">{sol.desc}</p>
                  </div>

                  <button
                    onClick={() => onExploreFeature(sol.id)}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Launch Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Seamless Workflow</h2>
            <h3 className="text-3xl font-extrabold text-stone-950 font-serif">How Agrovision Works in 4 Steps</h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step) => (
              <div key={step.num} className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 relative">
                <div className="text-3xl font-extrabold text-emerald-700/30 mb-2 font-mono">{step.num}</div>
                <h4 className="text-base font-bold text-stone-900 mb-2">{step.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Farmer Success Stories */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Farmer Voices</h2>
            <h3 className="text-3xl font-extrabold text-stone-950 font-serif">Real Impact in Indian Fields</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {t.stat}
                    </span>
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      {t.village}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 italic leading-relaxed mb-4">{t.quote}</p>
                </div>
                <div className="pt-4 border-t border-stone-100">
                  <div className="font-bold text-sm text-stone-900">{t.name}</div>
                  <div className="text-[11px] text-stone-500">Crops: {t.crop}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Architecture Section */}
      <section className="py-16 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4" />
              <span>Full-Stack Architecture</span>
            </div>
            <h3 className="text-3xl font-extrabold font-serif">Powered by AI & Edge IoT</h3>
            <p className="text-stone-400 text-xs mt-2">
              Built for production resilience, low latency, and modular sensor integration.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-5">
              <div className="w-10 h-10 rounded-lg bg-emerald-900/60 text-emerald-400 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Gemini 3.8 Flash Vision</h4>
              <p className="text-xs text-stone-400">Server-side multi-part image analysis for crop disease classification.</p>
            </div>

            <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-5">
              <div className="w-10 h-10 rounded-lg bg-blue-900/60 text-blue-400 flex items-center justify-center mb-3">
                <Wifi className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">ESP32 REST Telemetry</h4>
              <p className="text-xs text-stone-400">HTTP/JSON soil moisture and ambient temperature reporting pipeline.</p>
            </div>

            <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-5">
              <div className="w-10 h-10 rounded-lg bg-cyan-900/60 text-cyan-400 flex items-center justify-center mb-3">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Speech Recognition</h4>
              <p className="text-xs text-stone-400">Web Speech API speech-to-text and voice synthesis in regional Indian languages.</p>
            </div>

            <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-5">
              <div className="w-10 h-10 rounded-lg bg-amber-900/60 text-amber-400 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">APMC Mandi Intelligence</h4>
              <p className="text-xs text-stone-400">Integrated market benchmark pricing across major Indian commodities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Answers for Farmers</h2>
            <h3 className="text-3xl font-extrabold text-stone-950 font-serif">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-3">
            {faqs.map((item, idx) => (
              <div key={idx} className="border border-stone-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full text-left px-5 py-4 bg-stone-50 hover:bg-stone-100 flex items-center justify-between text-stone-900 font-bold text-sm transition cursor-pointer"
                >
                  <span>{item.q}</span>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                {openFaqIndex === idx && (
                  <div className="px-5 py-4 text-xs text-stone-600 bg-white leading-relaxed border-t border-stone-100">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Kisan Helpline */}
      <section className="py-12 bg-emerald-50 border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-extrabold text-stone-900">National Kisan Call Center Support</h4>
          <p className="text-xs text-stone-600 max-w-md mx-auto mt-1 mb-4">
            Free telephonic agricultural advisory available in 22 languages from 6:00 AM to 10:00 PM daily.
          </p>
          <a
            href="tel:18001801551"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-700 text-white font-bold text-sm shadow-sm hover:bg-emerald-800 transition"
          >
            <span>Call Toll-Free: 1800-180-1551</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-serif font-bold text-sm">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>Agrovision AI</span>
            <span className="text-stone-500 font-sans font-normal text-xs">— Empowering Indian Agriculture</span>
          </div>
          <p className="text-stone-500 text-center sm:text-right text-[11px]">
            Designed for Indian Farmers with AI, Vision & IoT. Compliant with ICAR guidelines.
          </p>
        </div>
      </footer>
    </div>
  );
};
