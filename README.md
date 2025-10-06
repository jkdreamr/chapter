# Chapter Room Tracker

A minimalistic web application to track who's in the chapter room with real-time synchronization across devices.

## Features

- ✅ Select your name and update your status (in room or not)
- ✅ Real-time counter showing how many people are in the room
- ✅ Dynamic requirements based on time (20 people needed 9 PM-9 AM, 13 people needed 9 AM-9 PM)
- ✅ Optional reason field when not in the room
- ✅ Syncs across all devices and browsers
- ✅ Auto-refreshes every 5 seconds
- ✅ Mobile-responsive design
- ✅ Clean black and white UI

## Setup

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser to `http://localhost:3000`

### Deployment

You can deploy this to any Node.js hosting service like:
- Heroku
- Railway
- Render
- Vercel
- DigitalOcean

Make sure to set the `PORT` environment variable if required by your hosting provider.

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **Storage**: JSON file (simple and effective for this use case)
- **Styling**: Responsive CSS with mobile-first design

## How It Works

1. Users select their name from a dropdown
2. They indicate if they're in the chapter room or not
3. If not in the room, they can optionally provide a reason
4. All status updates are saved to a central server
5. The page auto-refreshes every 5 seconds to show the latest status from all users
6. The counter dynamically shows how many people are in the room and how many more are needed

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and responsive design
- `script.js` - Frontend JavaScript logic
- `server.js` - Backend API server
- `package.json` - Node.js dependencies
- `data.json` - Automatically created to store status data
