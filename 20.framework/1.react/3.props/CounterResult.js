// const CounterResult = ({ num }) => {
//     let result;

//     if (num % 2 === 0) {
//         result = "Even";
//     } else {
//         result = "Odd";
//     }

//     console.log(num);

//     return (
//         <div>
//             {result}
//         </div>
//     );
// };

const CounterResult = ({ num }) => {
    console.log(num);
    return (
        <div>
            { num % 2 === 0 ? "Even" : "Odd" }
        </div>
    )
};

export default CounterResult;
