// src/components/FeedDashboard.js
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import FeedForm from "./FeedForm";
import { API_BASE } from "../config";

function FeedDashboard({ onSelectFeed, refreshTrigger, darkMode }) {
  const [feeds, setFeeds] = useState([]);
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [currentFeed, setCurrentFeed] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFeeds = () => {
    setLoading(true);
    fetch(`${API_BASE}/feeds`)
        .then((res) => res.json())
        .then((data) => {
          setFeeds(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch feeds", err);
          setLoading(false);
        });
  };

  useEffect(fetchFeeds, [refreshTrigger]);

  const handleEditFeed = (feed, e) => {
    e.stopPropagation();
    setCurrentFeed(feed);
    setShowFeedForm(true);
  };

  const handleCancelForm = () => setShowFeedForm(false);

  const handleDeleteFeed = (feedId, e) => {
    e.stopPropagation();
    fetch(`${API_BASE}/feeds/${feedId}`, { method: "DELETE" })
        .then(() => fetchFeeds())
        .catch((err) => console.error("Failed to delete feed", err));
  };

  return (
      <div className={darkMode ? "bg-dark text-light" : "bg-white text-dark"}>
        <div className="card-body p-3">
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

          {loading && !showFeedForm && (
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading feeds...</span>
              </div>
            </div>
          )}

          {!loading && feeds.length === 0 && !showFeedForm && (
            <div className="alert alert-info text-center">No feeds found. Add a new feed!</div>
          )}

          {!loading && feeds.length > 0 && (
              <div className="vstack gap-1">
                {feeds.map((feed) => (
                    <div
                      key={feed.id}
                      className={`card py-2 px-2 shadow-sm ${darkMode ? "bg-dark text-light" : ""}`}
                      onClick={() => onSelectFeed && onSelectFeed(feed.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center justify-content-between" style={{ minWidth: 0 }}>
                        {/* Feed Icon and Unread Count on first line */}
                        <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: 0 }}>
                          {feed.imageUrl && (
                            <img
                              src={feed.imageUrl}
                              alt={feed.title}
                              className="me-2 flex-shrink-0"
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px' }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                          {feed.unreadCount !== undefined && (
                            <span className="text-danger small flex-shrink-0">
                              ({feed.unreadCount} unread)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Second line: Feed Title */}
                      <div className="mt-1">
                        <h6 className="mb-0 text-truncate" style={{ maxWidth: "100%" }}>
                          {feed.title}
                        </h6>
                      </div>

                      {/* Third line: Edit/Delete Buttons */}
                      <div className="d-flex justify-content-end mt-2 gap-2">
                        <button
                          className="btn sidebar-action-button btn-light border"
                          title="Edit Feed"
                          onClick={(e) => handleEditFeed(feed, e)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="btn sidebar-action-button btn-light border"
                          title="Delete Feed"
                          onClick={(e) => handleDeleteFeed(feed.id, e)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
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