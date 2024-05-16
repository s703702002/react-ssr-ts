import ReactLink from "./ReactLink";
import ViteLink from "./ViteLink";
import "./App.css";
import CountButton from "./CountButton";

function App() {
  return (
    <>
      <div>
        <ViteLink />
        <ReactLink />
      </div>
      <h1>Vite + React + TS</h1>
      <div className="card">
        <CountButton />

        <button
          onClick={() => {
            fetch("/api/test");
          }}
        >
          fetch
        </button>

        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;