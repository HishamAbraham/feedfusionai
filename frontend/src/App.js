// src/App.js
import React, {useState} from "react";
import {BrowserRouter as Router} from "react-router-dom";

import Header from "./components/Header";
import FeedDashboard from "./components/FeedDashboard";
import FeedItemList from "./components/FeedItemList";
import FeedForm from "./components/FeedForm";
import { API_BASE } from "./config";
import "./css/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

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

    // Sidebar open state
    const [sidebarOpen, setSidebarOpen] = useState(true);

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
        fetch(`${API_BASE}/feeds/refresh`, {method: "PATCH"})
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
                setRefreshResult(0); // fallback: show 0 new items if refresh fails
                setTimeout(() => setRefreshResult(null), 3000);
            });
    };

    // Toggle light/dark CSS class on document.body
    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newMode = !prev;
            if (newMode) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            return newMode;
        });
    };

    // Handler passed to FeedForm for both add & edit
    const handleFormSubmit = (feedData) => {
        const method = editingFeed ? "PATCH" : "POST";
        const url = editingFeed
            ? `${API_BASE}/feeds/${editingFeed.id}`
            : `${API_BASE}/feeds`;

        fetch(url, {
            method,
            headers: {"Content-Type": "application/json"},
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
            <div className={`app-container ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>
                <Header
                    onAddFeed={handleAddFeed}
                    onRefreshFeeds={handleRefreshFeeds}
                    onToggleDarkMode={toggleDarkMode}
                    darkMode={darkMode}
                    isRefreshing={isRefreshing}
                />
                <div className="d-flex justify-content-start m-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setSidebarOpen((prev) => !prev)}
                  >
                    {sidebarOpen ? "Hide Feeds" : "Show Feeds"}
                  </button>
                </div>

                {refreshResult !== null && (
                    <div className="alert alert-success text-center mx-3">
                        🚀 {refreshResult} new items added
                    </div>
                )}

                {showFeedForm && (
                    <FeedForm
                        feed={editingFeed}
                        onSuccess={handleFormSubmit}
                        onCancel={handleCancelForm}
                    />
                )}

                <div className="d-flex" style={{ height: "calc(100vh - 64px)", overflow: "hidden" }}>
                  {/* Sidebar */}
                  {sidebarOpen && (
                    <div className="sidebar bg-light border-end">
                      <FeedDashboard
                        onSelectFeed={setSelectedFeedId}
                        onEditFeed={handleEditFeed}
                        refreshTrigger={refreshTrigger}
                      />
                    </div>
                  )}

                  {/* Main Content */}
                  <div className="main-content p-3">
                    {selectedFeedId ? (
                      <FeedItemList
                        feedId={selectedFeedId}
                        onItemMarkedRead={() => setRefreshTrigger((prev) => prev + 1)}
                      />
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