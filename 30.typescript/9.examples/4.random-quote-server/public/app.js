// window.onload = () => {
document.addEventListener('DOMContentLoaded', () => {
    const quoteElement = document.getElementById('quote');
    const button = document.getElementById('new-quote');

    const fetchRandomQuote = async () => {
        try {
            const response = await fetch('/api/quote');
            const data = await response.json();
            quoteElement.textContent = data.quote;
        } catch (error) {
            quoteElement.textContent = 'Failed to fetch quote.';
        }
    };

    button.addEventListener('click', fetchRandomQuote);

    // 초기 쿼트 가져오기
    fetchRandomQuote();
});
