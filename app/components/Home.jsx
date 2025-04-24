import React from 'react';
import Feed from './Feed';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1">
        <Feed />
      </main>
    </div>
  );
};

export default Home; 