import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, X, Image as ImageIcon, BookOpen, Trash2, Settings } from 'lucide-react';
import { Notice, DesignSettings } from '../types';

interface NoticeViewProps {
  notices: Notice[];
  designSettings: DesignSettings;
  adminUser?: any;
  onDeleteNotice?: (id: string) => Promise<void>;
  onGoToAdmin?: () => void;
}

export default function NoticeView({ notices, designSettings, adminUser, onDeleteNotice, onGoToAdmin }: NoticeViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const isAdmin = !!adminUser || (typeof window !== 'undefined' && localStorage.getItem('lohas_admin_session') === 'true');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter & Search notices (only show published ones for public view!), pinned first
  const filteredNotices = notices.filter(notice => {
    if (!notice.published) return false;
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => {
    if (!!a.isPinned !== !!b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Reset page on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNotices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div id="notice-view" className="bg-[#0B0B0B] text-white min-h-screen pt-28 pb-20 animate-fade-in">
      
      {/* Banner */}
      <div 
        className="text-white py-16 px-4 bg-cover bg-center relative border-b border-white/10"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(11, 11, 11, 0.92), rgba(11, 11, 11, 0.78)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 text-white">
            공지사항
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-normal">
            양성화 관련 로하스건축사사무소의 공지사항입니다.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Search Bar */}
        <div className="glass-card rounded-2xl border border-white/10 p-4 sm:p-6 mb-8 flex items-center justify-between">
          <div className="relative max-w-md w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="제목 또는 내용으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-full text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all"
            />
          </div>
        </div>

        {/* Notices list layout */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map(notice => (
              <article 
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden cursor-pointer hover:border-[#FFD700]/40 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Notice Image */}
                  <div className="h-48 w-full bg-amber-950/20 relative overflow-hidden">
                    {notice.imageUrl ? (
                      <img 
                        src={notice.imageUrl} 
                        alt={notice.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                        <BookOpen size={40} className="stroke-1 mb-2 text-[#FFD700]/50" />
                        <span className="text-xs font-mono">Lohas Architecture</span>
                      </div>
                    )}
                    {notice.isPinned && (
                      <span className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full shadow-md">
                        중요
                      </span>
                    )}
                  </div>

                  {/* Content snippet */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center space-x-1.5 text-xs text-[#FFD700]/90 mb-3 font-mono">
                      <Calendar size={13} />
                      <span>{formatDate(notice.createdAt)}</span>
                    </div>

                    <h3 className="font-extrabold text-white text-base sm:text-lg mb-2 line-clamp-2 hover:text-[#FFD700] transition-colors">
                      {notice.title}
                    </h3>

                    <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed whitespace-pre-line">
                      {notice.content}
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm font-bold text-[#FFD700]">
                  <span className="hover:text-amber-200 transition-colors">상세보기</span>
                  <div className="flex items-center space-x-2">
                    {isAdmin && onDeleteNotice && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNotice(notice.id);
                        }}
                        className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded text-xs font-semibold border border-rose-500/30 transition-colors cursor-pointer flex items-center space-x-1"
                        title="공지사항 삭제"
                      >
                        <Trash2 size={12} />
                        <span>삭제</span>
                      </button>
                    )}
                    <ChevronRight size={16} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl border border-white/10 p-12 text-center text-slate-400">
            <BookOpen size={48} className="mx-auto text-[#FFD700]/40 mb-4 stroke-1" />
            <p className="text-sm">검색 결과가 없거나 게시물이 비어 있습니다.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 transition-all cursor-pointer text-white"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#FFD700] text-black shadow-[0_0_12px_rgba(255,215,0,0.5)]'
                    : 'border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 transition-all cursor-pointer text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121218] text-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#FFD700]/30 flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-start justify-between">
              <div>
                {selectedNotice.isPinned && (
                  <span className="bg-rose-600 text-white text-[10px] font-black px-3 py-1 rounded-full mr-2">
                    중요 공지
                  </span>
                )}
                <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-2 font-mono">
                  <Calendar size={12} />
                  <span>작성일: {formatDate(selectedNotice.createdAt)}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedNotice(null)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {selectedNotice.title}
              </h2>

              {/* Notice Image */}
              {selectedNotice.imageUrl && (
                <div className="rounded-xl overflow-hidden max-h-96 bg-black/50 border border-white/10">
                  <img 
                    src={selectedNotice.imageUrl} 
                    alt={selectedNotice.title} 
                    className="w-full h-full object-contain mx-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Text content */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line text-justify font-sans">
                {selectedNotice.content}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 flex items-center justify-between">
              <div>
                {isAdmin && onDeleteNotice && (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteNotice(selectedNotice.id);
                      setSelectedNotice(null);
                    }}
                    className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-full text-xs font-bold border border-rose-500/30 transition-colors cursor-pointer flex items-center space-x-1.5"
                  >
                    <Trash2 size={14} />
                    <span>이 공지 삭제</span>
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full text-sm transition-colors cursor-pointer border border-white/15"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
