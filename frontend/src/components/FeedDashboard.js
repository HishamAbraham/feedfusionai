// src/components/FeedDashboard.js
import React, { useState, useEffect } from "react";
import FeedForm from "./FeedForm";
import "../css/FeedDashboard.css";

function FeedDashboard({ onSelectFeed, refreshTrigger }) {
  const [feeds, setFeeds] = useState([]);
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [currentFeed, setCurrentFeed] = useState(null);

  const fetchFeeds = () => {
    fetch("http://localhost:8080/api/feeds")
        .then((res) => res.json())
        .then(setFeeds)
        .catch((err) => console.error("Failed to fetch feeds", err));
  };

  useEffect(fetchFeeds, [refreshTrigger]);

  const handleEditFeed = (feed, e) => {
    e.stopPropagation();
    setCurrentFeed(feed);
    setShowFeedForm(true);
  };

  const handleFormSubmit = (feedData) => {
    const method = currentFeed ? "PATCH" : "POST";
    const url = currentFeed
        ? `http://localhost:8080/api/feeds/${currentFeed.id}`
        : "http://localhost:8080/api/feeds";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedData),
    })
        .then((res) => res.json())
        .then(() => {
          setShowFeedForm(false);
          fetchFeeds();
        })
        .catch((err) => console.error("Failed to save feed", err));
  };

  const handleCancelForm = () => setShowFeedForm(false);

  const handleDeleteFeed = (feedId, e) => {
    e.stopPropagation();
    fetch(`http://localhost:8080/api/feeds/${feedId}`, { method: "DELETE" })
        .then(() => fetchFeeds())
        .catch((err) => console.error("Failed to delete feed", err));
  };

  return (
      <div className="dashboard">
        <div className="feeds">
          <h2>Your Feeds</h2>

          {showFeedForm && (
              <div className="feed-form-modal">
                <FeedForm
                    feed={currentFeed}
                    onSuccess={() => {
                      fetchFeeds();
                      setShowFeedForm(false);
                    }}
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
                        {feed.imageUrl && (
                            <img
                                src={feed.imageUrl}
                                alt={feed.title}
                                className="feed-image"
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}
                        <div className="feed-text">
                          <h3 className="feed-title">
                            {feed.title}
                            {feed.unreadCount !== undefined && (
                                <span className="unread-count">
                          ({feed.unreadCount} unread)
                        </span>
                            )}
                          </h3>
                          {feed.description && (
                              <p className="feed-description">
                                {feed.description}
                              </p>
                          )}
                          <p className="feed-fetched">
                            Last Fetched:{" "}
                            {feed.lastFetched
                                ? new Date(feed.lastFetched).toLocaleString()
                                : "N/A"}
                          </p>
                          {feed.link && (
                              <a
                                  href={feed.link}
                                  className="feed-home-link"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                              >
                                Visit site →
                              </a>
                          )}
                        </div>
                      </div>

                      <div className="feed-card-actions">
                        <button
                            className="icon-button edit-btn"
                            onClick={(e) => handleEditFeed(feed, e)}
                            title="Edit Feed"
                        >
                          Edit
                        </button>
                        <button
                            className="icon-button delete-btn"
                            onClick={(e) => handleDeleteFeed(feed.id, e)}
                            title="Delete Feed"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}

export default FeedDashboard;