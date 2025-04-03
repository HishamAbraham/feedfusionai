# feedfusionai

**FeedFusionAI: Where News Meets Intelligence**

FeedFusionAI is an AI-powered RSS reader that aggregates your favorite news feeds, intelligently summarizes articles, and generates actionable to-do items. Whether you're looking for curated content or ready to act on a great recipe or tech tutorial, FeedFusionAI helps you stay informed and productive.

---

## Features

- **Feed Aggregation**
    - Subscribe to and manage multiple RSS/Atom feeds.
    - Organize feeds with categories and user-defined tags.

- **AI-Powered Content Processing**
    - Generate concise article summaries using AI.
    - Automatically categorize and tag articles.
    - Implement semantic search to improve content discovery.

- **Actionable To-Do Generation**
    - Manually mark articles as actionable and add custom notes.
    - Automatically extract actionable tasks from articles using natural language processing.
    - Sync tasks with external to-do services (e.g., Todoist, Microsoft To Do, Google Tasks).

- **User Account Management**
    - Secure registration and login using Spring Security with JWT.
    - Manage user profiles, preferences, and feed subscriptions.

- **Responsive, Cross-Platform Interfaces**
    - Web application built with React and TailwindCSS.
    - (Optional) Mobile app built with React Native for on-the-go access.

- **Containerized Deployment**
    - Dockerized backend and frontend for seamless deployment.
    - Orchestrated using Docker Compose with reverse proxy (Traefik/Nginx) for SSL and routing.

---

## Architecture

The project follows a monorepo structure with separate directories for each major component:
feedfusionai/
├── backend/                # Spring Boot application (Java, MongoDB, Spring Security)
├── frontend/               # React web application (TailwindCSS)
├── mobile/                 # (Optional) React Native mobile application
├── docker-compose.yml      # Docker Compose file to orchestrate all services
├── README.md               # Project overview and documentation
├── LICENSE                 # Apache License 2.0
└── .gitignore              # Git ignore rules

---

## Tech Stack

- **Backend:** Java, Spring Boot, MongoDB, Spring Security, JWT, Docker
- **Frontend:** React, TailwindCSS, Docker
- **Mobile (Optional):** React Native
- **AI Integration:** Local or external AI models (e.g., via Ollama or third-party summarization APIs)
- **External Integrations:** APIs for popular task management services (Todoist, Microsoft To Do, Google Tasks)

---

## Installation

### Prerequisites

- Java 11+
- Node.js and npm
- Docker and Docker Compose
- A running MongoDB instance (or use Docker to run one)