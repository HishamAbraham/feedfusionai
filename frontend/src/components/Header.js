// src/components/Header.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSyncAlt, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

function Header({ onAddFeed, onRefreshFeeds, onToggleDarkMode, darkMode, isRefreshing }) {
  return (
    <nav
      className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} mb-4 shadow-sm`}
    >
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img
            src="/assets/reader-icon.png"
            alt="Feed Fusion AI Icon"
            width="40"
            height="40"
            className="d-inline-block align-text-top me-2"
          />
          <div>
            <h5 className="mb-0">Feed Fusion AI</h5>
            <small className="text-muted">Your digital RSS feed reader</small>
          </div>
        </a>

        <div className="d-flex">
          <button className="btn btn-outline-primary me-2" onClick={onAddFeed} title="Add Feed">
            <FontAwesomeIcon icon={faPlus} /> Add Feed
          </button>

          <button
            className="btn btn-outline-success me-2"
            onClick={onRefreshFeeds}
            title="Refresh Feeds"
          >
            <FontAwesomeIcon icon={faSyncAlt} spin={isRefreshing} /> Refresh
          </button>

          <button
            className="btn btn-outline-dark"
            onClick={onToggleDarkMode}
            title="Toggle Dark Mode"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
