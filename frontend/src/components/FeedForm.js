// src/components/FeedForm.js
import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";
import "../css/FeedForm.css";

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
      <div className="feed-form-container">
        <h2>{feed ? "Edit Feed" : "Add New Feed"}</h2>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="feed-form">
          {feed && (
              <div className="form-group">
                <label>Title:</label>
                <input type="text" value={feed.title} disabled />
              </div>
          )}

          <div className="form-group">
            <label htmlFor="feedUrl">URL:</label>
            <input
                id="feedUrl"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter feed URL"
                required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-submit">
              {feed ? "Update Feed" : "Add Feed"}
            </button>
            <button
                type="button"
                className="btn btn-cancel"
                onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
  );
};

export default FeedForm;