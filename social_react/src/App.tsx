
import { Routes, Route } from 'react-router-dom';
import './assets/css/styles.css';
import Login from './Login';
import { ToastContainer } from 'react-toastify';
import HomePage from './pages/HomePage';
import { AuthRoute, PrivateRoute } from './routers/protectRouter';
import Messeager from './pages/Messeager';
import { WebSocketProvider } from './WebSocket/WebSocketProvider';
import Profile from './pages/Profile';
import { UserProvider } from './components/UserContext/UserContext';
import { EmotionProvider } from './components/UserContext/EmotionByUserContext';


function App() {
  return (
    <WebSocketProvider>
      <UserProvider>
        <EmotionProvider>
          <div className="App">
            <Routes>
              {/* khi đã đăng nhập thì không đueọc vào trang Login */}
              <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
              {/* Chỉ có thể vào trang feed nếu đã đăng nhập */}
              <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
              <Route path="/home/messager" element={<PrivateRoute><Messeager /></PrivateRoute>} />
              <Route path="/profile/:userId" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
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
        </EmotionProvider>
      </UserProvider>
    </WebSocketProvider>
  );
}

export default App;
