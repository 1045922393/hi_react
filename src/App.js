import logo from "./logo.svg";
import "./App.css";
import { getPic } from "./api/getPic";
import React from "react";


class App extends React.Component {
  async componentDidMount() {
    const res = await getPic("100");
    
    console.log(
      "Debugger ~ file: App.js:9 ~ App ~ componentDidMount ~ res:",
      res,
    );
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          {res.map(item=>{
            return <img src={item.path} />
          })}
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
