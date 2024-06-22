import logo from './logo.svg';
import './App.css';



function App() {
  
  return (
    <div className="App">
      <header className="Apfsdfsdp-heabfbvcder">
        
        <img src={logo} className="App-logo" alt="logo" />
        <div className="flex gap-5 justify-center px-20 py-14 text-xl font-medium leading-8 text-black bg-white max-md:flex-wrap max-md:px-5">
      <div className="flex-auto my-auto">PARLAY CAFE</div>
      <div className="flex gap-5 items-center whitespace-nowrap">
        <button
          className="box-border relative shrink-0 px-6 py-4 ml-5 text-center rounded appearance-none cursor-pointer bg-[black] text-[white]"
          openLinkInNewTab={false}
        >
          Click me!

        </button>
        <div className="div">
        <div className="div-2">PARLAY CAFE</div>
        <div className="div-3">
          <button className="button" openLinkInNewTab={false}>
            Click me!
          </button>
          <div className="div-4">Page1</div>
          <div className="div-5">Page2</div>
          <div className="div-6">Page3</div>
          <div className="div-7">XY</div>
        </div>
      </div>
      <style jsx>{`
        .div {
          justify-content: center;
          background-color: #fff;
          display: flex;
          gap: 20px;
          font-size: 20px;
          color: #000;
          font-weight: 500;
          line-height: 150%;
          padding: 56px 80px;
        }
        @media (max-width: 991px) {
          .div {
            flex-wrap: wrap;
            padding: 0 20px;
          }
        }
        .div-2 {
          font-family: Inter, sans-serif;
          flex-grow: 1;
          flex-basis: auto;
          margin: auto 0;
        }
        .div-3 {
          justify-content: end;
          align-items: center;
          display: flex;
          gap: 20px;
          white-space: nowrap;
        }
        @media (max-width: 991px) {
          .div-3 {
            white-space: initial;
          }
        }
        .button {
          all: unset;
          display: flex;
          flex-direction: column;
          position: relative;
          margin-left: 20px;
          appearance: none;
          background-color: black;
          color: white;
          border-radius: 4px;
          text-align: center;
          cursor: pointer;
          padding: 15px 25px;
        }
        .div-4 {
          font-family: Inter, sans-serif;
          align-self: stretch;
          margin: auto 0;
        }
        .div-5 {
          font-family: Inter, sans-serif;
          align-self: stretch;
          margin: auto 0;
        }
        .div-6 {
          font-family: Inter, sans-serif;
          align-self: stretch;
          margin: auto 0;
        }
        .div-7 {
          justify-content: center;
          border-radius: var(--Spacing-XS, 8px);
          box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
          background-color: #000;
          align-self: stretch;
          color: #fff;
          padding: 14px 24px;
          font: 16px Inter, sans-serif;
        }
        @media (max-width: 991px) {
          .div-7 {
            white-space: initial;
            padding: 0 20px;
          }
        }
      `}</style>
        <div className="self-stretch my-auto">Page1</div>
        <div className="self-stretch my-auto">Page2</div>
        <div className="self-stretch my-auto">Page3</div>
        <div className="justify-center self-stretch px-6 py-3.5 text-base text-white bg-black rounded-lg shadow-sm max-md:px-5">
          XY
        </div>
      </div>
    </div>
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

export default App;
