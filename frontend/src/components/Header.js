// src/components/Header.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSyncAlt, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

function Header({ onAddFeed, onRefreshFeeds, onToggleDarkMode, darkMode, isRefreshing }) {
  return (
    <nav
      className={`mb-6 shadow-sm border-b ${
        darkMode
          ? 'bg-gray-900 text-white border-gray-700'
          : 'bg-white text-gray-900 border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <a className="flex items-center space-x-3" href="#">
          <img
            src="/assets/reader-icon.png"
            alt="Feed Fusion AI Icon"
            width="40"
            height="40"
            className="inline-block"
          />
          <div>
            <h1 className="text-2xl font-bold leading-tight">Feed Fusion AI</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your digital RSS feed reader</p>
          </div>
        </a>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="flex items-center gap-1 px-4 py-2 text-sm border rounded transition hover:bg-opacity-10 focus:outline-none focus:ring-2 border-blue-600 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800"
            onClick={onAddFeed}
            title="Add Feed"
          >
            <FontAwesomeIcon icon={faPlus} /> Add Feed
          </button>

          <button
            className="flex items-center gap-1 px-4 py-2 text-sm border rounded transition hover:bg-opacity-10 focus:outline-none focus:ring-2 border-green-600 text-green-700 hover:bg-green-100 dark:hover:bg-green-800"
            onClick={onRefreshFeeds}
            title="Refresh Feeds"
          >
            <FontAwesomeIcon icon={faSyncAlt} spin={isRefreshing} /> Refresh
          </button>

          <button
            className="flex items-center gap-1 px-4 py-2 text-sm border rounded transition hover:bg-opacity-10 focus:outline-none focus:ring-2 border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
