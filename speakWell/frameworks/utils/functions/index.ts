export function toLowercaseAndRemoveSpaces(input) {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  return input.toLowerCase().replace(/\s+/g, '');
}

export function extractSummary(text: string): string {
  const regex = /(?<=Summary:\s)([\s\S]*?)(?=Description:)/;
  const match = text.match(regex);
  console.log(match ? match[0].trim() : 'No match found');
  return match ? match[0].trim() : '';
}
