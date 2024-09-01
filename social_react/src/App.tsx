
import { Routes, Route } from 'react-router-dom';
import './assets/css/styles.css';
import Login from './Login';
import { ToastContainer } from 'react-toastify';
import HomePage from './pages/HomePage';

function App() {
  return (<>
    <div className="App">
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
    </div>
    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
        {/* Same as */}
    <ToastContainer />
  </>);
}

export default App;
