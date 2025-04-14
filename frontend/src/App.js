import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import FeedDashboard from "./components/FeedDashboard";
import FeedItemList from "./components/FeedItemList";
import FeedForm from "./components/FeedForm";
import "./css/App.css"; // Ensure this path matches your project structure

function App() {
  const [selectedFeedId, setSelectedFeedId] = useState(null);
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [editingFeed, setEditingFeed] = useState(null); // For future editing
  // This counter will be used to refresh the FeedDashboard component
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to handle adding a new feed; in add mode, editingFeed is null.
  const handleAddFeed = () => {
    setEditingFeed(null);
    setShowFeedForm(true);
  };

  // Function to handle refreshing feeds.
  const handleRefreshFeeds = () => {
    fetch("http://localhost:8080/api/feeds/refresh", { method: "PATCH" })
      .then((res) => {
        if (!res.ok) throw new Error("Refresh failed");
        return res.json();
      })
      .then((data) => {
        console.log("Refresh response:", data);
        // Increase the refresh counter to notify FeedDashboard to re-fetch feeds
        setRefreshTrigger((prev) => prev + 1);
      })
      .catch((err) => console.error("Failed to refresh feeds", err));
  };

  // When the feed form is submitted, call this function.
  // In a real app, you might want to re-fetch the feeds afterward.
  const handleFormSubmit = (feedData) => {
    if (editingFeed) {
      // Edit existing feed (PATCH)
      fetch(`http://localhost:8080/api/feeds/${editingFeed.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedData),
      })
        .then((res) => res.json())
        .then(() => {
          setShowFeedForm(false);
          // Trigger dashboard refresh
          setRefreshTrigger((prev) => prev + 1);
        })
        .catch((err) => console.error("Failed to update feed", err));
    } else {
      // Add new feed (POST)
      fetch("http://localhost:8080/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedData),
      })
        .then((res) => res.json())
        .then(() => {
          setShowFeedForm(false);
          // Trigger dashboard refresh
          setRefreshTrigger((prev) => prev + 1);
        })
        .catch((err) => console.error("Failed to add feed", err));
    }
  };

  // Handler for cancelling the form.
  const handleCancelForm = () => setShowFeedForm(false);

  return (
    <Router>
      <div className="app-container">
        <Header onAddFeed={handleAddFeed} onRefreshFeeds={handleRefreshFeeds} />
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
              <FeedItemList feedId={selectedFeedId} setRefreshTrigger={setRefreshTrigger}/>
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