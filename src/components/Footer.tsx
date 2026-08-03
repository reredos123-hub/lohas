import React from 'react';
import { ExternalLink, ShieldAlert, Phone, Mail, MapPin } from 'lucide-react';
import { DesignSettings } from '../types';
import { trackClick } from '../lib/db-service';
import { LohasLogo } from './LohasLogo';

interface FooterProps {
  designSettings: DesignSettings;
}

export default function Footer({ designSettings }: FooterProps) {
  
  const handleBlogClick = () => {
    trackClick('blogClicks');
    window.open('https://blog.naver.com/reredos123/224362919365', '_blank', 'noopener,noreferrer');
  };

  return (
    <footer id="main-footer" className="bg-[#0B0B0B] text-slate-300 border-t border-white/10 relative">
      
      {/* Top Banner Accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#FFD700] via-[#FFE033] to-[#FFD700] shadow-[0_0_12px_#FFD700]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Column 1: Brand Info (Left 5 columns) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2">
              <LohasLogo size={32} className="shrink-0" />
              <span className="font-black text-white text-lg sm:text-xl tracking-tight">
                로하스건축사사무소
              </span>
            </div>

            <p className="text-[13px] sm:text-[14.5px] text-slate-300 leading-relaxed font-sans font-normal">
              정확한 법률 검토를 바탕으로 설계도서 작성하고 신속한 인허가 <br />
              진행을 약속드립니다.<br />
              보다 자세한 위반건축물 양성화 내용이 궁금하신가요?<br />
              로하스건축 공식 블로그에서 확인해 주세요.
            </p>

            {/* Official Naver Blog Button */}
            <div className="pt-2">
              <button
                id="footer-btn-blog"
                onClick={handleBlogClick}
                className="inline-flex items-center space-x-2 py-2.5 px-5 bg-[#03C75A] hover:bg-[#02b350] text-white font-extrabold text-xs sm:text-sm rounded-full transition-all shadow-[0_0_15px_rgba(3,199,90,0.3)] hover:scale-105 cursor-pointer"
              >
                <span className="font-black text-base">N</span>
                <span>양성화 상세정보</span>
                <ExternalLink size={13} />
              </button>
            </div>
          </div>

          {/* Column 2: Legal Warning & Terms (Middle 3 columns) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider flex items-center space-x-1.5">
              <ShieldAlert size={15} className="text-[#FFD700]" />
              <span>법률 검토 유의사항</span>
            </h4>
            <p className="text-[13px] sm:text-[14.5px] text-slate-400 leading-relaxed font-sans font-normal">
              위반건축물 양성화는 한시적으로 시행되는 <br />
              &lt;특정건축물 정리에 관한 특별법&gt;에 의거해 엄격히 결정됩니다. <br />
              사전 법률 검토가 필수적이니 로하스건축사 <br />
              사무소의 법률 진단을 거치시기 바랍니다.
            </p>
          </div>

          {/* Column 3: Contacts Info (Right 4 columns) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider">
              사무소 정보 및 연락처
            </h4>
            
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300 font-sans font-normal">
              <li className="flex items-start space-x-2.5">
                <MapPin size={15} className="text-[#FFD700] shrink-0 mt-0.5" />
                <span>주소: 서울시 성동구 살곶이길 150, 101동 201호</span>
              </li>
              
              <li className="flex items-center space-x-2.5">
                <Phone size={15} className="text-[#FFD700] shrink-0" />
                <span>대표전화: <span className="font-extrabold text-[#FFD700] text-sm">02-499-0229</span></span>
              </li>

              <li className="flex items-center space-x-2.5">
                <Mail size={15} className="text-[#FFD700] shrink-0" />
                <span>이메일: <a href="mailto:reredos123@gmail.com" className="text-[#FFD700] hover:underline">reredos123@gmail.com</a></span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-4 sm:space-y-0 font-sans">
          <div>
            <p>로하스건축사사무소 | 대표: 김용호 건축사 | 사업자등록번호 : 206-32-02344</p>
            <p className="mt-1">Copyright © 2026 Lohas Architecture Office. All Rights Reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="https://naver.me/FLE1OA3O" target="_blank" rel="noreferrer" className="hover:text-slate-200">개인정보 처리방침</a>
            <span>|</span>
            <a href="https://blog.naver.com/reredos123/224362919365" target="_blank" rel="noreferrer" className="hover:text-slate-200">네이버 블로그</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
