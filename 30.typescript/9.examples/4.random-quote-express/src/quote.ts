export const quotes: string[] = [
    'The greatest glory in living lies not in never falling, but in rising every time we fall.',
    'The way to get started is to quit talking and begin doing.',
    "Life is what happens when you're busy making other plans.",
    'Your time is limited, so don’t waste it living someone else’s life.',
    'If life were predictable it would cease to be life, and be without flavor.',
];

export function getRandomQuote(): string {
    const randomIndex: number = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}
