import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FeedForm from "./FeedForm"; // Ensure you have FeedForm component implemented
import "../css/FeedDashboard.css";

function FeedDashboard({ onSelectFeed, refreshTrigger }) {
  const [feeds, setFeeds] = useState([]);
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [currentFeed, setCurrentFeed] = useState(null);

  // Function to load feeds (GET /api/feeds)
  const fetchFeeds = () => {
    fetch("http://localhost:8080/api/feeds")
      .then((res) => res.json())
      .then((data) => setFeeds(data))
      .catch((err) => console.error("Failed to fetch feeds", err));
  };

  // Fetch feeds on mount and whenever refreshTrigger changes.
  useEffect(() => {
    fetchFeeds();
  }, [refreshTrigger]);

  // When "Add Feed" is clicked, clear the currentFeed and open the form.
  const handleAddFeed = () => {
    setCurrentFeed(null);
    setShowFeedForm(true);
  };

  // When "Edit" is clicked, set the currentFeed to populate the form.
  const handleEditFeed = (feed, event) => {
    event.stopPropagation();
    setCurrentFeed(feed);
    setShowFeedForm(true);
  };

  // When the form is submitted, perform an API call.
  const handleFormSubmit = (feedData) => {
    if (currentFeed) {
      // In edit mode, update the feed via PATCH.
      fetch(`http://localhost:8080/api/feeds/${currentFeed.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedData),
      })
        .then((res) => res.json())
        .then(() => {
          setShowFeedForm(false);
          fetchFeeds();
        })
        .catch((err) => console.error("Failed to update feed", err));
    } else {
      // In add mode, create a new feed via POST.
      fetch("http://localhost:8080/api/feeds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedData),
      })
        .then((res) => res.json())
        .then(() => {
          setShowFeedForm(false);
          fetchFeeds();
        })
        .catch((err) => console.error("Failed to add feed", err));
    }
  };

  const handleCancelForm = () => {
    setShowFeedForm(false);
  };

  // Delete a feed.
  const handleDeleteFeed = (feedId, event) => {
    event.stopPropagation();
    fetch(`http://localhost:8080/api/feeds/${feedId}`, { method: "DELETE" })
      .then(() => fetchFeeds())
      .catch((err) => console.error("Failed to delete feed", err));
  };

  return (
    <div className="feeds">
      <h2>Your Subscriptions</h2>
      {showFeedForm && (
        <div className="feed-form-modal">
          <FeedForm
            feed={currentFeed}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        </div>
      )}
      {feeds.length === 0 ? (
        <p>No feeds found.</p>
      ) : (
        <div className="feed-card-container">
          {feeds.map((feed) => (
            <div
              key={feed.id}
              className="feed-card"
              onClick={() => onSelectFeed && onSelectFeed(feed.id)}
            >
              <div className="feed-card-content">
                <h3 className="feed-title">{feed.title}</h3>
                <p className="feed-fetched">
                  Last Fetched:{" "}
                  {feed.lastFetched
                    ? new Date(feed.lastFetched).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div className="feed-card-actions">
                <button
                  className="btn btn-edit"
                  onClick={(e) => handleEditFeed(feed, e)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-delete"
                  onClick={(e) => handleDeleteFeed(feed.id, e)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedDashboard;