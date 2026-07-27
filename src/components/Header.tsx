import React, { useState, useEffect } from 'react';
import { Menu, X, Lock, Settings, LogOut, FileText } from 'lucide-react';
import { DesignSettings } from '../types';
import { trackClick } from '../lib/db-service';
import { LohasLogo } from './LohasLogo';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  adminUser: any | null;
  onLogin: () => void;
  onLogout: () => void;
  designSettings: DesignSettings;
}

export default function Header({
  currentView,
  setCurrentView,
  adminUser,
  onLogin,
  onLogout,
  designSettings
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: string) => {
    setIsOpen(false);
    if (view === 'form') {
      trackClick('formClicks');
      window.open('https://naver.me/FLE1OA3O', '_blank', 'noopener,noreferrer');
    } else {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: '홈', view: 'home' },
    { label: '회사소개', view: 'about' },
    { label: '양성화 안내', view: 'guide' },
    { label: '공지사항', view: 'notices' },
  ];

  return (
    <header 
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0B0B0B]/90 backdrop-blur-xl shadow-2xl py-2.5 text-white border-b border-white/10' 
          : 'bg-[#0B0B0B]/75 backdrop-blur-md py-3.5 text-white border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            id="header-logo"
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <LohasLogo size={38} className="shrink-0 group-hover:scale-105 transition-transform" />
            <div>
              <span className="font-black text-lg sm:text-xl tracking-tight block text-white group-hover:text-[#F97316] transition-colors">
                로하스건축사사무소
              </span>
              <span className="text-[10px] sm:text-xs block tracking-wider text-slate-400 -mt-1 font-medium font-sans">
                위반건축물 양성화 전문
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navItems.map((item) => (
              <button
                key={item.view}
                id={`nav-${item.view}`}
                onClick={() => handleNavClick(item.view)}
                className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all relative cursor-pointer ${
                  currentView === item.view 
                    ? 'text-white bg-white/10 font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
                {currentView === item.view && (
                  <span 
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]" 
                  />
                )}
              </button>
            ))}

            {/* Form CTA Link - Rounded glowing button */}
            <button
              id="nav-cta"
              onClick={() => handleNavClick('form')}
              className="ml-3 px-5 py-2.5 bg-[#FFD700] hover:bg-[#FFE033] text-black font-black text-xs sm:text-sm rounded-full transition-all duration-300 flex items-center space-x-2 shadow-[0_0_20px_rgba(255,215,0,0.45)] hover:shadow-[0_0_30px_rgba(255,224,51,0.7)] hover:scale-[1.03] cursor-pointer"
            >
              <FileText size={15} />
              <span>양성화 검토 신청 (무료)</span>
            </button>

            {/* Admin trigger */}
            <div className="h-4 w-px bg-white/10 mx-2" />

            {adminUser ? (
              <button
                id="btn-admin-dashboard"
                onClick={() => handleNavClick('admin')}
                className="px-4 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 border border-[#FFD700]/40 hover:border-[#FFD700] bg-amber-950/30 text-amber-200 transition-all cursor-pointer"
              >
                <Settings size={14} className="animate-spin-slow text-[#FFD700]" />
                <span>관리 대시보드</span>
              </button>
            ) : (
              <button
                id="btn-admin-login"
                onClick={onLogin}
                className="px-4 py-1.5 rounded-full text-xs font-semibold border border-white/15 hover:border-[#FFD700]/50 hover:bg-white/5 text-slate-300 hover:text-white transition-all flex items-center space-x-1 cursor-pointer"
              >
                <Lock size={13} />
                <span>관리자 로그인</span>
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              id="mobile-nav-cta"
              onClick={() => handleNavClick('form')}
              className="px-3.5 py-1.5 bg-[#FFD700] hover:bg-[#FFE033] rounded-full text-[11px] font-black text-black flex items-center space-x-1 shadow-[0_0_12px_rgba(255,215,0,0.5)] cursor-pointer"
            >
              <FileText size={11} />
              <span>검토신청 (무료)</span>
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-colors text-slate-200 hover:text-white hover:bg-white/10"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden bg-[#0B0B0B]/95 backdrop-blur-2xl border-t border-white/10 shadow-2xl animate-fade-in text-white"
        >
          <div className="px-3 pt-3 pb-5 space-y-1 sm:px-4">
            {navItems.map((item) => (
              <button
                key={item.view}
                id={`mobile-nav-${item.view}`}
                onClick={() => handleNavClick(item.view)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  currentView === item.view 
                    ? 'bg-amber-900/40 text-amber-300 font-bold border border-amber-500/30' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              id="mobile-nav-form-main"
              onClick={() => handleNavClick('form')}
              className="block w-full text-left px-4 py-3 rounded-xl text-base font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/50 my-2"
            >
              양성화 검토 신청서 (무료 네이버폼)
            </button>

            <div className="h-px bg-white/10 my-2 mx-4" />

            {adminUser ? (
              <>
                <button
                  id="mobile-nav-admin-dash"
                  onClick={() => handleNavClick('admin')}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center space-x-2 ${
                    currentView === 'admin' ? 'bg-amber-950/50 text-amber-300' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Settings size={18} />
                  <span>관리 대시보드 ({adminUser.email})</span>
                </button>
                <button
                  id="mobile-nav-logout"
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-rose-400 hover:bg-rose-950/30 flex items-center space-x-2"
                >
                  <LogOut size={18} />
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
              <button
                id="mobile-nav-login"
                onClick={() => { setIsOpen(false); onLogin(); }}
                className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-white/5 flex items-center space-x-2"
              >
                <Lock size={18} />
                <span>관리자 로그인</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
