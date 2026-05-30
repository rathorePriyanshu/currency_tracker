import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CurrencyRates from './pages/CurrencyRates';

function App() {
  const [activePage, setActivePage] = useState('Rates');

  const renderContent = () => {
    switch (activePage) {
      case 'Rates':
        return <CurrencyRates />;
      case 'Dashboard':
      case 'Payments':
      case 'Reports':
      default:
        return (
          <div className="flex-1 p-6 md:p-10 bg-slate-50 min-h-screen flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">{activePage} Panel</h1>
            <p className="text-sm text-slate-400 mt-1">This section is a visual placeholder inside the dashboard structure.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row w-full font-sans antialiased text-slate-800">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      {renderContent()}
    </div>
  );
}

export default App;