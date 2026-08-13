const fs = require('fs');
const path = require('path');

const outPath = path.resolve('src', 'data', 'questions.json');
const derivedOutPath = path.resolve('src', 'data', 'derived_questions.json');

async function processPdf() {
  let fullText = fs.readFileSync('raw_text_dump.txt', 'utf-8');

  const questions = [];
  
  for (let i = 1; i <= 200; i++) {
    // Usually "\n 1 \n" or similar
    let startRegex = new RegExp(`\\n\\s*${i}\\s*\\n`);
    if (i === 1) startRegex = /\\n1\\s/; 
    
    let match = startRegex.exec(fullText);
    let startIdx = -1;
    
    if (match) {
        startIdx = match.index;
    } else {
        let backupRegex = new RegExp(`\\n\\s*${i}\\s+`);
        let backupMatch = backupRegex.exec(fullText);
        if (backupMatch) startIdx = backupMatch.index;
    }
    
    if (i === 1) {
        startIdx = fullText.indexOf('\n1 ');
        if (startIdx === -1) startIdx = fullText.indexOf('\n1\n');
        if (startIdx === -1) {
           startIdx = fullText.indexOf('1. 분단에 대한 인식');
           if (startIdx !== -1) {
               startIdx = fullText.indexOf('\n1', startIdx + 10);
           }
        }
    }

    if (startIdx === -1) {
        console.log(`Failed to find start for question ${i}`);
        continue;
    }

    let endIdx = fullText.length;
    if (i < 200) {
        let nextRegex = new RegExp(`\\n\\s*${i+1}\\s*\\n`);
        let nextMatch = nextRegex.exec(fullText.substring(startIdx + 5));
        if (nextMatch) {
            endIdx = startIdx + 5 + nextMatch.index;
        } else {
            let nextBackupRegex = new RegExp(`\\n\\s*${i+1}\\s+`);
            let nextBackupMatch = nextBackupRegex.exec(fullText.substring(startIdx + 5));
            if (nextBackupMatch) endIdx = startIdx + 5 + nextBackupMatch.index;
        }
    }

    let qBlock = fullText.substring(startIdx, endIdx);
    
    let answerMatch = qBlock.match(/\[정답\]\s*([^\n]+)/);
    let explanationMatch = qBlock.match(/【해설】([\s\S]*)/);
    
    let qTextPart = qBlock;
    let answerStr = '';
    let expStr = '';
    
    if (answerMatch) {
        answerStr = answerMatch[1].trim();
        qTextPart = qBlock.substring(0, answerMatch.index);
    }
    if (explanationMatch) {
        expStr = explanationMatch[1].trim();
        if (!answerMatch || explanationMatch.index < answerMatch.index) {
             qTextPart = qBlock.substring(0, explanationMatch.index);
        }
    }
    
    let choices = [];
    let qText = qTextPart.replace(/^\s*\d+\s*/, '').trim(); 
    
    let choiceMatch = qText.match(/①\s*(.+?)\s*②\s*(.+?)\s*③\s*(.+?)\s*④\s*([^\n]+)/);
    if (choiceMatch) {
        choices = [
            choiceMatch[1].trim(),
            choiceMatch[2].trim(),
            choiceMatch[3].trim(),
            choiceMatch[4].trim()
        ];
        qText = qText.substring(0, choiceMatch.index).trim();
    } else {
        let c1 = qText.match(/①\s*([^\n]+)/);
        let c2 = qText.match(/②\s*([^\n]+)/);
        let c3 = qText.match(/③\s*([^\n]+)/);
        let c4 = qText.match(/④\s*([^\n]+)/);
        if (c1 && c2 && c3 && c4) {
            choices = [
                c1[1].trim(),
                c2[1].trim(),
                c3[1].trim(),
                c4[1].trim()
            ];
            let firstChoiceIdx = Math.min(c1.index, c2.index, c3.index, c4.index);
            qText = qText.substring(0, firstChoiceIdx).trim();
        }
    }
    
    let type = choices.length > 0 ? "객관식" : (qText.includes("O, 틀리면 X") || answerStr === 'O' || answerStr === 'X' || answerStr === '○' || answerStr === '×' ? "OX" : "주관식");
    
    let correctAnswer = answerStr;
    if (type === "객관식") {
        let ansNum = -1;
        if (answerStr.includes('①')) ansNum = 0;
        else if (answerStr.includes('②')) ansNum = 1;
        else if (answerStr.includes('③')) ansNum = 2;
        else if (answerStr.includes('④')) ansNum = 3;
        
        if (ansNum !== -1) {
            correctAnswer = choices[ansNum];
        }
    } else if (type === "OX") {
        if (answerStr.includes('O') || answerStr.includes('○')) correctAnswer = 'O';
        if (answerStr.includes('X') || answerStr.includes('×')) correctAnswer = 'X';
    }
    
    let chapter = 1;
    let chapterTitle = "분단에 대한 인식";
    if (i >= 50 && i <= 99) { chapter = 2; chapterTitle = "평화통일에 대한 역사적 접근"; }
    if (i >= 100 && i <= 149) { chapter = 3; chapterTitle = "북한에 대한 이해"; }
    if (i >= 150 && i <= 200) { chapter = 4; chapterTitle = "한반도 평화통일의 미래"; }
    
    questions.push({
        id: i,
        originalNumber: i,
        chapter,
        chapterTitle,
        originalType: type,
        question: qText,
        choices,
        correctAnswer,
        acceptedAnswers: [correctAnswer],
        explanation: expStr,
        keywords: [],
        needsReview: (correctAnswer === '' || expStr === '' || (type === "객관식" && choices.length !== 4))
    });
  }
  
  if (!fs.existsSync(path.resolve('src', 'data'))) {
      fs.mkdirSync(path.resolve('src', 'data'), { recursive: true });
  }
  fs.writeFileSync(outPath, JSON.stringify(questions, null, 2), 'utf-8');
  console.log(`Parsed ${questions.length} questions and saved to ${outPath}`);
  fs.writeFileSync(derivedOutPath, JSON.stringify([], null, 2), 'utf-8');
}

processPdf().catch(console.error);
