import './App.css';
import Counter from './Counter';
import Container from './Container';

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
          <Container>
            <h1>안녕 리엑트</h1>
            {/* <Counter num={ number } /> */}
            <Counter {...counterProps} />
          </Container>
        </header>
    </div>
  );
}

export default App;
