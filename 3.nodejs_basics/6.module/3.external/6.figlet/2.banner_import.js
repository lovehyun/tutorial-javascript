import figlet from 'figlet';

figlet('Hello World!', (err, data) => {
    if (err) {
        console.error('figlet 에러:', err);
        return;
    }
    console.log(data);
});
