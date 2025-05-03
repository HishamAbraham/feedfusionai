// src/components/FeedForm.js
import React, { useState, useEffect } from "react";

import { API_BASE } from "../config";

const FeedForm = ({ feed, onSuccess, onCancel }) => {
  // Only store the URL in local state; title comes from the backend
  const [url, setUrl] = useState(feed?.url || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (feed) {
      setUrl(feed.url);
    }
  }, [feed]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Decide endpoint + method
    const apiUrl = feed
        ? `${API_BASE}/feeds/${feed.id}`
        : `${API_BASE}/feeds`;
    const method = feed ? "PATCH" : "POST";

    try {
      const res = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        // try to parse a message, or fallback to status
        const text = await res.text();
        throw new Error(text || `${res.status} ${res.statusText}`);
      }
      // Success! notify parent to reload list, then close the form
      onSuccess();
      onCancel();
    } catch (err) {
      // Show the error in the form, let user correct URL
      setError(err.message);
    }
  };

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{feed ? "Edit Feed" : "Add New Feed"}</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form id="feed-form" onSubmit={handleSubmit}>
              {feed && (
                <div className="mb-3">
                  <label className="form-label">Title:</label>
                  <input type="text" className="form-control" value={feed.title} disabled />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="feedUrl" className="form-label">URL:</label>
                <input
                  id="feedUrl"
                  type="url"
                  className="form-control"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter feed URL"
                  required
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" form="feed-form" className="btn btn-primary">
              {feed ? "Update Feed" : "Add Feed"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedForm;