import React, { useState, useEffect } from "react";
import "../css/FeedItemList.css";
import { sanitizeAndTransform } from "../utils/sanitizeHtml";

function FeedItemList({ feedId }) {
  const [feedItems, setFeedItems] = useState([]);
  const [feedTitle, setFeedTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch feed items for the given feedId
  useEffect(() => {
    if (!feedId) return;
    setLoading(true);
    fetch(`http://localhost:8080/api/feed-items/for-feed/${feedId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
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

  if (loading) {
    return <div>Loading feed items...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="feed-item-list">
      <h2>Feed Items for {feedTitle || "Feed"}</h2>
      {feedItems.length === 0 ? (
        <p>No feed items to display.</p>
      ) : (
        <ul>
          {feedItems.map((item) => (
            <li key={item.id} className="feed-item">
              <h3>{item.title || "No Title Available"}</h3>
              <div className="item-description">
                {sanitizeAndTransform(item.description)}
              </div>
              <p>
                <small>{new Date(item.publishedDate).toLocaleString()}</small>
              </p>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                Read More
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FeedItemList;