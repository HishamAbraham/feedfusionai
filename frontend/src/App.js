// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import FeedDashboard from "./components/FeedDashboard";
import FeedItemList from "./components/FeedItemList";
import FeedForm from "./components/FeedForm";
import "./css/App.css"; // Global CSS

function App() {
  const [selectedFeedId, setSelectedFeedId] = useState(null);
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [editingFeed, setEditingFeed] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddFeed = () => {
    setEditingFeed(null);
    setShowFeedForm(true);
  };

  const handleRefreshFeeds = () => {
    fetch("http://localhost:8080/api/feeds/refresh", { method: "PATCH" })
      .then((res) => {
        if (!res.ok) throw new Error("Refresh failed");
        return res.json();
      })
      .then((data) => {
        console.log("Refresh response:", data);
        setRefreshTrigger((prev) => prev + 1);
      })
      .catch((err) => console.error("Failed to refresh feeds", err));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleFormSubmit = (feedData) => {
    if (editingFeed) {
      fetch(`http://localhost:8080/api/feeds/${editingFeed.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedData),
      })
        .then((res) => res.json())
        .then(() => {
          setShowFeedForm(false);
          setRefreshTrigger((prev) => prev + 1);
        })
        .catch((err) => console.error("Failed to update feed", err));
    } else {
      fetch("http://localhost:8080/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedData),
      })
        .then((res) => res.json())
        .then(() => {
          setShowFeedForm(false);
          setRefreshTrigger((prev) => prev + 1);
        })
        .catch((err) => console.error("Failed to add feed", err));
    }
  };

  const handleCancelForm = () => setShowFeedForm(false);

  return (
    <Router>
      <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
        <Header
          onAddFeed={handleAddFeed}
          onRefreshFeeds={handleRefreshFeeds}
          onToggleDarkMode={toggleDarkMode} // Pass dark mode toggle function to header
        />
        {showFeedForm && (
          <div className="modal-overlay">
            <FeedForm
              feed={editingFeed}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
            />
          </div>
        )}
        <div className="panels">
          <div className="left-panel">
            <FeedDashboard onSelectFeed={setSelectedFeedId} refreshTrigger={refreshTrigger} />
          </div>
          <div className="right-panel">
            {selectedFeedId ? (
              <FeedItemList feedId={selectedFeedId} />
            ) : (
              <div className="placeholder">
                <h2>Select a feed to see its items</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;