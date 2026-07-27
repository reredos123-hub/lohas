import React from 'react';
import { MapPin, Navigation, ExternalLink, Compass } from 'lucide-react';

interface MapSectionProps {
  address: string;
}

export default function MapSection({ address }: MapSectionProps) {
  // URL encode the address for Google Maps iframe
  const encodedAddress = encodeURIComponent(address);
  // Embed link
  const embedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  // Search links for popular Korean map services (essential for domestic navigation)
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent('서울 성동구 살곶이길 150')}`;
  const kakaoMapUrl = `https://map.kakao.com/?q=${encodeURIComponent('서울 성동구 살곶이길 150')}`;

  return (
    <div id="map-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Map iframe container (Left 7-8 columns) */}
      <div className="lg:col-span-8 rounded-2xl overflow-hidden shadow-inner border border-white/15 h-[350px] sm:h-[450px] relative bg-neutral-900">
        <iframe
          title="로하스건축사사무소 구글 지도"
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full grayscale-[80%] invert-[90%] hue-rotate-[180deg] opacity-90 contrast-[1.1]"
        />
      </div>

      {/* Info & Transit Buttons (Right 4 columns) */}
      <div className="lg:col-span-4 flex flex-col justify-between glass-card rounded-2xl p-6 border border-white/10 text-white">
        <div>
          <div className="flex items-center space-x-2 text-[#FFD700] mb-4 font-bold text-sm">
            <Compass size={16} className="animate-pulse" />
            <span>상세 길찾기 안내</span>
          </div>

          <h3 className="text-lg font-black text-white mb-2">{address}</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
            회사는 2호선 용답역 및 5호선 마장역 인근에 위치하고 있어 대중교통 이용이 편리합니다. 방문하시기 전 사전에 전화를 주시면 원활한 맞춤 상담이 가능합니다.
          </p>

          <div className="space-y-3">
            <div className="flex items-start space-x-2 text-xs text-slate-300">
              <span className="font-bold text-[#FFD700] shrink-0">지하철:</span>
              <span>2호선 용답역 입출구 도보 5분 내외, 5호선 마장역 3번출구 도보 10분 내외</span>
            </div>
            <div className="flex items-start space-x-2 text-xs text-slate-300">
              <span className="font-bold text-[#FFD700] shrink-0">주차:</span>
              <span>주차 가능(주차공간이 협소하여 대중교통을 권장하며 차량 방문시에는 02-499-0229 사전연락 요망)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-8">
          {/* Naver Maps */}
          <a
            href={naverMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-1.5 py-3 px-2 rounded-full bg-[#03C75A] hover:bg-[#02b350] text-white text-xs font-bold transition-all shadow-md hover:scale-[1.02] text-center cursor-pointer"
          >
            <Navigation size={13} />
            <span>네이버 지도</span>
            <ExternalLink size={11} />
          </a>

          {/* Kakao Maps */}
          <a
            href={kakaoMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-1.5 py-3 px-2 rounded-full bg-[#FFCD00] hover:bg-[#e6b800] text-slate-950 text-xs font-bold transition-all shadow-md hover:scale-[1.02] text-center cursor-pointer"
          >
            <Navigation size={13} />
            <span>카카오 맵</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}
