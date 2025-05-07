// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './components/Header';
import FeedDashboard from './components/FeedDashboard';
import FeedItemList from './components/FeedItemList';
import FeedForm from './components/FeedForm';
import { API_BASE } from './config';
import './css/App.css';

function App() {
  const [selectedFeedId, setSelectedFeedId] = useState(null);

  // Add/Edit form modal
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [editingFeed, setEditingFeed] = useState(null);

  // Dark mode toggle
  const [darkMode, setDarkMode] = useState(false);

  // Force-feed-refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Refresh button spinner + result banner
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshResult, setRefreshResult] = useState(null);

  // Sidebar open state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Open blank Add Feed form
  const handleAddFeed = () => {
    setEditingFeed(null);
    setShowFeedForm(true);
  };

  // Open Edit Feed form
  const handleEditFeed = (feed) => {
    setEditingFeed(feed);
    setShowFeedForm(true);
  };

  // Call backend PATCH /api/feeds/refresh, spin icon, show count
  const handleRefreshFeeds = () => {
    setRefreshResult(null);
    setIsRefreshing(true);
    fetch(`${API_BASE}/feeds/refresh`, { method: 'PATCH' })
      .then((res) => {
        if (!res.ok) throw new Error('Refresh failed');
        return res.json();
      })
      .then((newCount) => {
        setIsRefreshing(false);
        setRefreshResult(newCount);
        setRefreshTrigger((prev) => prev + 1);
        // auto-hide the banner after 3s
        setTimeout(() => setRefreshResult(null), 3000);
      })
      .catch((err) => {
        console.error('Failed to refresh feeds', err);
        setIsRefreshing(false);
        setRefreshResult(0); // fallback: show 0 new items if refresh fails
        setTimeout(() => setRefreshResult(null), 3000);
      });
  };

  // Toggle light/dark CSS class on document.body
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      return newMode;
    });
  };

  // Handler passed to FeedForm for both add & edit
  const handleFormSubmit = (feedData) => {
    const method = editingFeed ? 'PATCH' : 'POST';
    const url = editingFeed ? `${API_BASE}/feeds/${editingFeed.id}` : `${API_BASE}/feeds`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Save failed: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setShowFeedForm(false);
        setRefreshTrigger((prev) => prev + 1);
      })
      .catch((err) => {
        console.error('Failed to save feed', err);
      });
  };

  // Close Add/Edit modal
  const handleCancelForm = () => {
    setShowFeedForm(false);
  };

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
          <Header
            onAddFeed={handleAddFeed}
            onRefreshFeeds={handleRefreshFeeds}
            onToggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
            isRefreshing={isRefreshing}
          />
          <div className="flex justify-start m-2">
            <button
              className="px-3 py-1 text-sm border border-gray-500 rounded hover:bg-gray-100 transition"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              {sidebarOpen ? 'Hide Feeds' : 'Show Feeds'}
            </button>
          </div>

          {refreshResult !== null && (
            <div className="text-center text-green-800 bg-green-100 border border-green-200 px-4 py-2 rounded mx-3">
              🚀 {refreshResult} new items added
            </div>
          )}

          {showFeedForm && (
            <FeedForm feed={editingFeed} onSuccess={handleFormSubmit} onCancel={handleCancelForm} />
          )}

          <div className="flex flex-row flex-1 overflow-hidden">
            {/* Sidebar */}
            {sidebarOpen && (
              <div className="w-[280px] flex-shrink-0 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 overflow-y-auto">
                <FeedDashboard
                  onSelectFeed={setSelectedFeedId}
                  onEditFeed={handleEditFeed}
                  refreshTrigger={refreshTrigger}
                  darkMode={darkMode}
                />
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 p-4 overflow-y-auto bg-transparent dark:bg-gray-900">
              {selectedFeedId ? (
                <FeedItemList
                  feedId={selectedFeedId}
                  onItemMarkedRead={() => setRefreshTrigger((prev) => prev + 1)}
                  darkMode={darkMode}
                />
              ) : (
                <div className="text-center text-gray-500 mt-10">
                  <h2 className="text-xl font-medium">Select a feed to see its items</h2>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
