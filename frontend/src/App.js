// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import FeedDashboard from "./components/FeedDashboard";
import FeedItemList from "./components/FeedItemList";
import FeedForm from "./components/FeedForm";
import "./css/App.css";

function App() {
    const [selectedFeedId, setSelectedFeedId] = useState(null);

    // Add/Edit form modal
    const [showFeedForm, setShowFeedForm] = useState(false);
    const [editingFeed, setEditingFeed] = useState(null);

    // Dark mode toggle
    const [darkMode, setDarkMode] = useState(false);

    // Force-feed-refresh trigger
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Refresh button spinner + result banner
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshResult, setRefreshResult] = useState(null);

    // Open blank Add Feed form
    const handleAddFeed = () => {
        setEditingFeed(null);
        setShowFeedForm(true);
    };

    // Open Edit Feed form
    const handleEditFeed = (feed) => {
        setEditingFeed(feed);
        setShowFeedForm(true);
    };

    // Call backend PATCH /api/feeds/refresh, spin icon, show count
    const handleRefreshFeeds = () => {
        setRefreshResult(null);
        setIsRefreshing(true);
        fetch("http://localhost:8080/api/feeds/refresh", { method: "PATCH" })
            .then((res) => {
                if (!res.ok) throw new Error("Refresh failed");
                return res.json();
            })
            .then((newCount) => {
                setIsRefreshing(false);
                setRefreshResult(newCount);
                setRefreshTrigger((prev) => prev + 1);
                // auto-hide the banner after 3s
                setTimeout(() => setRefreshResult(null), 3000);
            })
            .catch((err) => {
                console.error("Failed to refresh feeds", err);
                setIsRefreshing(false);
            });
    };

    // Toggle light/dark CSS class
    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    // Handler passed to FeedForm for both add & edit
    const handleFormSubmit = (feedData) => {
        const method = editingFeed ? "PATCH" : "POST";
        const url = editingFeed
            ? `http://localhost:8080/api/feeds/${editingFeed.id}`
            : "http://localhost:8080/api/feeds";

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(feedData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Save failed: ${res.status}`);
                }
                return res.json();
            })
            .then(() => {
                setShowFeedForm(false);
                setRefreshTrigger((prev) => prev + 1);
            })
            .catch((err) => {
                console.error("Failed to save feed", err);
            });
    };

    // Close Add/Edit modal
    const handleCancelForm = () => {
        setShowFeedForm(false);
    };

    return (
        <Router>
            <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
                <Header
                    onAddFeed={handleAddFeed}
                    onRefreshFeeds={handleRefreshFeeds}
                    onToggleDarkMode={toggleDarkMode}
                    darkMode={darkMode}
                    isRefreshing={isRefreshing}
                />

                {refreshResult !== null && (
                    <div className="refresh-banner">
                        🚀 {refreshResult} new items added
                    </div>
                )}

                {showFeedForm && (
                    <div className="modal-overlay">
                        <FeedForm
                            feed={editingFeed}
                            onSuccess={handleFormSubmit}
                            onCancel={handleCancelForm}
                        />
                    </div>
                )}

                <div className="panels">
                    <div className="left-panel">
                        <FeedDashboard
                            onSelectFeed={setSelectedFeedId}
                            onEditFeed={handleEditFeed}
                            refreshTrigger={refreshTrigger}
                        />
                    </div>
                    <div className="right-panel">
                        {selectedFeedId ? (
                            <FeedItemList feedId={selectedFeedId} />
                        ) : (
                            <div className="placeholder">
                                <h2>Select a feed to see its items</h2>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;