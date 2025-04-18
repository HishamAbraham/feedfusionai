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

    // Controls the add/edit modal
    const [showFeedForm, setShowFeedForm] = useState(false);
    const [editingFeed, setEditingFeed] = useState(null);

    // For dark mode
    const [darkMode, setDarkMode] = useState(false);

    // Bump this to force FeedDashboard to refetch
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // === Handlers ===

    // Header "Add Feed" button
    const handleAddFeed = () => {
        setEditingFeed(null);
        setShowFeedForm(true);
    };

    // Dashboard "Edit" button
    const handleEditFeed = (feed) => {
        setEditingFeed(feed);
        setShowFeedForm(true);
    };

    // Header "Refresh Feeds" button
    const handleRefreshFeeds = () => {
        console.log("Refreshing all feeds…");
        fetch("http://localhost:8080/api/feeds/refresh", { method: "PATCH" })
            .then((res) => {
                if (!res.ok) throw new Error("Refresh failed");
                return res.json();
            })
            .then(() => {
                setRefreshTrigger((prev) => prev + 1);
            })
            .catch((err) => console.error("Failed to refresh feeds", err));
    };

    // Header "Toggle Dark Mode" button
    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    // FeedForm onSuccess (add or edit)
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
                    throw new Error(`Save failed: ${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then(() => {
                setShowFeedForm(false);
                setRefreshTrigger((prev) => prev + 1);
            })
            .catch((err) => {
                console.error("Failed to save feed", err);
                // You may want to surface this in the form; FeedForm handles its own errors
            });
    };

    // Cancel button in FeedForm
    const handleCancelForm = () => {
        setShowFeedForm(false);
    };

    // === Render ===
    return (
        <Router>
            <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
                <Header
                    onAddFeed={handleAddFeed}
                    onRefreshFeeds={handleRefreshFeeds}
                    onToggleDarkMode={toggleDarkMode}
                    darkMode={darkMode}
                />

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