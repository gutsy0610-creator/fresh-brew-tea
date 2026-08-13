import { useMemo } from 'react';

interface Props {
  text: string;
  keywords?: string[];
}

const ExplanationText = ({ text, keywords = [] }: Props) => {
  const parts = useMemo(() => {
    let cleanText = text.replace(/-?\s*\d+\s*-\s*번호\s*문항/g, '').trim();

    if (!keywords || keywords.length === 0) {
      return [{ text: cleanText, isKeyword: false }];
    }

    const validKeywords = keywords
      .filter(k => k && k.length > 1)
      .map(k => k.trim())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => b.length - a.length); // match longer keywords first

    if (validKeywords.length === 0) {
      return [{ text: cleanText, isKeyword: false }];
    }

    const regexString = validKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${regexString})`, 'gi');
    
    const splitParts = cleanText.split(regex);
    
    return splitParts.map(part => {
      const isKeyword = validKeywords.some(k => k.toLowerCase() === part.toLowerCase());
      return { text: part, isKeyword };
    });
  }, [text, keywords]);

  return (
    <div style={{ 
      letterSpacing: '-0.02em', 
      lineHeight: 1.7, 
      wordBreak: 'keep-all', 
      textAlign: 'justify',
      marginTop: '8px'
    }}>
      {parts.map((part, index) => {
        if (part.isKeyword) {
          return <strong key={index} style={{ color: 'var(--main-blue)', fontWeight: 700, backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0 2px', borderRadius: '4px' }}>{part.text}</strong>;
        }
        return <span key={index}>{part.text}</span>;
      })}
    </div>
  );
};

export default ExplanationText;
