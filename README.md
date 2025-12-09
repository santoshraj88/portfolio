# Portfolio Website

A modern, responsive portfolio website with serverless contact form powered by Mailgun. Features coral and teal color scheme with light/dark theme toggle.

## Features

- Coral and teal color scheme
- Light/Dark theme toggle
- Fully responsive design
- Serverless contact form (Mailgun API + SMTP fallback)
- Deployed on Vercel
- Secure environment variable handling
- Minimal black & white email template

## Project Structure

```
PORTFOLIO/
├── send-email.js          # send-email server
├── index.html             # Main page
├── style.css              # Styles
├── script.js              # Client-side JS
├── profile.jpg            # Profile image
├── .env.example           # Example environment variables
├── package.json           # Dependencies
├── vercel.json            # Vercel configuration
└── README.md
```

## Deployment

### Single Vercel Deployment (Client + Server)

This project uses a unified deployment on Vercel - both the frontend (HTML/CSS/JS) and serverless function run on the same Vercel server. No separate setup required.

#### Deploy via GitHub

1. Push your code to GitHub
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/santoshraj88/portfolio.git
   git push -u origin main
   ```

2. Connect to Vercel
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel automatically detects the configuration

3. Set Environment Variables (in Vercel Dashboard)
   - Go to Project Settings → Environment Variables
   - Add the following:
     - `RECIPIENT_EMAIL` - Your email address (where contact form messages are sent)
     - `MAILGUN_API_KEY`
     - `MAILGUN_DOMAIN`
     - `MAILGUN_SMTP_USER`
     - `MAILGUN_SMTP_PASSWORD`
   - Redeploy after adding variables

## Local Development

### Prerequisites

- Node.js (v20+)
- npm
- Mailgun account

### Setup

1. Install Dependencies
   ```bash
   npm install
   ```

2. Configure Environment Variables

   Create a `.env` file in the root folder:
   ```env
   RECIPIENT_EMAIL=santoshraj8002444@gmail.com
   MAILGUN_SMTP_USER=your-email@your-domain.mailgun.org
   MAILGUN_SMTP_PASSWORD=your-smtp-password
   MAILGUN_API_KEY=your-api-key
   MAILGUN_DOMAIN=your-domain.mailgun.org
   ```

3. Run Locally with Vercel Dev
   ```bash
   vercel dev
   ```

   This will start a local server at `http://localhost:3000`

## Email Delivery System

Dual delivery system for reliability:
- **Primary**: SMTP via Mailgun
- **Fallback**: Mailgun API

Email template features a minimal black & white design.

## Tech Stack

**Frontend**
- HTML5, CSS3, JavaScript
- Responsive design
- Theme toggle

**Backend**
- Vercel Serverless Functions
- Node.js
- Mailgun (nodemailer + mailgun.js)

**Deployment**
- Vercel (free tier)
- Automatic HTTPS
- Global CDN

## License

MIT
