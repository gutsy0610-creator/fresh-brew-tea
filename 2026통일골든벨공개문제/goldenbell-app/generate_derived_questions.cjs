const fs = require('fs');
const path = require('path');

const questionsPath = path.resolve('src', 'data', 'questions.json');
const derivedPath = path.resolve('src', 'data', 'derived_questions.json');

const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
const derivedQuestions = [];

let derivedIdCounter = 1;

questions.forEach(q => {
    const exp = q.explanation;
    if (!exp) return;

    // Type 1: 연도 맞히기 (Guess the year)
    const yearMatch = exp.match(/1[89]\d{2}년|20\d{2}년/);
    if (yearMatch) {
        const year = yearMatch[0];
        const blankExp = exp.replace(year, 'OOOO년');
        // create a derived question
        const firstSentence = blankExp.split('.')[0] + '.';
        if (firstSentence.includes('OOOO년')) {
            derivedQuestions.push({
                derivedId: derivedIdCounter++,
                sourceOriginalNumber: q.originalNumber,
                questionType: '연도 맞히기',
                question: `다음 빈칸에 들어갈 알맞은 연도를 쓰시오.\n\n"${firstSentence}"`,
                choices: [],
                correctAnswer: year,
                acceptedAnswers: [year, year.replace('년', '')],
                explanation: `정답은 ${year}입니다. ` + exp,
                evidenceFromSourceExplanation: firstSentence.replace('OOOO년', year),
                difficulty: '중'
            });
        }
    }

    // Type 2: OX 판단 (OX Question)
    // Make a true statement out of the first sentence of the explanation.
    const sentences = exp.split('. ');
    if (sentences.length >= 2) {
        const sentence = sentences[0] + '.';
        // skip if it contains a line break to keep it clean
        if (!sentence.includes('\n')) {
            derivedQuestions.push({
                derivedId: derivedIdCounter++,
                sourceOriginalNumber: q.originalNumber,
                questionType: 'OX 판단',
                question: `다음 설명이 맞으면 O, 틀리면 X를 선택하시오.\n\n"${sentence}"`,
                choices: [],
                correctAnswer: 'O',
                acceptedAnswers: ['O'],
                explanation: exp,
                evidenceFromSourceExplanation: sentence,
                difficulty: '하'
            });
        }
    }
});

fs.writeFileSync(derivedPath, JSON.stringify(derivedQuestions, null, 2), 'utf-8');
console.log(`Generated ${derivedQuestions.length} derived questions.`);
