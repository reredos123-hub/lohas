import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Notice, PageContent, DesignSettings, SEOSettings, VisitorStats, MediaItem } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// Default/Fallback Settings and Content Constants
export const DEFAULT_SEO: SEOSettings = {
  id: 'main',
  title: '로하스건축사사무소 - 위반건축물 양성화 전문',
  description: '위반건축물 양성화, 불법건축물 양성화, 특정건축물 정리 특별조치법 전문 로하스건축사사무소. 김용호 건축사 직접 상담. 신속 안전한 건축물대장 정리 지원.',
  keywords: '건축사사무소, 위반건축물 양성화, 불법건축물 양성화, 특정건축물 정리에 관한 특별조치법, 건축사, 건축허가, 건축물대장, 건축설계, 서울 건축사사무소',
  ogImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
};

export const DEFAULT_DESIGN: DesignSettings = {
  id: 'main',
  primaryColor: '#002147', // Deep Navy
  accentColor: '#FFD700',  // Gold accent (#FFD700)
  fontFamily: 'Pretendard',
  logoText: 'Lohas Architecture',
  heroTitle: '위반건축물 양성화 전문 건축사사무소',
  heroSubtitle: '풍부한 경험과 전문성을 바탕으로 안전하고 신속한 양성화 절차를 지원합니다.',
  heroImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
  menuOrder: ['홈', '회사소개', '양성화 안내', '공지사항', '양성화 검토 신청']
};

export const DEFAULT_HOME: PageContent = {
  id: 'home',
  title: '신뢰와 전문성으로 답하는 로하스',
  subtitle: '위반건축물 정리부터 정식 양성화까지 종합 솔루션 제공',
  content: {
    introTitle: '풍부한 실무 경험의 전문 건축사 직접 상담',
    introBody: '로하스건축사사무소는 대한민국 건축법 및 특정건축물 정리에 관한 특별조치법을 명확하게 파악하여, 불법·위반 건축물로 인해 어려움을 겪고 계신 건축주분들을 위해 빠르고 정확한 양성화 업무를 전문으로 대행합니다. 이행강제금 부과, 재산권 행사 제한 등의 고통을 합법적인 절차를 통해 신속히 덜어드립니다.',
    specialties: [
      { title: '위반건축물 양성화', desc: '불법 증축, 용도 변경 등 법적 기준 충족 여부를 정밀 분석하여 적합한 양성화 경로를 도출합니다.', icon: 'Building' },
      { title: '양성화 신고대행', desc: '복잡한 위반건축물 양성화 신고의 법규검토부터 제출서류/설계도서 작성과 모든 행정과정을 원스톱으로 대행해 드립니다.', icon: 'ClipboardCheck' },
      { title: '건축물 현황조사', desc: '현장 실측 및 정밀 현황조사를 바탕으로 정확한 설계도서 및 조사서를 작성합니다.', icon: 'Eye' },
      { title: '양성화 컨설팅', desc: '위반건축물이 양성화 기준을 충족하지 못할 경우 종합적인 검토로 해결방안에 대한 자문 및 전문 기술 상담을 제공합니다.', icon: 'FileText' },
      { title: '법률상담', desc: '특정건축물 양성화에 관한 특별조치법 및 관련법령에 대하여 궁금하신가요? 언제라도 문의 주시면 상세히 답변드리겠습니다.', icon: 'MessageSquare' }
    ],
    whyUs: [
      { title: '풍부한 현장 실무 경험', desc: '수많은 양성화 실적을 보유하여 까다로운 지자체 심의도 유연하게 통과합니다.', icon: 'Award' },
      { title: '신속하고 투명한 행정 업무', desc: '불필요한 지체 없이 법적 요건을 완비하여 최단 기간 내 양성화를 이끌어냅니다.', icon: 'Zap' },
      { title: '정밀한 법률 및 조례 분석', desc: '각 지자체별로 상이한 건축 조례와 특별조치법을 면밀히 분석합니다.', icon: 'Scale' },
      { title: '대표 건축사의 1:1 직접 상담', desc: '처음부터 끝까지 대표 김용호 건축사가 직접 책임지고 업무를 담당합니다.', icon: 'UserCheck' }
    ]
  },
  updatedAt: null
};

