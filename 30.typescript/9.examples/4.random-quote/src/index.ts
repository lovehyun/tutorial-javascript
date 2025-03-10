const quotes: string[] = [
    'The greatest glory in living lies not in never falling, but in rising every time we fall.',
    'The way to get started is to quit talking and begin doing.',
    "Life is what happens when you're busy making other plans.",
];

// function getRandomQuote(void: void): string { // 함수 인자가 없다는것을 명확하게 정의 할 수도 있음. (잘 안씀)
function getRandomQuote(): string {
    const randomIndex: number = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

console.log(getRandomQuote());
