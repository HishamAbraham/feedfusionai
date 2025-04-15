// src/components/Header.js
import React from "react";
import "../css/Header.css"; // Ensure this file exists and is styled appropriately
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

function Header({ onAddFeed, onRefreshFeeds, onToggleDarkMode, darkMode }) {
  return (
    <header className="app-header">
      <img src="/assets/reader-icon.png" alt="Feed Fusion AI Icon" className="app-icon" />
      <div className="header-text">
        <h1>Feed Fusion AI</h1>
        <p>Your digital RSS feed reader</p>
      </div>
      <div className="header-buttons">
        <button className="btn btn-add" onClick={onAddFeed}>Add Feed</button>
        <button className="btn btn-refresh" onClick={onRefreshFeeds}>Refresh Feeds</button>
        <button className="btn btn-dark-mode" onClick={onToggleDarkMode}>
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </button>
      </div>
    </header>
  );
}

export default Header;