export const DEFAULT_ABOUT: PageContent = {
  id: 'about',
  title: '로하스건축사사무소 소개',
  subtitle: '건축주의 소중한 자산과 권리를 법의 테두리 안에서 완벽하게 보호합니다.',
  content: {
    ceoName: '김용호 건축사',
    firmName: '로하스건축사사무소',
    address: '서울시 성동구 살곶이길 150, 101동 201호',
    phone: '02-499-0229',
    email: 'reredos123@gmail.com',
    greeting: '안녕하십니까. 로하스건축사사무소 대표 김용호입니다.\n\n건축물은 삶을 담는 그릇이자 평생 일궈낸 소중한 재산입니다. 그러나 과거 부족한 주거공간을 확보하려다 발생한 위반건축물 표기는 건축주분들께 심각한 재산상의 손실과 불이익을 안겨주고 있습니다.\n\n저희 로하스건축사사무소는 실무 노하우와 건축행정 절차에 대한 철저한 이해를 바탕으로, 복잡하고 까다로운 법률 및 구비 서류 준비부터 지자체 접수까지 전 과정을 원스톱으로 지원해 드립니다.\n\n주거용 불법 증축, 근린생활시설 무단 용도변경, 불법 호수 분할등 어떤 고민이든 정확하게 분석하여 합법적인 해법을 제시해 드리겠습니다. 언제든 편안히 무료 검토 신청 및 전화를 주시면 친절히 안내해 드리겠습니다.\n\n감사합니다.',
    careers: [
      '대한건축사협회 정회원',
      '서울특별시 성동구 등록 건축사',
      '위반건축물 양성화 행정 대행 전문',
      '다수 단독주택, 다가구, 다세대주택 업무 수행',
      '건축물 현황조사 및 구조안전진단 연계 자문'
    ]
  },
  updatedAt: null
};

