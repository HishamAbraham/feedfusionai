import React, { useState, useEffect } from "react";
import "../css/FeedForm.css"; // Create a CSS file for any styles for your form

const FeedForm = ({ feed, onSubmit, onCancel }) => {
  // Initialize state from the feed prop if available, otherwise use empty strings.
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // When editing, pre-populate the fields with the provided feed data.
  useEffect(() => {
    if (feed) {
      setTitle(feed.title || "");
      setUrl(feed.url || "");
    }
  }, [feed]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create an object with the current form values
    const feedData = { title, url };
    onSubmit(feedData); // Pass data to the parent component (which handles either add or update)
  };

  return (
    <div className="feed-form-container">
      <h2>{feed ? "Edit Feed" : "Add New Feed"}</h2>
      <form onSubmit={handleSubmit} className="feed-form">
        <div className="form-group">
          <label htmlFor="feedTitle">Title:</label>
          <input
            id="feedTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter feed title"
            required
          />
        </div>
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
          {onCancel && (
            <button type="button" className="btn btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FeedForm;