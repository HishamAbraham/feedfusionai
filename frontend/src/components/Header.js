// src/components/Header.js
import React from "react";
import "../css/Header.css"; // Ensure this file exists and is updated as needed

function Header({ onAddFeed, onRefreshFeeds }) {
  return (
    <header className="app-header">
      <img
        src="/assets/reader-icon.png"  // Icon loaded from public/assets
        alt="Feed Fusion AI Icon"
        className="app-icon"
      />
      <div className="header-text">
        <h1>Feed Fusion AI</h1>
        <p>Your digital RSS feed reader</p>
      </div>
      <div className="header-buttons">
        <button className="btn btn-add" onClick={onAddFeed}>
          Add Feed
        </button>
        <button className="btn btn-refresh" onClick={onRefreshFeeds}>
          Refresh Feeds
        </button>
      </div>
    </header>
  );
}

export default Header;