export const DEFAULT_GUIDE: PageContent = {
  id: 'guide',
  title: '위반건축물 양성화 종합 안내',
  subtitle: '합법화의 지름길, 복잡한 특별법과 건축법 요건을 알기 쉽게 정리해 드립니다.',
  content: {
    whatIsViolation: {
      title: '위반건축물(불법건축물)이란?',
      description: '허가를 받지 않거나 신고를 하지 않고 무단으로 건축물을 신축, 증축, 개축, 대수선하거나 무단 용도변경한 건축물을 말합니다. 적발 시 건축물대장에 노란색 [위반건축물]로 표기되며, 이행강제금이 반복적으로 부과되고 대출 제한, 부동산 거래 제약 등 불이익을 겪게 됩니다.'
    },
    targetTypes: [
      { title: '베란다, 발코니 무단 증축', desc: '다가구/다세대 주택의 일조사선 등으로 깎인 베란다 부분에 지붕과 벽을 올려 주거 공간으로 늘린 경우' },
      { title: '근린생활시설을 주거로 무단 용도변경(근생빌라)', desc: '건축물대장에는 근생(상가,사무실등)이나 불법으로 개조하여 주택용도로 사용하는 경우' },
      { title: '무단 세대수 증가(일명 방 쪼개기)', desc: '다가구·다세대 주택에서 수익을 늘리기 위해 임의로 세대수를 늘리는 행위' },
      { title: '옥탑방 무단 증축', desc: '옥상에 무단으로 증축하여 방으로 사용하는 경우' }
    ],
    requirements: {
      title: '양성화 가능 기본 요건',
      description: '특정건축물 정리 특별법 적용 기간이거나 현행 건축법에 따른 추인(Retroactive Permit) 요건을 갖추어야 합니다. 특히 구조안전 기준, 소방 및 피난 안전 기준을 만족해야 하며 인접대지 경계선 준수와 건폐율/용적률 허용 한도 내에 있어야 합법화가 가능합니다.'
    },
    documents: [
      '건축물대장 및 토지대장 각 1부',
      '기존 건축물 도면 (부재 시 실측 도면 작성 필요)',
      '위반 부위 현장 사진 (전경, 세부)',
      '기타서류 : 2023.12.31 이전 완공 입증 자료, 이행강제금 납부서(또는 완납 계획)'
    ],
    duration: '현장 실측 및 법적 검토에 약 1~2주, 설계도서 작성 1주, 지자체 접수 및 심의 등에 약 2~4주가 소요되어 총 4~8주 내외로 처리됩니다. (지자체의 처리기간, 건축심의 일정 및 결과에 따라 변동 가능)',
    faqs: [
      { q: '오래된 불법 건축물인데 무조건 양성화가 가능한가요?', a: '아닙니다. 해당 건물이 위치한 용도지역의 건폐율과 용적률이 남아 있어야 하며, 인접 대지 경계선을 과도하게 침범하지 않는 등 기본적인 건축법 기준 및 지자체 조례에 적합해야 합니다. 정확한 판단을 위해서는 도면 및 로케이션 주소지 분석을 통한 법적 검토가 선행되어야 합니다.' },
      { q: '이행강제금을 내고 있어도 신청할 수 있나요?', a: '물론입니다. 이행강제금은 위반 사항을 시정하지 않아 부과되는 것이며, 정식 양성화 절차가 완료되어 건축물대장에서 "위반건축물" 표시가 해제되면 그 시점부터 이행강제금은 전면 부과 중지됩니다.' },
      { q: '양성화 신청을 하면 기존 위반 사항이 구청에 탄로 나는 것은 아닌가요?', a: '양성화는 합법적인 복구를 위한 절차입니다. 정밀 실측 후 요건이 성립하는 경우 안심하고 신청할 수 있으며, 만약 요건이 모자라 정식 신청이 어렵다면 사전 상담 단계에서 합리적인 대안(일부 철거 후 양성화 등)을 모색하므로 정보 유출 등의 우려 없이 면밀하게 조율해 드립니다.' }
    ]
  },
  updatedAt: null
};

export const DEFAULT_NOTICES: Notice[] = [
  {
    id: 'notice-1',
    title: '위반건축물 양성화 특별조치법 관련 사전 안내 및 법적 절차',
    content: `안녕하세요. 로하스건축사사무소 대표 김용호 건축사입니다.\n\n위반건축물을 소유하신 소유주분들께서는 주기적인 이행강제금 납부 및 부동산 매매 불가 등으로 많은 심리적, 재산상 어려움을 겪고 계십니다.\n\n정부에서는 일정 기준을 만족하는 서민 주거용 위반 건축물에 대해 한시적으로 양성화를 시켜주는 '특정건축물 정리에 관한 특별조치법'을 간헐적으로 시행하고 있으며, 특별법이 시행되지 않는 시기에도 현행 건축법상의 '추인(정식 허가/신고)' 제도를 통해 합법적으로 구제받을 수 있는 경로가 존재합니다.\n\n추인의 핵심 절차는 다음과 같습니다:\n1. 대표 건축사의 현장 정밀 실측\n2. 인허가 도면 작성\n3. 구조안전 확인서 및 소방설비 검토서 확보\n4. 지자체 건축과 심의 접수\n5. 위반건축물 표기 해제 및 도면 등재\n\n현재 소유하고 계신 건축물이 이에 해당하는지 여부는 지번과 현장 사진만으로도 사전 검토가 가능하오니 홈페이지 상단의 [양성화 검토 신청] 메뉴를 적극 활용해 보시기 바랍니다.\n\n감사합니다.`,
    category: '양성화안내',
    published: true,
    isPinned: true,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
    createdAt: new Date('2026-07-15'),
    updatedAt: new Date('2026-07-15')
  },
  {
    id: 'notice-2',
    title: '로하스건축사사무소 온라인 무료 양성화 검토 서비스 론칭',
    content: `위반건축물 해결의 명가, 로하스건축사사무소가 비대면 온라인으로 1차 무료 양성화 가능성 검토 신청 서비스를 시작했습니다.\n\n직접 사무소 방문이 어려우시거나, 우선 합법화가 가능한 건물인지 빠르고 간편하게 사전 판단을 받고 싶으신 고객님들을 위해 마련한 네이버 폼 연동 서비스입니다.\n\n상단의 [양성화 검토 신청] 메뉴를 클릭하셔서 주소, 연락처, 위반 유형(옥탑방, 베란다 증축, 무단 용도변경 등)을 기입하여 제출해 주시면, 김용호 대표 건축사가 토지이용계획 및 건축물대장을 정밀 조회한 후 직접 전화를 통해 1:1 상담 및 진단을 내려드립니다.\n\n* 신청 혜택: 1차 법률 검토 및 지자체 조례 조회 무료 서비스\n* 문의전화: 02-499-0229\n\n속 시원한 상담으로 이행강제금 부과의 불안에서 벗어나시기 바랍니다.`,
    category: '소식',
    published: true,
    isPinned: false,
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
    createdAt: new Date('2026-07-10'),
    updatedAt: new Date('2026-07-10')
  }
];

