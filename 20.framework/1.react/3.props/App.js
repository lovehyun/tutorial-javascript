import './App.css';
import Counter from './Counter';

function App() {
  const number = 5;

  const counterProps = {
    a: 1,
    b: 2,
    c: 3,
    num: number,
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>안녕 리엑트</h1>
        {/* <Counter num={number} /> */}
        <Counter {...counterProps} />
      </header>
    </div>
  );
}

export default App;
