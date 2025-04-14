// src/components/FeedDashboard.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import FeedForm from "./FeedForm"; // Ensure FeedForm exists
import "../css/FeedDashboard.css";

function FeedDashboard({ onSelectFeed, refreshTrigger }) {
  const [feeds, setFeeds] = useState([]);
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [currentFeed, setCurrentFeed] = useState(null);

  // Fetch feeds from the backend.
  const fetchFeeds = () => {
    fetch("http://localhost:8080/api/feeds")
      .then((res) => res.json())
      .then((data) => setFeeds(data))
      .catch((err) => console.error("Failed to fetch feeds", err));
  };

  // Re-fetch feeds on mount and when refreshTrigger changes.
  useEffect(() => {
    fetchFeeds();
  }, [refreshTrigger]);

  // Handle editing a feed (open form with existing data).
  const handleEditFeed = (feed, e) => {
    e.stopPropagation();
    setCurrentFeed(feed);
    setShowFeedForm(true);
  };

  // Handle form submission for adding or editing.
  const handleFormSubmit = (feedData) => {
    if (currentFeed) {
      // Editing mode: update the feed using PATCH.
      fetch(`http://localhost:8080/api/feeds/${currentFeed.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedData),
      })
        .then((res) => res.json())
        .then(() => {
          setShowFeedForm(false);
          fetchFeeds();
        })
        .catch((err) => console.error("Failed to update feed", err));
    } else {
      // Adding mode: create a new feed using POST.
      fetch("http://localhost:8080/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // Cancel showing the feed form.
  const handleCancelForm = () => setShowFeedForm(false);

  // Delete a feed.
  const handleDeleteFeed = (feedId, e) => {
    e.stopPropagation();
    fetch(`http://localhost:8080/api/feeds/${feedId}`, { method: "DELETE" })
      .then(() => fetchFeeds())
      .catch((err) => console.error("Failed to delete feed", err));
  };

  return (
    <div className="feeds">
      <h2>Your Feeds</h2>
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
              <Link to={`/feed/${feed.id}`} className="feed-link">
                <div className="feed-card-content">
                  <h3 className="feed-title">
                    {feed.title}{" "}
                    {feed.unreadCount !== undefined && (
                      <span className="unread-count">
                        ({feed.unreadCount} unread)
                      </span>
                    )}
                  </h3>
                  <p className="feed-fetched">
                    Last Fetched:{" "}
                    {feed.lastFetched
                      ? new Date(feed.lastFetched).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </Link>
              <div className="feed-card-actions">
                <button
                  className="icon-button edit-btn"
                  onClick={(e) => handleEditFeed(feed, e)}
                  title="Edit Feed"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="icon-button delete-btn"
                  onClick={(e) => handleDeleteFeed(feed.id, e)}
                  title="Delete Feed"
                >
                  <FontAwesomeIcon icon={faTrash} />
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