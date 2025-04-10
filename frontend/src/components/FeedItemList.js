// src/components/FeedItemList.js
import React, { useState, useEffect } from "react";
import "../css/FeedItemList.css";
import { sanitizeAndTransform } from "../utils/sanitizeHtml";

function FeedItemList({ feedId }) {
  const [feedItems, setFeedItems] = useState([]);
  const [feedTitle, setFeedTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewReadOnly, setViewReadOnly] = useState(false);

  useEffect(() => {
    if (!feedId) return;
    setLoading(true);
    fetch(`http://localhost:8080/api/feed-items/for-feed/${feedId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok for feed items");
        }
        return res.json();
      })
      .then((data) => {
        setFeedItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch feed items", err);
        setError(err.message);
        setLoading(false);
      });
  }, [feedId]);

  // Fetch feed details to get the feed title
  useEffect(() => {
    if (!feedId) return;
    fetch(`http://localhost:8080/api/feeds/${feedId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok for feed details");
        }
        return res.json();
      })
      .then((data) => setFeedTitle(data.title))
      .catch((err) => {
        console.error("Failed to fetch feed details", err);
      });
  }, [feedId]);

  const markItemAsRead = (itemId) => {
    const updatedItems = feedItems.map((item) =>
      item.id === itemId ? { ...item, read: true } : item
    );
    setFeedItems(updatedItems);
    fetch(`http://localhost:8080/api/feed-items/${itemId}/mark-read`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    }).catch((err) => console.error("Failed to update feed item as read", err));
  };

  const markAllAsRead = () => {
    const updatedItems = feedItems.map((item) => ({ ...item, read: true }));
    setFeedItems(updatedItems);
    updatedItems.forEach((item) => {
      fetch(`http://localhost:8080/api/feed-items/${item.id}/mark-read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      }).catch((err) =>
        console.error("Failed to mark feed item as read:", err)
      );
    });
  };

  const toggleView = () => {
    setViewReadOnly((prev) => !prev);
  };

  const displayedItems = feedItems.filter((item) =>
    viewReadOnly ? item.read : !item.read
  );

  const renderDescription = (description) => {
    if (typeof description === "string") {
      return sanitizeAndTransform(description);
    } else if (description && typeof description === "object") {
      if (description.value) {
        return sanitizeAndTransform(description.value);
      }
      return sanitizeAndTransform(JSON.stringify(description));
    }
    return "";
  };

  if (loading) return <div>Loading feed items...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="feed-item-list">
      <header className="feed-item-list-header">
        <h2>Feed Items for {feedTitle || "Feed"}</h2>
        <div className="feed-item-list-buttons">
          <button className="btn btn-mark-read" onClick={markAllAsRead}>
            Mark All As Read
          </button>
          <button className="btn btn-toggle-view" onClick={toggleView}>
            {viewReadOnly ? "View Unread" : "View Read"}
          </button>
        </div>
      </header>
      {displayedItems.length === 0 ? (
        <p>No feed items to display.</p>
      ) : (
        <div className="feed-card-container">
          {displayedItems.map((item) => (
            <div key={item.id} className="feed-item-card">
              <h3>{item.title || "No Title Available"}</h3>
              <div className="item-description">
                {renderDescription(item.description)}
              </div>
              <p>
                <small>{new Date(item.publishedDate).toLocaleString()}</small>
              </p>
              <div className="feed-item-card-actions">
                <button
                  className="btn btn-read-more"
                  onClick={() =>
                    window.open(item.feedLink, "_blank", "noopener,noreferrer")
                  }
                >
                  Open Link
                </button>
                {!item.read && (
                  <button
                    className="btn btn-mark-read-individual"
                    onClick={() => markItemAsRead(item.id)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedItemList;