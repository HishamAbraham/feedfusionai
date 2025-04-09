import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/FeedDashboard.css";

function FeedDashboard({ onSelectFeed }) {
  const [feeds, setFeeds] = useState([]);

  const loadFeeds = () => {
    fetch("http://localhost:8080/api/feeds")
      .then((res) => res.json())
      .then((data) => setFeeds(data))
      .catch((err) => console.error("Failed to fetch feeds", err));
  };
  const refreshFeeds = () => {
    fetch("http://localhost:8080/api/feeds/refresh", {
      method: "PATCH",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Refresh failed");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Refresh response:", data);
        // Optionally, you can display the number of new items added by the refresh
        // Now reload the feed list
        loadFeeds();
      })
      .catch((err) => {
        console.error("Failed to refresh feeds", err);
      });
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/feeds")
      .then((res) => res.json())
      .then((data) => setFeeds(data))
      .catch((err) => console.error("Failed to fetch feeds", err));
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Feed Fusion AI</h1>
        <div className="header-buttons">
          <button className="btn btn-add">Add Feed</button>
          <button className="btn btn-refresh" onClick={refreshFeeds}>
            Refresh Feeds
          </button>
        </div>
      </header>

      <section className="feeds">
        <h2>Your Feeds</h2>
        {feeds.length === 0 ? (
          <p>No feeds found.</p>
        ) : (
          <ul className="feed-list">
            {feeds.map((feed) => (
              <li
                key={feed.id}
                className="feed-card"
                onClick={() => onSelectFeed && onSelectFeed(feed.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="feed-content">
                  <h3 className="feed-title">{feed.title}</h3>
                  <p className="feed-fetched">
                    Last Fetched:{" "}
                    {feed.lastFetched
                      ? new Date(feed.lastFetched).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div className="feed-actions">
                  <button className="btn btn-edit">Edit</button>
                  <button className="btn btn-delete">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default FeedDashboard;