export const DEFAULT_STATS: VisitorStats = {
  id: 'stats',
  visits: 428,
  pageViews: 1395,
  consultClicks: 124,
  blogClicks: 68,
  formClicks: 95
};

// Seeding checks and operations
export async function seedDatabaseIfNeeded() {
  try {
    // Check if system initial seeding has already been performed
    const seedInfoRef = doc(db, 'system', 'seedInfo');
    let isAlreadySeeded = localStorage.getItem('lohas_db_seeded') === 'true';
    try {
      const seedInfoSnap = await getDoc(seedInfoRef);
      if (seedInfoSnap.exists()) {
        isAlreadySeeded = true;
      }
    } catch (e) {
      console.warn('Checking seedInfo error:', e);
    }

    // 1. Check SEO Settings
    const seoRef = doc(db, 'seo', 'main');
    const seoSnap = await getDoc(seoRef);
    if (!seoSnap.exists()) {
      await setDoc(seoRef, DEFAULT_SEO);
    }

    // 2. Check Design Settings
    const designRef = doc(db, 'design', 'main');
    const designSnap = await getDoc(designRef);
    if (!designSnap.exists()) {
      await setDoc(designRef, DEFAULT_DESIGN);
    }

    // 3. Check Page Content - Home
    const homePageRef = doc(db, 'pages', 'home');
    const homePageSnap = await getDoc(homePageRef);
    if (!homePageSnap.exists()) {
      const homeWithTimestamp = { ...DEFAULT_HOME, updatedAt: serverTimestamp() };
      await setDoc(homePageRef, homeWithTimestamp);
    }

    // 4. Check Page Content - About
    const aboutPageRef = doc(db, 'pages', 'about');
    const aboutPageSnap = await getDoc(aboutPageRef);
    if (!aboutPageSnap.exists()) {
      const aboutWithTimestamp = { ...DEFAULT_ABOUT, updatedAt: serverTimestamp() };
      await setDoc(aboutPageRef, aboutWithTimestamp);
    } else {
      // Sync latest default greeting and careers if needed
      try {
        const currentData = aboutPageSnap.data();
        if (currentData && currentData.content) {
          const newGreeting = DEFAULT_ABOUT.content.greeting;
          const newCareers = DEFAULT_ABOUT.content.careers;
          if (currentData.content.greeting !== newGreeting || JSON.stringify(currentData.content.careers) !== JSON.stringify(newCareers)) {
            await updateDoc(aboutPageRef, {
              'content.greeting': newGreeting,
              'content.careers': newCareers,
              updatedAt: serverTimestamp()
            });
          }
        }
      } catch (err) {
        console.warn('Soft update about content skipped:', err);
      }
    }

    // 5. Check Page Content - Guide
    const guidePageRef = doc(db, 'pages', 'guide');
    const guidePageSnap = await getDoc(guidePageRef);
    if (!guidePageSnap.exists()) {
      const guideWithTimestamp = { ...DEFAULT_GUIDE, updatedAt: serverTimestamp() };
      await setDoc(guidePageRef, guideWithTimestamp);
    } else {
      // Soft update existing targetTypes if they have the old texts
      try {
        const currentData = guidePageSnap.data();
        if (currentData && currentData.content && currentData.content.targetTypes) {
          let updated = false;
          const updatedTargetTypes = currentData.content.targetTypes.map((t: any) => {
            if (t.title === '옥탑방 및 무단 증축' && t.desc === '주택 옥상에 무단으로 판넬 조 등의 가설 건물을 지어 방으로 사용하는 경우') {
              updated = true;
              return {
                title: '베란다, 발코니 무단 증축',
                desc: '다가구/다세대 주택의 일조사선 등으로 깎인 베란다 부분에 지붕과 벽을 올려 주거 공간으로 늘린 경우'
              };
            }
            if (t.title === '베란다 무단 확장' && t.desc === '다가구/다세대 주택의 일조사선 등으로 깎인 베란다 부분에 지붕과 벽을 올려 주거 공간으로 늘린 경우') {
              updated = true;
              return {
                title: '근린생활시설을 주거로 무단 용도변경(근생빌라)',
                desc: '건축물대장에는 근생(상가,사무실등)이나 불법으로 개조하여 주택용도로 사용하는 경우'
              };
            }
            if (t.title === '근생빌라(근린생활시설을 주거로 무단 용도변경)' && t.desc === '건축물대장에는 근생(상가,사무실등)이나 불법으로 개조하여 주택용도로 사용하는 경우') {
              updated = true;
              return {
                title: '근린생활시설을 주거로 무단 용도변경(근생빌라)',
                desc: '건축물대장에는 근생(상가,사무실등)이나 불법으로 개조하여 주택용도로 사용하는 경우'
              };
            }
            if (t.title === '근린생활시설 주거 전용 (일명 근생빌라)' && t.desc === '공식 대장상 상가(사무실)이나 불법 싱크대 및 화장실을 설치해 싱글룸 주택으로 사용하는 경우') {
              updated = true;
              return {
                title: '무단 세대수 증가(일명 방 쪼개기)',
                desc: '다가구·다세대 주택에서 수익을 늘리기 위해 임의로 세대수를 늘리는 행위'
              };
            }
            if (t.title === '무단 가설물 설치' && t.desc === '주차장이나 마당에 컨테이너나 가설 천막을 축조해 고정 창고 등으로 쓰는 경우') {
              updated = true;
              return {
                title: '옥탑방 무단 증축',
                desc: '옥상에 무단으로 증축하여 방으로 사용하는 경우'
              };
            }
            return t;
          });
          if (updated) {
            await updateDoc(guidePageRef, {
              'content.targetTypes': updatedTargetTypes,
              updatedAt: serverTimestamp()
            });
          }
        }

        if (currentData && currentData.content && currentData.content.documents) {
          const targetNewDocText = '기타서류 : 2023.12.31 이전 완공 입증 자료, 이행강제금 납부서(또는 완납 계획)';
          const oldDocTexts = [
            '기타 소유권 증빙 서류 및 토지사용승낙서 (타인 토지인 경우)',
            '2023.12.31 이전 완공 입증 자료 (재산세·수도·전기 납부고지서, 항측사진, 시공계약서·영수증등)'
          ];
          const hasOldText = currentData.content.documents.some((d: string) => oldDocTexts.includes(d));
          if (hasOldText) {
            const updatedDocs = currentData.content.documents.map((d: string) => oldDocTexts.includes(d) ? targetNewDocText : d);
            await updateDoc(guidePageRef, {
              'content.documents': updatedDocs,
              updatedAt: serverTimestamp()
            });
          }
        }

        if (currentData && currentData.content && currentData.content.duration && (currentData.content.duration.includes('지자체 사정 및 구조안전 심의 여부에 따라 변동 가능') || currentData.content.duration.includes('(건축심의 일정 및 결과에 따라 변동 가능)'))) {
          await updateDoc(guidePageRef, {
            'content.duration': DEFAULT_GUIDE.content.duration,
            updatedAt: serverTimestamp()
          });
        }
      } catch (err) {
        console.warn('Soft update guide targetTypes skipped:', err);
      }
    }

    // 6. Check Notices Collection ONLY if not previously seeded
    if (!isAlreadySeeded) {
      const noticesRef = collection(db, 'notices');
      const noticesSnap = await getDocs(noticesRef);
      if (noticesSnap.empty) {
        for (const notice of DEFAULT_NOTICES) {
          const { id, createdAt, updatedAt, ...cleanNotice } = notice;
          await setDoc(doc(db, 'notices', id), {
            ...cleanNotice,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      }
    }

    // 7. Check visitor stats
    const statsRef = doc(db, 'stats', 'stats');
    const statsSnap = await getDoc(statsRef);
    if (!statsSnap.exists()) {
      await setDoc(statsRef, DEFAULT_STATS);
    }

    // Record system seed status so deleted notices are never re-seeded
    localStorage.setItem('lohas_db_seeded', 'true');
    try {
      await setDoc(seedInfoRef, { seeded: true, seededAt: serverTimestamp() }, { merge: true });
    } catch (e) {
      console.warn('Failed writing seedInfo:', e);
    }

  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}

// ----------------------------------------
// VISITOR TRACKING SERVICES
// ----------------------------------------
export async function trackPageView() {
  try {
    const statsRef = doc(db, 'stats', 'stats');
    const isVisitedInSession = sessionStorage.getItem('lohas_visited');
    
    if (!isVisitedInSession) {
      sessionStorage.setItem('lohas_visited', 'true');
      await setDoc(statsRef, {
        visits: increment(1),
        pageViews: increment(1)
      }, { merge: true });
    } else {
      await setDoc(statsRef, {
        pageViews: increment(1)
      }, { merge: true });
    }
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
}

export async function trackClick(type: 'consultClicks' | 'blogClicks' | 'formClicks') {
  try {
    const statsRef = doc(db, 'stats', 'stats');
    await setDoc(statsRef, {
      [type]: increment(1)
    }, { merge: true });
  } catch (error) {
    console.error(`Failed to track click for ${type}:`, error);
  }
}

// Reset visitor stats to 0
export async function resetVisitorStats() {
  try {
    const statsRef = doc(db, 'stats', 'stats');
    await setDoc(statsRef, {
      id: 'stats',
      visits: 0,
      pageViews: 0,
      consultClicks: 0,
      blogClicks: 0,
      formClicks: 0
    });
  } catch (error) {
    console.error('Failed to reset visitor stats:', error);
    throw error;
  }
}

// ----------------------------------------
// CMS FETCH/UPDATE SERVICES
// ----------------------------------------

// Fetch visitor stats
export async function fetchVisitorStats(): Promise<VisitorStats> {
  try {
    const statsRef = doc(db, 'stats', 'stats');
    const snap = await getDoc(statsRef);
    if (snap.exists()) {
      return snap.data() as VisitorStats;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'stats/stats');
  }
  return DEFAULT_STATS;
}

// Fetch SEO settings
export async function fetchSEOSettings(): Promise<SEOSettings> {
  try {
    const seoRef = doc(db, 'seo', 'main');
    const snap = await getDoc(seoRef);
    if (snap.exists()) {
      return snap.data() as SEOSettings;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'seo/main');
  }
  return DEFAULT_SEO;
}

// Update SEO settings
export async function updateSEOSettings(seo: Omit<SEOSettings, 'id'>) {
  try {
    const seoRef = doc(db, 'seo', 'main');
    await setDoc(seoRef, { id: 'main', ...seo }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seo/main');
  }
}

// Fetch Design settings
export async function fetchDesignSettings(): Promise<DesignSettings> {
  try {
    const designRef = doc(db, 'design', 'main');
    const snap = await getDoc(designRef);
    if (snap.exists()) {
      return snap.data() as DesignSettings;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'design/main');
  }
  return DEFAULT_DESIGN;
}

// Update Design settings
export async function updateDesignSettings(design: Omit<DesignSettings, 'id'>) {
  try {
    const designRef = doc(db, 'design', 'main');
    await setDoc(designRef, { id: 'main', ...design }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'design/main');
  }
}

// Fetch single Page Content
export async function fetchPageContent(id: 'home' | 'about' | 'guide'): Promise<PageContent> {
  try {
    const ref = doc(db, 'pages', id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as PageContent;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `pages/${id}`);
  }
  
  if (id === 'home') return DEFAULT_HOME;
  if (id === 'about') return DEFAULT_ABOUT;
  return DEFAULT_GUIDE;
}

// Update Page Content
export async function updatePageContent(id: 'home' | 'about' | 'guide', data: Partial<PageContent>) {
  try {
    const ref = doc(db, 'pages', id);
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `pages/${id}`);
  }
}

// Fetch Notices (all, sorted by createdAt desc, optionally pinned first)
export async function fetchNotices(): Promise<Notice[]> {
  try {
    const noticesRef = collection(db, 'notices');
    let snap;
    try {
      const q = query(noticesRef, orderBy('createdAt', 'desc'));
      snap = await getDocs(q);
    } catch (queryErr) {
      console.warn('Fallback fetching notices without orderBy query:', queryErr);
      snap = await getDocs(noticesRef);
    }

    const list: Notice[] = [];
    snap.forEach(docSnap => {
      const data = docSnap.data();
      if (data.category === '성공사례') return; // Exclude '성공사례' items

      let createdDate = new Date();
      if (data.createdAt?.toDate) {
        createdDate = data.createdAt.toDate();
      } else if (data.createdAt) {
        createdDate = new Date(data.createdAt);
      }

      let updatedDate = new Date();
      if (data.updatedAt?.toDate) {
        updatedDate = data.updatedAt.toDate();
      } else if (data.updatedAt) {
        updatedDate = new Date(data.updatedAt);
      }

      list.push({
        id: docSnap.id,
        ...data,
        createdAt: createdDate,
        updatedAt: updatedDate
      } as Notice);
    });

    // In-memory sort: pinned items first, then by createdAt desc
    list.sort((a, b) => {
      if (!!a.isPinned !== !!b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'notices');
    return [];
  }
}

// Create Notice
export async function createNotice(notice: Omit<Notice, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const noticesRef = collection(db, 'notices');
  const docRef = await addDoc(noticesRef, {
    ...notice,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

// Update Notice
export async function updateNotice(id: string, notice: Partial<Omit<Notice, 'id' | 'createdAt' | 'updatedAt'>>) {
  const docRef = doc(db, 'notices', id);
  await updateDoc(docRef, {
    ...notice,
    updatedAt: serverTimestamp()
  });
}

// Delete Notice
export async function deleteNotice(id: string) {
  try {
    const docRef = doc(db, 'notices', id);
    await deleteDoc(docRef);
    localStorage.setItem('lohas_db_seeded', 'true');
    try {
      await setDoc(doc(db, 'system', 'seedInfo'), { seeded: true, updatedAt: serverTimestamp() }, { merge: true });
    } catch (e) {
      // ignore
    }
  } catch (error) {
    console.error(`Error deleting notice (${id}):`, error);
    throw error;
  }
}

// Fetch Media Items
export async function fetchMediaItems(): Promise<MediaItem[]> {
  try {
    const mediaRef = collection(db, 'media');
    const q = query(mediaRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list: MediaItem[] = [];
    snap.forEach(docSnap => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
      } as MediaItem);
    });
    return list;
  } catch (error) {
    console.error('Error fetching media items:', error);
  }
  return [];
}

// Add Media Item (uploaded record)
export async function addMediaItem(item: Omit<MediaItem, 'id' | 'createdAt'>): Promise<string> {
  const mediaRef = collection(db, 'media');
  const docRef = await addDoc(mediaRef, {
    ...item,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

// Delete Media Item
export async function deleteMediaItem(id: string) {
  const docRef = doc(db, 'media', id);
  await deleteDoc(docRef);
}
