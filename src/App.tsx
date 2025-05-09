import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from './contexts/AppContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Compare from './pages/Compare';
import Battle from './pages/Battle';
import Settings from './pages/Settings';
import Export from './pages/Export';
import Voice from './pages/Voice';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Provider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/battle" element={<Battle />} />
            <Route path="/export" element={<Export />} />
            <Route path="/voice" element={<Voice />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;