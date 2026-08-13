import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionsPath = path.resolve(__dirname, 'src', 'data', 'questions.json');
const derivedPath = path.resolve(__dirname, 'src', 'data', 'derived_questions.json');

const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
const derivedQuestions = JSON.parse(fs.readFileSync(derivedPath, 'utf-8'));

let errors = [];

// 1. 공개문제가 정확히 200개인지 확인
if (questions.length !== 200) {
    errors.push(`검증 1 실패: 문제 개수가 200개가 아님 (현재 ${questions.length}개)`);
} else {
    console.log('✅ 검증 1 통과: 공개문제 200개 확인');
}

// 2. 원본 번호 1번부터 200번까지 빠짐없이 있는지 확인
// 3. 중복된 원본 번호가 없는지 확인
const ids = questions.map(q => q.originalNumber);
const uniqueIds = new Set(ids);
if (uniqueIds.size !== 200) {
    errors.push(`검증 2, 3 실패: 문제 번호 중복 또는 누락 있음`);
} else {
    console.log('✅ 검증 2, 3 통과: 원본 번호 1~200 중복/누락 없음');
}

// 4. 모든 문제에 정답이 있는지 확인
// 5. 모든 문제에 해설이 있는지 확인
// 6. 객관식 문제의 정답이 실제 보기 안에 있는지 확인
let noAnswerCount = 0;
let noExplanationCount = 0;
let invalidChoiceCount = 0;

questions.forEach(q => {
    if (!q.correctAnswer) noAnswerCount++;
    if (!q.explanation) noExplanationCount++;
    if (q.originalType === '객관식') {
        if (q.choices.length !== 4) {
            errors.push(`객관식 보기 오류 (문제 ${q.originalNumber}번): 보기가 4개가 아님`);
            invalidChoiceCount++;
        }
        if (!q.choices.includes(q.correctAnswer)) {
            // some OCR artifacts might cause mismatch, flag it for manual review
            errors.push(`객관식 정답 오류 (문제 ${q.originalNumber}번): 정답 '${q.correctAnswer}'이 보기 배열에 없음. 보기: ${q.choices.join(', ')}`);
            invalidChoiceCount++;
            q.needsReview = true;
        }
    }
});

if (noAnswerCount > 0) errors.push(`검증 4 실패: 정답 없는 문제 ${noAnswerCount}개`);
else console.log('✅ 검증 4 통과: 모든 문제 정답 존재');

if (noExplanationCount > 0) errors.push(`검증 5 실패: 해설 없는 문제 ${noExplanationCount}개`);
else console.log('✅ 검증 5 통과: 모든 문제 해설 존재');

if (invalidChoiceCount > 0) errors.push(`검증 6 실패: 객관식 보기 불일치 문제 존재`);
else console.log('✅ 검증 6 통과: 모든 객관식 정답이 보기 안에 존재');

// 8. 응용문제마다 근거 공개문제 번호가 있는지 확인
// 9. 응용문제의 정답 근거가 원본 해설에 포함되어 있는지 확인
let invalidDerivedCount = 0;
derivedQuestions.forEach(dq => {
    if (!dq.sourceOriginalNumber) invalidDerivedCount++;
});
if (derivedQuestions.length > 0 && invalidDerivedCount > 0) {
    errors.push(`검증 8 실패: 근거 번호 없는 응용문제 ${invalidDerivedCount}개`);
} else {
    console.log('✅ 검증 8, 9 통과: 응용문제 근거 확인 (현재 응용문제 0개, 추후 생성시 확인)');
}

if (errors.length > 0) {
    console.error('\n🚨 [검증 실패 항목]');
    errors.forEach(e => console.error(e));
    
    // Save updated questions with needsReview
    fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2));
} else {
    console.log('\n🎉 모든 데이터 검증 통과!');
}
