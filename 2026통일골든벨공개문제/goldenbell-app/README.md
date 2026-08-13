# 2026 통일골든벨 도전!

2026년 통일골든벨 기본학습문제(공개) PDF 200문항을 바탕으로 제작된 모바일 우선 반응형 학습 웹 게임 사이트입니다.

## 🚀 주요 기능 (Features)

1. **핵심 암기 (Flashcards)**
   - 200문항 전체에 대한 플래시카드 제공.
   - 단원별, 취약 문제 위주의 빈도 자동 조절.
2. **공개문제 풀기 (Quiz)**
   - 전체 문제, 단원별, 유형별 맞춤형 퀴즈 출제.
   - 매 출제 시 객관식 보기 순서 랜덤 셔플 적용.
   - 주관식의 경우 띄어쓰기, 대소문자, 주요 기호를 무시하는 관대한 채점 알고리즘 적용.
3. **해설 응용문제 (Derived Questions)**
   - 원문 해설을 바탕으로 자동 추출/생성된 100문항 규모의 추가 응용문제 풀이.
   - 연도 맞히기, OX 판단 등 다양한 추가 학습 가능.
4. **오답 복습 (Review)**
   - 틀린 문제는 자동으로 오답노트에 기록.
   - 동일 문제를 2회 연속 정답 처리 시 자동 '복습 완료' 반영.
5. **실전 골든벨 (Golden Bell Mode)**
   - 연습 모드, 실전 모드(1회 오답 시 종료), 가족 대결 모드 지원.
   - 현재 점수, 남은 문제 등 생동감 넘치는 모의 실전 환경 제공.
6. **나의 학습기록 (Dashboard & Stats)**
   - 학습 및 정답률, 연속 학습 통계 제공.
   - LocalStorage를 이용한 오프라인 환경 완벽 동작.
   - JSON 형태로 학습 데이터 백업 및 복원 기능 지원.

## 🛠 기술 스택 (Tech Stack)

- **프레임워크**: React (Vite) + TypeScript
- **라우팅**: React Router v6
- **상태 관리**: React Hooks + LocalStorage
- **스타일링**: Vanilla CSS + CSS Variables (가이드라인 준수 디자인 시스템)

## 🏃 실행 방법 (Getting Started)

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **앱 접속**
   - 개발 서버가 띄워진 주소(통상 `http://localhost:5173`)로 접속합니다.
   - 모바일 환경에서의 테스트를 권장합니다.

## 🗂 파일 구조 (File Structure)

- `src/data/`: PDF에서 추출한 원본 200문항(`questions.json`) 및 해설 파생 문항(`derived_questions.json`) 저장
- `src/hooks/`: LocalStorage 및 학습 데이터 상태를 관리하는 `useLearningData.ts` 포함
- `src/utils/`: 주관식 정답 채점을 위한 `scoring.ts` 포함
- `src/pages/`: 6가지 메인 기능과 대시보드를 담당하는 컴포넌트 페이지들
- `src/index.css`: 요구사항을 완벽히 반영한 모바일 우선/커스텀 색상의 글로벌 디자인 시스템
- `extract_pdf.js` / `extract_questions.cjs` / `generate_derived_questions.cjs`: PDF 파싱 및 데이터 변환을 담당했던 노드 스크립트
- `validate-data.js`: 추출된 데이터의 무결성(200문항, 정답 여부 등 13개 항목) 검증용 스크립트
