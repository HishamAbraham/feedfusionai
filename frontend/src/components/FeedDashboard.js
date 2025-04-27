// src/components/FeedDashboard.js
import React, { useState, useEffect } from "react";
import FeedForm from "./FeedForm";
import {API_BASE} from "../config";

function FeedDashboard({ onSelectFeed, refreshTrigger, darkMode }) {
  const [feeds, setFeeds] = useState([]);
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [currentFeed, setCurrentFeed] = useState(null);

  const fetchFeeds = () => {
    fetch(`${API_BASE}/feeds`)
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
        ? `${API_BASE}/feeds/${currentFeed.id}`
        : `${API_BASE}api/feeds`;

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
    fetch(`${API_BASE}/feeds/${feedId}`, { method: "DELETE" })
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
                      className={`card mb-3 shadow-sm ${darkMode ? "bg-dark text-light" : "bg-white text-dark"}`}
                      onClick={() => onSelectFeed && onSelectFeed(feed.id)}
                    >
                      <div className={`card-body ${darkMode ? "bg-dark text-light" : ""}`}>
                        <div className="d-flex align-items-center">
                          {feed.imageUrl && (
                            <img
                              src={feed.imageUrl}
                              alt={feed.title}
                              className="me-3"
                              style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                          <div className="flex-grow-1">
                            <h5 className="card-title mb-1">
                              {feed.title}
                              {feed.unreadCount !== undefined && (
                                <span className="text-danger ms-2">
                                  ({feed.unreadCount} unread)
                                </span>
                              )}
                            </h5>
                            {feed.description && (
                              <p className="card-text small mb-1">
                                {feed.description}
                              </p>
                            )}
                            <small className="text-muted">
                              Last Fetched: {feed.lastFetched ? new Date(feed.lastFetched).toLocaleString() : "N/A"}
                            </small>
                            {feed.link && (
                              <div>
                                <a
                                  href={feed.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="small d-block mt-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Visit site →
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="ms-auto text-end">
                            <button
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={(e) => handleEditFeed(feed, e)}
                              title="Edit Feed"
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={(e) => handleDeleteFeed(feed.id, e)}
                              title="Delete Feed"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
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