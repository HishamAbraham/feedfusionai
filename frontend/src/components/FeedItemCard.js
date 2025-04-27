// src/components/FeedItemCard.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faCheck, faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { sanitizeAndTransform } from "../utils/sanitizeHtml";

const FeedItemCard = ({ item, onMarkAsRead, onToggleStar, onReadMore }) => {
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
    <div className="feed-item-content">
      <h5 className="card-title">
        {item.title || "No Title Available"}
        {!item.read && <span className="badge bg-primary ms-2">New</span>}
      </h5>
      <div className="card-text mb-2">{renderDescription(item.description)}</div>
      <p className="text-muted small mb-2">
        {new Date(item.publishedDate).toLocaleString()}
      </p>
      <div className="d-flex justify-content-end">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline-primary me-2"
          title="Read More"
        >
          <FontAwesomeIcon icon={faBookOpen} />
        </a>
        {!item.read && (
          <button
            className="btn btn-sm btn-outline-success me-2"
            title="Mark as Read"
            onClick={() => onMarkAsRead(item.id)}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        )}
        <button
          className="btn btn-sm btn-outline-warning"
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