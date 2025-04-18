// src/components/FeedItemCard.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faCheck, faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { sanitizeAndTransform } from "../utils/sanitizeHtml";
import "../css/FeedItemCard.css";

const FeedItemCard = ({ item, onMarkAsRead, onToggleStar, onReadMore }) => {
  // Helper function to render sanitized description.
  const renderDescription = (description) => {
    if (typeof description === "string") {
      return sanitizeAndTransform(description);
    } else if (description && typeof description === "object") {
      if (description.value) {
        return sanitizeAndTransform(description.value);
      }
      return sanitizeAndTransform(JSON.stringify(description));
    }
    return "";
  };

  return (
    <div className="feed-item-card">
      <h3>
        {item.title || "No Title Available"}
        {!item.read && <span className="unread-badge">New</span>}
      </h3>
      <div className="item-description">{renderDescription(item.description)}</div>
      <p>
        <small>{new Date(item.publishedDate).toLocaleString()}</small>
      </p>
      {/* Toolbar for actions */}
      <div className="feed-item-toolbar">
        <button
          className="toolbar-button btn-read-more"
          title="Read More"
          onClick={() => onReadMore(item)}
        >
          <FontAwesomeIcon icon={faBookOpen} />
        </button>
        {!item.read && (
          <button
            className="toolbar-button btn-mark-read"
            title="Mark as Read"
            onClick={() => onMarkAsRead(item.id)}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        )}
        <button
          className="toolbar-button btn-toggle-star"
          title={item.starred ? "Unstar" : "Star"}
          onClick={() => onToggleStar(item.id)}
        >
          <FontAwesomeIcon icon={item.starred ? solidStar : regularStar} />
        </button>
      </div>
    </div>
  );
};

export default FeedItemCard;