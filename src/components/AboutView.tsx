import React from 'react';
import { Award, CheckCircle, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { PageContent, DesignSettings } from '../types';
import MapSection from './MapSection';

interface AboutViewProps {
  pageContent: PageContent;
  designSettings: DesignSettings;
}

export default function AboutView({ pageContent, designSettings }: AboutViewProps) {
  const content = pageContent?.content || {};

  return (
    <div id="about-view" className="bg-[#0B0B0B] text-white min-h-screen pt-28 pb-20 animate-fade-in">
      {/* Page Header Banner */}
      <div 
        className="text-white py-16 px-4 bg-cover bg-center relative border-b border-white/10"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(11, 11, 11, 0.95), rgba(11, 11, 11, 0.8)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 text-white">
            {pageContent?.title || '로하스건축사사무소 소개'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-normal">
            {pageContent?.subtitle || '건축주의 소중한 자산과 권리를 법의 테두리 안에서 완벽하게 보호합니다.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Greeting Area (Left 8 columns) */}
          <div className="lg:col-span-8 glass-card rounded-2xl p-6 sm:p-10 border border-[#FFD700]/20">
            <h2 className="text-xl font-extrabold mb-6 text-white border-b border-white/10 pb-4 flex items-center space-x-2.5">
              <span className="w-1.5 h-5 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]" />
              <span>대표 인사말</span>
            </h2>

            <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line font-normal">
              {content.greeting || '안녕하십니까. 로하스건축사사무소 대표 김용호입니다.'}
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#FFD700] font-mono tracking-wider uppercase font-semibold">Lohas Architecture Office</p>
                <p className="text-lg font-bold text-white mt-1">대표 : <span className="text-xl font-black text-[#FFD700]">건축사 {content.ceoName?.replace(' 건축사', '') || '김용호'}</span></p>
              </div>
            </div>
          </div>

          {/* CEO Profile and Contact info (Right 4 columns) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Profile Card */}
            <div className="glass-card bg-amber-950/30 text-white rounded-2xl p-6 sm:p-8 border border-[#FFD700]/30 relative overflow-hidden shadow-[0_0_25px_rgba(255,215,0,0.2)]">
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative">
                <span className="text-xs font-bold text-[#FFD700] tracking-widest uppercase block mb-1 font-mono">Architect Profile</span>
                <h3 className="text-2xl font-black mb-6 flex items-baseline space-x-2 text-white">
                  <span>{content.ceoName || '김용호'}</span>
                  <span className="text-xs text-slate-300 font-normal">대표 건축사</span>
                </h3>

                <h4 className="text-sm font-bold text-[#FFD700] mb-3 flex items-center space-x-2">
                  <Award size={15} className="text-[#FFD700]" />
                  <span>약력 및 주요 경력</span>
                </h4>
                
                <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                  {(content.careers || []).map((career: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle size={15} className="text-[#FFD700] shrink-0 mt-0.5" />
                      <span>{career}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
              <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <span>사무소 기본정보</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start space-x-3">
                  <MapPin size={16} className="text-[#FFD700] mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">소재지</p>
                    <p className="mt-0.5 text-slate-300 leading-snug">{content.address || '서울시 성동구 살곶이길 150, 101동 201호'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone size={16} className="text-[#FFD700] mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">대표전화</p>
                    <p className="mt-0.5 text-[#FFD700] font-extrabold text-base">{content.phone || '02-499-0229'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail size={16} className="text-[#FFD700] mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">이메일</p>
                    <a href={`mailto:${content.email || 'reredos123@gmail.com'}`} className="mt-0.5 text-[#FFD700] hover:underline block break-all font-mono font-medium">
                      {content.email || 'reredos123@gmail.com'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Blog button */}
              <a 
                href="https://blog.naver.com/reredos123"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full text-center bg-[#03C75A] hover:bg-[#02b350] text-white font-extrabold text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg hover:scale-[1.02]"
              >
                <span className="font-black text-base">N</span>
                <span>공식 네이버 블로그 방문하기</span>
                <ExternalLink size={14} />
              </a>
            </div>

          </div>

        </div>

        {/* Map Section */}
        <div className="mt-16 glass-card rounded-2xl border border-[#FFD700]/20 p-6 sm:p-10">
          <h2 className="text-xl font-extrabold mb-6 text-white border-b border-white/10 pb-4 flex items-center space-x-2.5">
            <span className="w-1.5 h-5 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]" />
            <span>오시는 길 (위치 안내)</span>
          </h2>
          <MapSection address={content.address || '서울시 성동구 살곶이길 150, 101동 201호'} />
        </div>

      </div>
    </div>
  );
}
