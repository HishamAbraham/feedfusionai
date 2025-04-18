// src/components/Header.js
import React from "react";
import "../css/Header.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faSyncAlt, faMoon, faSun} from "@fortawesome/free-solid-svg-icons"; // ② add plus & sync

function Header({onAddFeed, onRefreshFeeds, onToggleDarkMode, darkMode}) {
    return (
        <header className="app-header">
            <img
                src="/assets/reader-icon.png"
                alt="Feed Fusion AI Icon"
                className="app-icon"
            />

            <div className="header-text">
                <h1>Feed Fusion AI</h1>
                <p>Your digital RSS feed reader</p>
            </div>

            <div className="header-buttons">
                <button
                    className="btn btn-add"
                    onClick={onAddFeed}
                    title="Add Feed"
                >
                    <FontAwesomeIcon icon={faPlus}/> Add Feed
                </button>

                <button
                    className="btn btn-refresh"
                    onClick={onRefreshFeeds}
                    title="Refresh Feeds"
                >
                    <FontAwesomeIcon icon={faSyncAlt}/> Refresh
                </button>

                <button
                    className="btn btn-dark-mode"
                    onClick={onToggleDarkMode}
                    title="Toggle Dark Mode"
                >
                    <FontAwesomeIcon icon={darkMode ? faSun : faMoon}/>
                </button>
            </div>
        </header>
    );
}

export default Header;