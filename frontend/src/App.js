import React, { useState } from "react";
import FeedDashboard from "./components/FeedDashboard";
import FeedItemList from "./components/FeedItemList";
import "./css/App.css"; // Make sure this path matches your project structure

function App() {
  const [selectedFeedId, setSelectedFeedId] = useState(null);

  return (
    <div className="app-container">
      <div className="left-panel">
        <FeedDashboard onSelectFeed={setSelectedFeedId} />
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
  );
}

export default App;