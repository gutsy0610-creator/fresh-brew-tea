const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

const pdfPath = 'C:\\Users\\jbjaskhj\\Desktop\\창업수업\\antigravity\\2026통일골든벨공개문제\\2026통일골든벨공개문제.pdf';

async function extractText() {
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        // Just join the items. This might lose some newlines if not careful.
        // pdfjs returns text in blocks.
        let lastY = -1;
        for (const item of textContent.items) {
            if (lastY !== item.transform[5] && lastY !== -1) {
                fullText += '\n';
            }
            fullText += item.str;
            lastY = item.transform[5];
        }
        fullText += '\n';
    }
    
    fs.writeFileSync('raw_text_dump.txt', fullText, 'utf-8');
    console.log("Extracted text. Length: " + fullText.length);
}

extractText().catch(console.error);
