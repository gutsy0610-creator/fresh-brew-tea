export const normalizeString = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/\s+/g, '') // remove all spaces
    .replace(/○/g, 'O')
    .replace(/×/g, 'X')
    .replace(/,/g, '') // remove commas in numbers
    .replace(/선생$/g, '')
    .replace(/의사$/g, '')
    .replace(/대통령$/g, '')
    .toLowerCase();
};

export const removeParens = (str: string): string => {
  return str.replace(/\([^)]*\)/g, ''); // remove contents inside parens
};

export const isCorrectSubjective = (
  userAnswer: string,
  correctAnswers: string[]
): boolean => {
  const normUser = normalizeString(userAnswer);
  
  for (let ans of correctAnswers) {
    const normAns = normalizeString(ans);
    const noParenAns = normalizeString(removeParens(ans));
    
    if (normUser === normAns || normUser === noParenAns) {
      return true;
    }
  }
  return false;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};
