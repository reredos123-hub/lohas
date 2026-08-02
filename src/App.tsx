import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ClipboardCheck, 
  Eye, 
  FileText, 
  MessageSquare, 
  Award, 
  Zap, 
  Scale, 
  UserCheck, 
  ChevronRight, 
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  BookOpen,
  Calendar,
  Lock,
  ChevronDown
} from 'lucide-react';

import Header from './components/Header';
import Hero from './components/Hero';
import AboutView from './components/AboutView';
import GuideView from './components/GuideView';
import NoticeView from './components/NoticeView';
import MapSection from './components/MapSection';
import Footer from './components/Footer';
import AdminCMS from './components/AdminCMS';

import { auth, googleProvider, signInWithPopup, signOut } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  seedDatabaseIfNeeded, 
  trackPageView, 
  trackClick,
  fetchDesignSettings, 
  fetchSEOSettings, 
  fetchNotices, 
  fetchPageContent,
  deleteNotice,
  DEFAULT_DESIGN,
  DEFAULT_SEO,
  DEFAULT_HOME,
  DEFAULT_ABOUT,
  DEFAULT_GUIDE,
  DEFAULT_NOTICES
} from './lib/db-service';
import { DesignSettings, SEOSettings, Notice, PageContent } from './types';

export default function App() {
  const [view, setView] = useState<'home' | 'about' | 'guide' | 'notices' | 'admin'>('home');
  const [loading, setLoading] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);

  // Login Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Core CMS state loaded from cache or default, updated dynamically from Firestore
  const [designSettings, setDesignSettings] = useState<DesignSettings>(() => {
    try {
      const cached = localStorage.getItem('lohas_cache_design');
      return cached ? JSON.parse(cached) : DEFAULT_DESIGN;
    } catch {
      return DEFAULT_DESIGN;
    }
  });

  const [seoSettings, setSeoSettings] = useState<SEOSettings>(() => {
    try {
      const cached = localStorage.getItem('lohas_cache_seo');
      return cached ? JSON.parse(cached) : DEFAULT_SEO;
    } catch {
      return DEFAULT_SEO;
    }
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    try {
      const cached = localStorage.getItem('lohas_cache_notices');
      return cached ? JSON.parse(cached) : DEFAULT_NOTICES;
    } catch {
      return DEFAULT_NOTICES;
    }
  });

  const [homeContent, setHomeContent] = useState<PageContent>(() => {
    try {
      const cached = localStorage.getItem('lohas_cache_home');
      return cached ? JSON.parse(cached) : DEFAULT_HOME;
    } catch {
      return DEFAULT_HOME;
    }
  });

  const [aboutContent, setAboutContent] = useState<PageContent>(() => {
    try {
      const cached = localStorage.getItem('lohas_cache_about');
      return cached ? JSON.parse(cached) : DEFAULT_ABOUT;
    } catch {
      return DEFAULT_ABOUT;
    }
  });

  const [guideContent, setGuideContent] = useState<PageContent>(() => {
    try {
      const cached = localStorage.getItem('lohas_cache_guide');
      return cached ? JSON.parse(cached) : DEFAULT_GUIDE;
    } catch {
      return DEFAULT_GUIDE;
    }
  });

  // Initialize and load site data in non-blocking background tasks
  const initApp = () => {
    // 1. Non-blocking seeding & page view tracking
    seedDatabaseIfNeeded().catch(err => console.warn('Background seed check:', err));
    trackPageView().catch(err => console.warn('Background page view tracking:', err));

    // 2. Load fresh CMS settings in parallel
    Promise.all([
      fetchDesignSettings(),
      fetchSEOSettings(),
      fetchNotices(),
      fetchPageContent('home'),
      fetchPageContent('about'),
      fetchPageContent('guide')
    ]).then(([design, seo, list, home, about, guide]) => {
      if (design) {
        setDesignSettings(design);
        try { localStorage.setItem('lohas_cache_design', JSON.stringify(design)); } catch {}
      }
      if (seo) {
        setSeoSettings(seo);
        try { localStorage.setItem('lohas_cache_seo', JSON.stringify(seo)); } catch {}
        document.title = seo.title;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', seo.description);
      }
      if (list && list.length > 0) {
        setNotices(list);
        try { localStorage.setItem('lohas_cache_notices', JSON.stringify(list)); } catch {}
      }
      if (home) {
        setHomeContent(home);
        try { localStorage.setItem('lohas_cache_home', JSON.stringify(home)); } catch {}
      }
      if (about) {
        setAboutContent(about);
        try { localStorage.setItem('lohas_cache_about', JSON.stringify(about)); } catch {}
      }
      if (guide) {
        setGuideContent(guide);
        try { localStorage.setItem('lohas_cache_guide', JSON.stringify(guide)); } catch {}
      }
    }).catch(error => {
      console.warn('Non-blocking fetch notice:', error);
    });
  };

  useEffect(() => {
    initApp();

    // Check if password login session exists in localStorage
    const savedAdmin = localStorage.getItem('lohas_admin_session');
    if (savedAdmin === 'true') {
      setAdminUser({
        email: 'reredos123@gmail.com',
        displayName: '관리자'
      } as any);
    }

    // Setup Firebase Auth observer
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === 'reredos123@gmail.com') {
          setAdminUser(user);
          localStorage.setItem('lohas_admin_session', 'true');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Open Login Modal
  const handleLogin = () => {
    setLoginError('');
    setAdminPassword('');
    setShowLoginModal(true);
  };

  // Handle Password Authentication (master8879)
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    if (adminPassword === 'master8879') {
      const mockAdminUser = {
        email: 'reredos123@gmail.com',
        displayName: '관리자'
      } as any;
      setAdminUser(mockAdminUser);
      localStorage.setItem('lohas_admin_session', 'true');
      setShowLoginModal(false);
      setAdminPassword('');
      setView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setLoginError('비밀번호가 올바르지 않습니다. 다시 확인해주세요.');
    }
    setLoginLoading(false);
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      localStorage.removeItem('lohas_admin_session');
      await signOut(auth).catch(() => {});
      setAdminUser(null);
      setView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Scroll to contacts
  const scrollToContacts = () => {
    trackClick('consultClicks');
    const contactsSection = document.getElementById('contacts-section');
    if (contactsSection) {
      contactsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Loader view
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center font-black text-amber-500 text-lg">
            로
          </div>
        </div>
        <h2 className="text-xl font-bold tracking-wider animate-pulse">로하스건축사사무소</h2>
        <p className="text-xs text-slate-400 mt-2">안전하고 신속한 위반건축물 양성화 솔루션</p>
      </div>
    );
  }

  // Get active menu settings
  const design = designSettings!;
  const homeIntro = homeContent?.content || {};

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Dynamic structured JSON-LD data for architectural SEO grounding */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ArchitecturalOffice",
          "name": "로하스건축사사무소",
          "alternateName": "Lohas Architecture",
          "description": seoSettings?.description || "위반건축물 양성화 전문 건축사사무소",
          "url": window.location.href,
          "logo": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "살곶이길 150, 101동 201호",
            "addressLocality": "성동구",
            "addressRegion": "서울특별시",
            "postalCode": "04763",
            "addressCountry": "KR"
          },
          "telephone": "02-499-0229",
          "email": "reredos123@gmail.com",
          "founder": {
            "@type": "Person",
            "name": "김용호"
          }
        })}
      </script>

      {/* Header Navigation */}
      <Header 
        currentView={view} 
        setCurrentView={setView} 
        adminUser={adminUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        designSettings={design}
      />

      {/* VIEW DETERMINATOR */}
      {view === 'home' && (
        <div className="animate-fade-in">
          {/* Hero Banner */}
          <Hero designSettings={design} onContactClick={scrollToContacts} />

          {/* SECTION 1: CORE BUSINESS FIELDS (전문분야 소개) */}
          <section id="services-section" className="py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2 font-mono">Lohas Business Scope</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                  위반건축물 양성화 업무영역
                </h2>
                <div className="h-1 w-12 bg-amber-500 mx-auto rounded-full mb-6" />
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-light">
                  {homeIntro.introTitle || '대표 건축사의 정밀 법률 분석을 기반으로 최적화된 양성화 루트를 도출합니다.'}
                </p>
              </div>

              {/* Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {/* Card 1: 위반건축물 양성화 */}
                <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                    <Building2 size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">위반건축물 양성화</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4">
                    불법 증축, 근린생활시설 무단 용도변경(주택), 무단 호수 분할등 위반행위를 합법적으로 위반을 해제하여 양성화해 드립니다.
                  </p>
                </div>

                {/* Card 2: 양성화 신고대행 */}
                <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                    <ClipboardCheck size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">양성화 신고대행</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4">
                    복잡한 위반건축물 양성화 신고의 법규검토부터 제출서류/설계도서 작성과 모든 행정과정을 원스톱으로 대행해 드립니다.
                  </p>
                </div>

                {/* Card 3: 건축물 현황조사 */}
                <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                    <Eye size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">건축물 현황조사</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4">
                    도면이 없거나 대장 정보와 상이한 건축물을 설계 실측 기사가 직접 파견 실측하여 현황도 및 관련 조사서를 완비합니다.
                  </p>
                </div>

                {/* Card 4: 양성화 컨설팅 */}
                <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-[#FFD700]/15 text-[#D4AF37] flex items-center justify-center mb-6 group-hover:bg-[#FFD700] group-hover:text-black transition-colors duration-300">
                    <FileText size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">양성화 컨설팅</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4">
                    위반건축물이 양성화 기준을 충족하지 못할 경우 종합적인 검토로 해결방안에 대한 자문 및 전문 기술 상담을 제공합니다.
                  </p>
                </div>

                {/* Card 5: 법률상담 */}
                <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-[#FFD700]/15 text-[#D4AF37] flex items-center justify-center mb-6 group-hover:bg-[#FFD700] group-hover:text-black transition-colors duration-300">
                    <MessageSquare size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">법률상담</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4">
                    특정건축물 양성화에 관한 특별조치법 및 관련법령에 대하여 궁금하신가요? 언제라도 문의 주시면 상세히 답변드리겠습니다.
                  </p>
                </div>

                {/* Grid placeholder / Custom decorative */}
                <div 
                  className="rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col justify-between hover:border-[#FFD700] transition-colors"
                >
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base sm:text-lg mb-2">간편 무료 검토 서비스</h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                      주소지 정보만으로 김용호 대표 건축사가 직접 법리적 가능성 및 조례 충족율을 미리 검토해 드리는 비대면 무료 진단 서비스입니다.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      trackClick('formClicks');
                      window.open('https://naver.me/FLE1OA3O', '_blank', 'noopener,noreferrer');
                    }}
                    className="mt-6 inline-flex items-center space-x-1.5 font-bold text-xs sm:text-sm text-[#D4AF37] hover:text-[#B8860B] hover:underline cursor-pointer text-left"
                  >
                    <span>지금 주소 입력하러 가기</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

              </div>

            </div>
          </section>

          {/* SECTION 2: WHY CHOOSE LOHAS (왜 로하스인가) */}
          <section id="why-section" className="py-20 px-4 bg-slate-50 border-t border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left side text and credentials (Column 5) */}
                <div className="lg:col-span-5 space-y-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block font-mono">Expertise Advantage</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    왜 로하스건축사사무소<br />이어야만 하는가?
                  </h2>
                  <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-light">
                    위반건축물 양성화는 일반 건축 설계와는 달리 특별법과 매뉴얼이 적용되며, 까다로운 건축심의를 거치게 되므로 정확한 현황파악과 법규검토만이 성공을 보장합니다.
                  </p>

                  <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex items-start space-x-3.5">
                    <UserCheck className="text-[#FFD700] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">김용호 대표 건축사의 책임 원칙</p>
                      <p className="text-xs text-slate-400 mt-1">로하스는 상담부터 서류 접수, 완료 피드백까지 사무장이 아닌 대표 건축사가 직접 책임 조율합니다.</p>
                    </div>
                  </div>
                </div>

                {/* Right side advantage grids (Column 7) */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Item 1 */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <Award className="text-[#FFD700] mb-3" size={24} />
                    <h4 className="font-bold text-slate-900 text-base mb-1.5">풍부한 현장 실무 경험</h4>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">단독ㆍ다가구, 다세대, 근린생활시설 등 다양한 건축물의 설계와 불법건축물 추인 실적을 보유하고 있습니다.</p>
                  </div>

                  {/* Item 2 */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <Zap className="text-[#FFD700] mb-3" size={24} />
                    <h4 className="font-bold text-slate-900 text-base mb-1.5">신속하고 정확한 행정</h4>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">지자체 보완 지시 발생 시 신속한 대처로 소요 일정을 줄임으로서 불이익 기간을 최소로 단축합니다.</p>
                  </div>

                  {/* Item 3 */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <Scale className="text-[#FFD700] mb-3" size={24} />
                    <h4 className="font-bold text-slate-900 text-base mb-1.5">정밀한 법률 & 조례 분석</h4>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">수시로 개정되는 관련법규 및 지자체별 조례 요건을 실시간 정밀 분석 하여 설계에 반영하고 최적의 대안을 제시해 드립니다.</p>
                  </div>

                  {/* Item 4 */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <UserCheck className="text-[#FFD700] mb-3" size={24} />
                    <h4 className="font-bold text-slate-900 text-base mb-1.5">전문 건축사 1:1 상담</h4>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">비밀 보장이 100% 약속되는 1:1 법률 상담으로 건축주분들의 마음에 한층 신뢰와 편안함을 선사하겠습니다.</p>
                  </div>

                </div>

              </div>

            </div>
          </section>

          {/* SECTION 3: STEP TIMELINE (양성화 절차) */}
          <section className="py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block mb-2 font-mono">Streamlined Workflow</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                  원스톱 양성화 처리 절차
                </h2>
                <div className="h-1 w-12 bg-[#FFD700] mx-auto rounded-full mb-6" />
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-light">
                  상담부터 완료 표기 말소까지 복잡한 프로세스를 체계적으로 이행해 나갑니다.
                </p>
              </div>

              {/* Timeline Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
                
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 hidden lg:block -translate-y-1/2 z-0" />

                {[
                  { title: '1. 사전검토', desc: '지번 정보 기준 건축물 대장 조회 및 법률검토' },
                  { title: '2. 현장 정밀조사', desc: '현장방문조사 및 위반건축물 정밀 실측' },
                  { title: '3. 대상여부 판단', desc: '검토 및 실측자료를 바탕으로 양성화 대상여부 최종 판단' },
                  { title: '4. 신고도서 작성', desc: '양성화 신고에 필요한 서류 및 도면 작성' },
                  { title: '5. 접수 및 건축심의', desc: '양성화 신고접수, 지자체 건축위원회 심의' },
                  { title: '6. 합법화 완료', desc: '위반건축물 지정 말소 및 정식 대장 면적 완벽 등재' }
                ].map((step, idx) => (
                  <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative z-10 text-center flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-full bg-[#FFD700] text-black font-extrabold mx-auto flex items-center justify-center mb-4 text-sm shadow-md">
                        {idx + 1}
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base mb-2">{step.title}</h4>
                      <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}

              </div>

            </div>
          </section>

          {/* SECTION 4: BIG CTA BANNER (무료 양성화 검토) */}
          <section className="relative py-20 px-4 bg-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop')" }} />
            
            <div className="relative max-w-4xl mx-auto text-center z-10 space-y-6">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
                내 건물의 위반건축물 표기,<br />과연 양성화가 가능할지 무료로 사전에 확인해 보세요!
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                대표 건축사가 정밀 분석을 통해 합법화 가능성 조율 요건을 명쾌히 설계해 드립니다. 비밀은 100% 엄격 보장됩니다.
              </p>

              <div className="pt-6">
                <button
                  onClick={() => {
                    trackClick('formClicks');
                    window.open('https://naver.me/FLE1OA3O', '_blank', 'noopener,noreferrer');
                  }}
                  className="px-8 py-4 bg-amber-600 hover:bg-amber-500 hover:scale-105 text-white font-black text-sm sm:text-base rounded-xl transition-all shadow-xl inline-flex items-center space-x-2 cursor-pointer"
                >
                  <FileText size={18} />
                  <span>간편 네이버폼 무료 검토 신청서 제출</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 5: LATEST NOTICES (최신 소식 목록) */}
          <section className="py-20 px-4 bg-slate-50 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex items-end justify-between border-b border-slate-200 pb-6 mb-12">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2 font-mono">Latest Insights</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    공지사항
                  </h2>
                </div>

                <button
                  onClick={() => { setView('notices'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-xs sm:text-sm font-bold text-slate-600 hover:text-amber-600 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>전체 목록보기</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Grid 3 notices */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {notices.slice(0, 3).map(notice => (
                  <article 
                    key={notice.id}
                    onClick={() => { setView('notices'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-slate-400 font-mono mb-3">
                        <span className="font-extrabold text-amber-600 uppercase bg-amber-500/10 px-2 py-0.5 rounded">{notice.category}</span>
                        <span>{notice.createdAt ? new Date(notice.createdAt).toLocaleDateString() : ''}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base sm:text-lg mb-2.5 line-clamp-1">{notice.title}</h4>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">{notice.content}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-600 hover:underline block text-left">자세히 보기 &gt;</span>
                  </article>
                ))}

                {notices.length === 0 && (
                  <p className="col-span-1 md:col-span-3 text-center text-slate-400 text-sm py-10">등록된 소식이 없습니다.</p>
                )}
              </div>

            </div>
          </section>

          {/* SECTION 6: DIRECT CONTACTS & MAP (고객 문의 및 지도) */}
          <section id="contacts-section" className="py-20 px-4 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2 font-mono">Location & Call</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                  실시간 건축 상담 및 대면 예약
                </h2>
                <div className="h-1 w-12 bg-amber-500 mx-auto rounded-full mb-6" />
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-light">
                  지금 대표전화를 누르시면 김용호 대표 건축사와의 직통 1:1 비밀 법률 조율이 가능합니다.
                </p>
              </div>

              {/* Direct call banner & details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
                {/* Dial card */}
                <div className="bg-slate-900 text-white p-8 rounded-2xl flex flex-col justify-between border border-slate-800 shadow-xl relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full" />
                  <div>
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1 font-mono">Hotline Direct</span>
                    <h3 className="text-xl sm:text-2xl font-black mb-4">대표 건축사 직통 번호</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                      이행강제금 부과 고지서를 받았거나, 건축물대장에 노란색 위반 딱지가 등재되었다면 즉시 번호를 터치하십시오. 빠를수록 과태료 손실이 절감됩니다.
                    </p>
                  </div>
                  <a 
                    href="tel:02-499-0229"
                    onClick={() => trackClick('consultClicks')}
                    className="flex items-center justify-center space-x-2.5 py-4 w-full bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-base sm:text-lg rounded-xl shadow-lg transition-transform hover:scale-105 text-center cursor-pointer"
                  >
                    <Phone size={18} />
                    <span>02-499-0229 전화연결</span>
                  </a>
                </div>

                {/* Email and info card */}
                <div className="bg-slate-50 p-8 rounded-2xl flex flex-col justify-between border border-slate-200/60 shadow-inner">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1 font-mono">Online Request</span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">비대면 메일/서면 상담</h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                      도면이나 현장 실측 가시설 전경 사진 등을 이메일로 송부하시고 검토 의견서를 받아 보실 수 있습니다. 언제든 편히 소통하십시오.
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600">
                      <Mail size={15} className="text-slate-400 shrink-0" />
                      <span>이메일: <a href="mailto:reredos123@gmail.com" className="text-amber-600 font-bold hover:underline">reredos123@gmail.com</a></span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600">
                      <MapPin size={15} className="text-slate-400 shrink-0" />
                      <span>소재지: 서울시 성동구 살곶이길 150, 101동 201호</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Embedded Maps */}
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-10 border border-slate-200/60 max-w-5xl mx-auto shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center space-x-2">
                  <span className="w-1 h-5 rounded-full" style={{ backgroundColor: design.accentColor }} />
                  <span>로하스건축사사무소 오시는 길</span>
                </h4>
                <MapSection address="서울시 성동구 살곶이길 150, 101동 201호" />
              </div>

            </div>
          </section>

        </div>
      )}

      {view === 'about' && (
        <AboutView 
          pageContent={aboutContent || { id: 'about', title: '', subtitle: '', content: {}, updatedAt: null }} 
          designSettings={design} 
        />
      )}

      {view === 'guide' && (
        <GuideView 
          pageContent={guideContent || { id: 'guide', title: '', subtitle: '', content: {}, updatedAt: null }} 
          designSettings={design} 
        />
      )}

      {view === 'notices' && (
        <NoticeView 
          notices={notices} 
          designSettings={design} 
          adminUser={adminUser}
          onDeleteNotice={async (id: string) => {
            const isLoggedAdmin = !!adminUser || (typeof window !== 'undefined' && localStorage.getItem('lohas_admin_session') === 'true');
            if (!isLoggedAdmin) {
              alert('관리자로 로그인한 경우에만 공지사항을 삭제할 수 있습니다.');
              return;
            }
            if (window.confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
              try {
                setNotices(prev => prev.filter(n => n.id !== id));
                await deleteNotice(id);
                const updatedList = await fetchNotices();
                setNotices(updatedList);
                alert('공지사항이 성공적으로 삭제되었습니다.');
              } catch (err: any) {
                alert('삭제 중 오류가 발생했습니다: ' + (err?.message || err));
                const updatedList = await fetchNotices();
                setNotices(updatedList);
              }
            }
          }}
          onGoToAdmin={() => setView('admin')}
        />
      )}

      {view === 'admin' && adminUser && (
        <AdminCMS 
          adminEmail={adminUser.email || ''} 
          onLogout={handleLogout} 
          onRefreshData={initApp}
        />
      )}

      {/* Footer Branding Area */}
      <Footer designSettings={design} />

      {/* Admin Login Modal (Password Authentication) */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col">
            <button 
              onClick={() => {
                setShowLoginModal(false);
                setAdminPassword('');
                setLoginError('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-3">
                <Lock size={20} />
              </div>
              <h3 className="text-xl font-black text-white">관리자 로그인</h3>
              <p className="text-xs text-slate-400 mt-1">로하스건축사사무소 관리자 전용 비밀번호 인증</p>
            </div>

            {loginError && (
              <div className="mb-4 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs p-3.5 rounded-xl leading-relaxed font-semibold text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  관리자 비밀번호
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                {loginLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock size={16} />
                    <span>관리자 로그인</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
