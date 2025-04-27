// src/components/FeedDashboard.js
import React, { useState, useEffect } from "react";
import FeedForm from "./FeedForm";
import { API_BASE } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

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
      <div className={`card h-100 shadow-sm ${darkMode ? "bg-dark text-light" : "bg-white text-dark"}`}>
        <div className="card-body">
          <h5 className="card-title">Your Feeds</h5>

          {showFeedForm && (
              <FeedForm
                  feed={currentFeed}
                  onSuccess={() => {
                    fetchFeeds();
                    setShowFeedForm(false);
                  }}
                  onCancel={handleCancelForm}
              />
          )}

          {feeds.length === 0 && !showFeedForm && (
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading feeds...</span>
              </div>
            </div>
          )}

          {feeds.length === 0 ? (
              <div className="alert alert-info text-center">No feeds found. Add a new feed!</div>
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
                            <div className="d-flex align-items-center flex-wrap mb-1">
                              <h5 className="card-title mb-0">{feed.title}</h5>
                              {feed.unreadCount !== undefined && (
                                <span className="text-danger ms-2 mt-1 mt-md-0 small">
                                  ({feed.unreadCount} unread)
                                </span>
                              )}
                            </div>
                            {feed.description && (
                              <p className="card-text small mb-2">
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
                          <div className="d-flex align-items-center gap-2 ms-auto">
                            <button
                              className="btn btn-sm btn-light border"
                              title="Edit Feed"
                              onClick={(e) => handleEditFeed(feed, e)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="btn btn-sm btn-light border"
                              title="Delete Feed"
                              onClick={(e) => handleDeleteFeed(feed.id, e)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
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