// src/components/FeedItemList.js
import React, { useState, useEffect } from "react";
import "../css/FeedItemList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faCheck, faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { sanitizeAndTransform } from "../utils/sanitizeHtml";

function FeedItemList({ feedId }) {
  const [feedItems, setFeedItems] = useState([]);
  const [feedTitle, setFeedTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewReadOnly, setViewReadOnly] = useState(false);
  const [viewStarredOnly, setViewStarredOnly] = useState(false);

  // Determine the API URL based on the starred toggle.
  const feedItemsUrl =
    viewStarredOnly
      ? `http://localhost:8080/api/feed-items/for-feed/${feedId}/starred`
      : `http://localhost:8080/api/feed-items/for-feed/${feedId}`;

  // Fetch feed items when feedId or feedItemsUrl changes.
  useEffect(() => {
    if (!feedId) return;
    setLoading(true);
    fetch(feedItemsUrl)
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
  }, [feedId, feedItemsUrl]);

  // Fetch feed details to get the feed title.
  useEffect(() => {
    if (!feedId) return;
    if (feedId === "starred") {
      setFeedTitle("Starred Feeds");
      return;
    }
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

  // Function to mark a single feed item as read.
  const markItemAsRead = (itemId) => {
    const updatedItems = feedItems.map((item) =>
      item.id === itemId ? { ...item, read: true } : item
    );
    setFeedItems(updatedItems);
    fetch(`http://localhost:8080/api/feed-items/${itemId}/mark-read`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    }).catch((err) =>
      console.error("Failed to update feed item as read", err)
    );
  };

  // Function to mark all feed items as read.
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

  // Toggle the view filter between read and unread items.
  const toggleView = () => {
    setViewReadOnly((prev) => !prev);
  };

  // Toggle starred view.
  const toggleStarredView = () => {
    setViewStarredOnly((prev) => !prev);
  };

  // When in starred view, show all starred items; otherwise, filter based on read status.
  const displayedItems = viewStarredOnly
    ? feedItems
    : feedItems.filter((item) => (viewReadOnly ? item.read : !item.read));

  // Function to toggle the star status of an item.
  const toggleStar = (itemId) => {
    fetch(`http://localhost:8080/api/feed-items/${itemId}/toggle-star`, {
      method: "PATCH"
    })
      .then(() => {
        const updatedItems = feedItems.map((i) =>
          i.id === itemId ? { ...i, starred: !i.starred } : i
        );
        setFeedItems(updatedItems);
      })
      .catch((err) => console.error("Failed to toggle star", err));
  };

  // Helper function to render the description with sanitization.
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
          <button className="btn btn-toggle-starred" onClick={toggleStarredView}>
            {viewStarredOnly ? "View All Items" : "View Starred Only"}
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
                <small>
                  {new Date(item.publishedDate).toLocaleString()}
                </small>
              </p>
              {/* Toolbar with icon buttons for item actions */}
              <div className="feed-item-toolbar">
                <button
                  className="toolbar-button btn-read-more"
                  title="Read More"
                  onClick={() =>
                    window.open(item.feedLink, "_blank", "noopener,noreferrer")
                  }
                >
                  <FontAwesomeIcon icon={faBookOpen} />
                </button>
                {!item.read && (
                  <button
                    className="toolbar-button btn-mark-read"
                    title="Mark as Read"
                    onClick={() => markItemAsRead(item.id)}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                )}
                <button
                  className="toolbar-button btn-toggle-star"
                  title={item.starred ? "Unstar" : "Star"}
                  onClick={() => toggleStar(item.id)}
                >
                  <FontAwesomeIcon
                    icon={item.starred ? solidStar : regularStar}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedItemList;