# URL Shortener

The app will run at:

```text
https://himavardhan.github.io/short/
```

A small Angular application that lets a user submit a long URL, generate a shortened URL, and verify a security PIN when one is enabled. The frontend talks to the `open-bills-services`(Personal Application We can discuss more in call if anyone interested it's Private App) backend, which generates the short code, stores it in MongoDB, and exposes a verification endpoint.

## Project Overview

This app has two parts:

- `URLShortener` - the Angular frontend in this workspace folder.
- `open-bills-services` - the Node.js and MongoDB backend that creates and verifies shortened URLs.

The frontend sends URL data to the backend, receives a generated `uniqueWord`, `shortUrl`, and optional `securityPin`, then allows the user to open the verification screen for that short URL.

## Features

- Submit a long URL to shorten it.
- Optionally generate a 6-digit security PIN.
- Save shortened URL data in MongoDB.
- Verify a shortened URL using the generated `uniqueWord` and PIN.
- Route-based navigation for the main form and verification screen.
- Reactive form handling with Angular Form Signals.

## Tech Stack

- Angular 22
- Angular Router
- Angular Form Signals (`@angular/forms/signals`)
- RxJS
- Node.js backend
- Express
- LangChain framework
- OpenAI LLM integration
- Mongoose
- MongoDB

## Folder Structure

- `src/app/app.ts` - root app shell
- `src/app/app.routes.ts` - route definitions
- `src/app/url-shot-form/` - URL shortening form component
- `src/app/security-pin-verification/` - PIN verification component

## Available Routes

- `/` - main URL shortening form
- `/link/:uniqueWord` - security PIN verification screen for a specific short URL

The `:uniqueWord` value is the unique short identifier returned by the backend.

## Backend API Requirements

This frontend expects the backend to expose these endpoints:

- `POST /api/v1/shorten-url`
- `GET /api/v1/verify-shorten-url/:uniqueWord?securityPin=123456`

The shorten endpoint returns a response shaped like:

```json
{
  "originalUrl": "https://example.com",
  "uniqueWord": "sample-1234",
  "shortUrl": "https://himavardhan.github.io/short/link/sample-1234",
  "securityPin": "123456"
}
```

## Setup

### 1. Install dependencies

From the `URLShortener` folder:

```bash
npm install
```

### 2. Run the frontend

```bash
npm start
```

The app will usually run at:

```text
https://himavardhan.github.io/short/
```

### 3. Run the backend

From the `open-bills-services` folder, make sure MongoDB and your environment variables are available, then start the server.

Typical backend environment values:

- `MONGO_URI` - MongoDB connection string
- `OPENAI_API_KEY` - required if the backend generates unique words with OpenAI
- `PORT` - backend port, usually `3032`
- `HOST` - backend host, usually `0.0.0.0`
- `CORS_ALLOWED_ORIGINS` - optional comma-separated list of allowed frontend origins

Example:

```bash
npm run startserver
```

## How to Use

### Shorten a URL

1. Open the frontend at `/`.
2. Enter the URL you want to shorten.
3. Enable the security PIN option if required.
4. Submit the form.
5. The backend returns the `shortUrl` and optional `securityPin`.

### Verify a Short URL

1. Open the verification route using the generated `uniqueWord`.
2. Enter the 6-digit PIN if the short URL requires one.
3. Submit the PIN.
4. The frontend sends the request to the backend verification endpoint.
5. If the PIN is valid, the backend redirects to the original URL.

## Development Notes

- The app uses Angular standalone components and router configuration.
- The URL form is implemented using Form Signals (`form`, `required`, and `validate`) from `@angular/forms/signals`.
- Route parameters are read from `ActivatedRoute` in the verification component.
- The backend stores the shortened URL documents through a Mongoose model in `open-bills-services/Models/shortUrl.js`.
- The backend uses LangChain (`@langchain/openai` and `@langchain/core`) to integrate with OpenAI LLMs for unique short word generation.

## Build

```bash
npm run build
```

For GitHub Pages deployment, the build uses the `/short/` base href.

## Common Issues

### Project does not start

If Angular reports that the project does not exist, make sure the Angular workspace name is `short` and that `angular.json` still points `serve` to `short:build:development`.

### Backend connection errors

If MongoDB Atlas rejects the connection, check:

- `MONGO_URI`
- Atlas network access whitelist
- MongoDB service availability

### Cross-origin errors

If the frontend cannot call the backend, add the frontend origin to `CORS_ALLOWED_ORIGINS` in the backend environment.

## Notes

The verification screen route currently uses:

```text
/link/:uniqueWord
```

If you want a different public route name, update both `src/app/app.routes.ts` and any links that point to it.
