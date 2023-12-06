import './App.css';

import MyHeader from "./MyHeader";
import MyFooter from "./MyFooter";

function App() {
  let name = "user";

  const style = {
    App: {
      backgroundColor: "black",
      color: "white",
    },
    h2: {
      color: "red",
    },
    my_text: {
      color: "green",
    }

  }

  return (
    <div className="App" style={style.App}>
      <MyHeader />
      <header className="App-header">
        <h1>안녕 리엑트, {name}</h1>
        <h2 style={style.h2}>Header2</h2>
        <p style={style.my_text}>Welcome to React-class</p>
      </header>
      <MyFooter />
    </div>
  );
}

export default App;
