// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Welcome to Malawi Irrigation Scheduler</h1>
      <img src={process.env.PUBLIC_URL + '/zones.png'} alt="Zones" 
      style={{ width: '300px', height: 'auto' }}/>
    </div>
  );
}

export default App;