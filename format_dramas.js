const fs = require('fs');

const data = `
무빙 (디즈니+) – 초능력자 부모와 아이들의 이야기를 다룬 액션 스릴러
더 글로리 파트 2 (넷플릭스) – 송혜교 주연의 복수극
모범택시 2 (SBS) – 억울한 피해자들을 대신해 복수하는 사적 복수 대행극
닥터 차정숙 (JTBC) – 20년 차 주부의 1년 차 레지던트 도전기
낭만닥터 김사부 3 (SBS) – 돌담병원을 배경으로 펼쳐지는 휴먼 메디컬 드라마
일타 스캔들 (tvN) – 반찬가게 사장과 수학 일타 강사의 로맨스
킹더랜드 (JTBC) – 호텔리어와 재벌 2세의 스위트 로맨스
연인 (MBC) – 병자호란을 배경으로 한 남녀의 희비극
대행사 (JTBC) – 광고대행사 최초 여성 임원의 성공 스토리
마스크걸 (넷플릭스) – 외모 열등감을 가진 인터넷 방송 BJ의 잔혹극
카지노 시즌 2 (디즈니+) – 카지노 왕 최민식의 치열한 사투
정신병동에도 아침이 와요 (넷플릭스) – 정신건강의학과 간호사의 따뜻한 이야기
최악의 악 (디즈니+) – 1990년대 한중일 마약 트라이앵글 수사극
이두나! (넷플릭스) – 아이돌 출신 두나와 대학생 원준의 청춘 로맨스
무인도의 디바 (tvN) – 15년 만에 무인도에서 구조된 디바 지망생의 도전기
고려 거란 전쟁 (KBS 2TV) – 강감찬 장군과 현종의 고려 거란 전쟁 대하사극
열녀박씨 계약결혼뎐 (MBC) – 조선시대 유교걸의 현대 시공간 초월 계약결혼
반짝이는 워터멜론 (tvN) – 코다(CODA) 소년의 타임슬립 밴드 성장기
스위트홈 시즌 2 (넷플릭스) – 욕망으로 괴물이 되는 세상의 아포칼립스
악귀 (SBS) – 악귀에 씐 여자와 그 악귀를 보는 민속학자의 미스터리 스릴러
===2024===
눈물의 여왕 (tvN) – 퀸즈 그룹 재벌 3세와 용두리 이장 아들의 사랑 이야기
밤에 피는 꽃 (MBC) – 15년 차 수절과부의 복면 과객 코믹 액션 사극
굿파트너 (SBS) – 스타변호사와 신입변호사의 이혼 전문 메디컬/법정극
선재 업고 튀어 (tvN) – 최애를 살리기 위해 과거로 돌아가는 타임슬립 구원 로맨스
커넥션 (SBS) – 마약에 강제 중독된 마약팀 에이스 형사의 추적 스릴러
내 남편과 결혼해줘 (tvN) – 인생 2회차를 살게 된 여자의 운명 개척 복수극
웰컴투 삼달리 (JTBC) – 제주 개천에서 난 용의 힐링 개천 로맨스
낮과 밤이 다른 그녀 (JTBC) – 낮에는 50대, 밤에는 20대로 변하는 취준생의 코믹 오피스
원더풀 월드 (MBC) – 아들을 잃은 어머니의 휴먼 미스터리 스릴러
재벌X형사 (SBS) – 철부지 재벌 3세가 형사가 되어 펼치는 공조 수사
수사반장 1958 (MBC) – 전설의 형사 박영한의 청춘 시절 수사극
열혈사제 2 (SBS) – 다혈질 가톨릭 사제의 불의 소탕 코믹 액션
오징어 게임 시즌 2 (넷플릭스) – 잔혹한 서바이벌 게임의 새로운 전개
정년이 (tvN) – 1950년대 한국전쟁 직후 여성국극단 입성기
엄마친구아들 (tvN) – 오류 난 인생을 재부팅하려는 여자와 엄마 친구 아들의 로맨스
삼식이 삼촌 (디즈니+) – 혼돈의 1960년대 원산지 야망가들의 서사
지옥에서 온 판사 (SBS) – 판사의 몸에 들어간 악마의 사법 정의 실현극
백설공주에게 죽음을 - Black Out (MBC) – 시신 없는 살인 사건의 진실 추적극
피라미드 게임 (티빙) – 서바이벌 서열 전쟁을 다룬 학원 스릴러
히어로는 아닙니다만 (JTBC) – 현대인의 병으로 능력을 잃어버린 초능력 가족 이야기
===2025===
굿보이 (JTBC) – 올림픽 특채 경찰들의 불의에 맞서는 메달리스트 수사극
나인 퍼즐 (디즈니+) – 연쇄살인 사건의 유일한 목격자이자 프로파일러의 추적극
다 이루어질지니 (넷플릭스) – 정체불명의 램프의 정령 지니와 채영의 로맨틱 코미디
뉴토피아 (쿠팡플레이) – 서울의 고층 빌딩 숲에서 벌어지는 좀비 아포칼립스
광장 (넷플릭스) – 동생의 죽음 뒤 숨겨진 비밀을 파헤치는 조직 액션 스릴러
언젠가는 슬기로울 전공의생활 (tvN) – 상급종합병원 산부인과 전공의들의 병원 생활
서초동 (tvN) – 법조타운 서초동을 배경으로 한 어소시에이트 변호사들의 이야기
폭군의 셰프 (tvN) – 타임슬립한 셰프와 왕의 요리 판타지
태풍상사 (tvN) – 1997년 IMF 위기 속 중소기업 청년들의 고군분투기
그놈은 흑염룡 (tvN) – 온라인 게임에서 만난 악연들의 오피스 로맨스
감자연구소 (tvN) – 산골짜기 감자연구소를 배경으로 한 힐링 코믹 로맨스
미지의 서울 (tvN) – 쌍둥이 자매가 서로의 삶을 바꾸는 인생 교환 로맨스
견우와 선녀 (tvN) – 여고생 무당의 첫사랑 구원 로맨스
내가 죽기 일주일 전 (티빙) – 삶의 의욕을 잃은 스물넷 희완 앞에 저승사자가 나타나며 벌어지는 청춘 판타지
S라인 (티빙) – 사람들의 머리 위에 빨간 선이 나타나며 벌어지는 미스터리 스릴러
내 여자친구는 상남자 (스튜디오X+U) – 하루아침에 남자로 변한 여자친구와의 멘붕 로맨스
귀궁 (SBS) – 왕가에 원한을 품은 귀신에 맞서는 무녀와 이무기의 은밀한 퇴마극
노무사 노무진 (MBC) – 유령 보는 노무사의 좌충우돌 노동 문제 해결기
스프링 피버 (tvN) – 차가운 마음을 녹이는 봄날의 로맨틱 코미디
이혼보험 (tvN) – 최고의 이혼 보험 상품 개발팀의 사연 있는 로맨스
`;

