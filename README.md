# Currency Tracker Dashboard

A responsive currency exchange dashboard built with **React 18, Vite, Tailwind CSS, and PHP**.

The application provides real-time exchange rates, live currency conversion, caching for performance optimization, and a responsive dashboard experience inspired by modern fintech products.

---

# Features

## Core Features

* Live exchange rates fetched from ExchangeRate API
* PHP backend endpoint with 5-minute file caching
* Real-time currency converter
* Automatic refresh every 60 seconds
* Manual refresh support
* Loading skeleton states
* Error handling and retry flow
* Mobile responsive layout
* Sidebar dashboard navigation
* Native Fetch API usage (No Axios)

---

# Bonus Features Implemented

* Base currency switcher
* Pinned currencies
* LocalStorage persistence for pinned currencies

---

# Tech Stack

## Frontend

* React 18
* Vite
* Tailwind CSS

## Backend

* Plain PHP 8

## API

* ExchangeRate API

https://open.er-api.com/v6/latest/USD

---

# Project Structure

```bash
currency-tracker/

public/
│
├── api/
│   ├── config.php
│   └── rates/
│       ├── live.php
│       └── cache/
│
src/
│
├── components/
│   ├── Sidebar.jsx
│   ├── CurrencyCard.jsx
│   ├── CurrencyConverter.jsx
│   ├── CurrencyHeader.jsx
│   ├── CurrencySkeleton.jsx
│   └── ErrorState.jsx
│
├── pages/
│   └── CurrencyRates.jsx
│
├── App.jsx
└── main.jsx
```

---

# Backend Architecture

The frontend and backend run as separate services during development.

### Frontend

Runs through the Vite development server:

```bash
http://localhost:5173
```

### Backend

Runs through PHP's built-in server:

```bash
http://localhost:8000
```

Frontend requests exchange rates from:

```bash
http://localhost:8000/api/rates/live.php?base=USD
```

---

# How the Backend Works

The backend endpoint:

```bash
/api/rates/live.php
```

handles the complete exchange rate workflow.

### Request Flow

1. Receives the selected base currency.
2. Validates supported currencies.
3. Checks whether a cached response already exists.
4. If cache is valid (less than 5 minutes old), cached data is returned instantly.
5. If cache is expired, a fresh API request is made.
6. Successful responses are stored in the cache directory.
7. If the external API fails, stale cache is returned as a fallback.
8. If both API and cache fail, a proper JSON error response is returned.

### Example Response

```json
{
  "success": true,
  "base": "USD",
  "updated_at": "2026-05-30 20:00:00",
  "rates": {
    "GBP": 0.74,
    "INR": 95.20,
    "AED": 3.67,
    "EUR": 0.86
  }
}
```

---

# Frontend Functionality

## Exchange Rate Dashboard

Displays:

* Flag emoji
* Currency code
* Currency name
* Live exchange rate against selected base currency

## Currency Converter

Supports:

* From currency selection
* To currency selection
* Live conversion while typing
* Dynamic base currency support

## Auto Refresh

* Refreshes data every 60 seconds
* Background refresh without UI flicker

## Error Handling

Handles:

* API failures
* Network interruptions
* Missing cache
* Invalid responses

Users can retry requests using the retry action.

---

# Mobile Responsiveness

The application is fully responsive and optimized for:

* Mobile devices
* Tablets
* Desktop screens

Currency cards automatically stack and adjust for smaller viewports.

---

# Local Setup

## 1. Clone Repository

```bash
git clone <YOUR_REPOSITORY_LINK>
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start Frontend

From the project root:

```bash
npm run dev
```

Frontend:

```bash
http://localhost:5173
```

---

## 4. Start Backend

Open a second terminal:

```bash
cd public
php -S localhost:8000
```

Backend:

```bash
http://localhost:8000/api/rates/live.php
```

---

# Important Notes

* Backend built using plain PHP only
* No backend framework used
* No Axios used
* Tailwind utility-first styling
* Exchange rate responses cached for 5 minutes
* Frontend and backend run independently during development

---

# Future Improvements

Potential improvements include:

* Historical exchange rate charts
* Search and filtering
* Dedicated converter API endpoint
* Unit and integration testing
* Improved analytics and reporting widgets

---

# Loom Walkthrough

https://www.loom.com/share/23d466db696442028ac944a6cc99619c

---

# Author

Priyanshu Rathore
