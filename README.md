# Activity Console

Activity Console provides a real-time view of system events, user actions, and application logs to help monitor activity and troubleshoot issues.

## Prerequisites

- Node.js (v18 or later recommended)
- npm

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ashwani-yadav83602/activity-console.git
cd activity-console
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the Mock Server

Navigate to the mock server directory and start the backend server:

```bash
cd mock-server
npm install
npm start
```

> **Note:** Keep the mock server running in a separate terminal.

### 4. Start the Frontend

Open another terminal in the project root:

```bash
cd activity-console
npm run dev
```

Open http://localhost:3000 in your browser to view the application.

## Features

- Real-time activity feed
- Search and filter activities
- Status-based filtering
- Responsive UI
- Mock backend server
- Built with Next.js and TypeScript

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Mock Server

## Project Structure

```
activity-console/
├── app/
├── components/
├── hooks/
├── lib/
├── mock-server/
└── README.md
```