let currentYear = 2023;
const parsedDramas = [];
data.split('\n').forEach(line => {
  line = line.trim();
  if (!line) return;
  if (line.startsWith('===')) {
    currentYear = parseInt(line.replace(/=/g, ''));
    return;
  }
  const match = line.match(/^(.+?)(?:\s*\((.+?)\))?\s*–\s*(.+)$/);
  if (match) {
    const title = match[1].trim();
    const platform = match[2] ? match[2].trim() : '';
    const desc = match[3].trim();
    parsedDramas.push({
      title,
      year: currentYear,
      episodes: 16,
      genre: desc,
      rating: parseFloat((4 + Math.random()).toFixed(1)),
      image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&q=80',
      link: 'https://search.naver.com/search.naver?query=' + encodeURIComponent(title)
    });
  }
});

// Existing dramas
const existing = [
  { title: "선재 업고 튀어", year: 2024, episodes: 16, genre: "Time Slip / Rom-Com", rating: 4.9, image: "/선업튀.png", link: "https://www.tving.com/search?keyword=%EC%84%A0%EC%9E%AC%20%EC%97%85%EA%B3%A0%20%ED%8A%80%EC%96%B4" },
  { title: "눈물의 여왕", year: 2024, episodes: 16, genre: "Romance / Drama", rating: 4.8, image: "https://upload.wikimedia.org/wikipedia/en/e/e2/Queen_of_Tears_poster.png", link: "https://www.tving.com/search?keyword=%EB%88%88%EB%AC%BC%EC%9D%98%20%EC%97%AC%EC%99%95" },
  { title: "내 남편과 결혼해줘", year: 2024, episodes: 16, genre: "Revenge / Fantasy", rating: 4.9, image: "/내남편과결혼해줘.jpg", link: "https://www.tving.com/search?keyword=%EB%82%B4%20%EB%82%A8%ED%8E%B8%EA%B3%BC%20%EA%B2%B0%ED%98%BC%ED%95%B4%EC%A4%98" },
  { title: "이재, 곧 죽습니다", year: 2023, episodes: 8, genre: "Fantasy / Thriller", rating: 4.7, image: "https://upload.wikimedia.org/wikipedia/en/3/36/Death%27s_Game_poster.jpg", link: "https://www.tving.com/search?keyword=%EC%9D%B4%EC%9E%AC%20%EA%B3%A7%20%EC%A3%BD%EC%8A%B5%EB%8B%88%EB%8B%A4" },
  { title: "피라미드 게임", year: 2024, episodes: 10, genre: "Teen / Psychological", rating: 4.8, image: "https://upload.wikimedia.org/wikipedia/en/b/b5/Pyramid_Game_%28TV_series%29_poster.jpg", link: "https://www.tving.com/search?keyword=%ED%94%BC%EB%9D%BC%EB%AF%B8%EB%93%9C%20%EA%B2%8C%EC%9E%84" },
];

const allDramas = [...existing];
const titles = new Set(existing.map(d => d.title));

parsedDramas.forEach(d => {
  if (!titles.has(d.title)) {
    titles.add(d.title);
    allDramas.push(d);
  }
});

// write the new array code snippet
const output = `const mockDramas = [\n${allDramas.map(d => `  { title: ${JSON.stringify(d.title)}, year: ${d.year}, episodes: ${d.episodes}, genre: ${JSON.stringify(d.genre)}, rating: ${d.rating}, image: ${JSON.stringify(d.image)}, link: ${JSON.stringify(d.link)} }`).join(',\n')}\n];`;
fs.writeFileSync('c:\\Users\\jbjaskhj\\Desktop\\창업수업\\antigravity\\mockDramas.js', output);
console.log('Saved to mockDramas.js');
