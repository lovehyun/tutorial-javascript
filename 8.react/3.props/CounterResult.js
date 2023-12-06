const CounterResult = ({ num }) => {
    console.log(num);
    return (
        <div>
            { num % 2 === 0 ? "Even" : "Odd" }
        </div>
    )
};

export default CounterResult;
