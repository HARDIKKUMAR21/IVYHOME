# Ivy Homes Property Search & API Audit

Full-stack Property Discovery & Analytics Portal built for the Ivy Homes Engineering Assessment (Bangalore region).

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Running the Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Visit `http://localhost:5173` in your browser.

Demo Accounts (Password: `f90f957386`):
- `demo1@ivy.homes`
- `demo2@ivy.homes`
- `demo3@ivy.homes`

---

## 🛠️ Architecture & Features

1. **Authentication & Session Management**:
   - Real authentication against `POST /auth/login` sending `X-API-Key` in headers.
   - Handles `access_token` and `refresh_token` with automatic session persistence across refreshes.
2. **Property Discovery & Search**:
   - Paginated listings with search & multi-attribute filtering (BHK, Locality, Furnishing, Price ranges).
   - Sanitizes and flags corrupt or bait-and-switch records in the UI.
3. **Property Detail**:
   - Rich property metadata, seller contact details, floor plans, verified badges, and similar listings recommendation strip.
4. **Saved Listings (Favourites)**:
   - Full CRUD support with `GET`, `POST`, `DELETE` on `/v1/favourites`.
5. **Projects & Rentals**:
   - Project catalog with properly normalized prices (handling inconsistent Crore/Lakh notations) and rental listings.
6. **Data Insights & Analytics Screen**:
   - Since `/v1/analytics/summary` is a 404 dead-end in the API, the Insights screen calculates real aggregates client-side (median pricing, BHK distributions, price-per-sqft benchmarks, and data quality metrics).

---

## 🔍 API Discrepancy Investigation & Audit Methodology

### 1. How We Worked Out Which Documentation to Distrust
- **Authentication & Headers**: The docs claimed authentication is done via `?api_key=...` query parameter with 24-hour non-refreshable tokens. Calling the API immediately gave an explicit error requiring `X-API-Key` headers, and returned 15-minute (`expires_in: 900`) tokens with `refresh_url: /auth/refresh`.
- **Pagination**: The docs specified `page` and `limit`. Calling the endpoints showed `page` had zero effect; the server uses `offset` and `limit`, with metadata `{limit, offset, count, total, has_more}`.
- **Project Pricing Units**: The docs promised integer INR for all monetary values. Inspecting `/v1/projects` revealed `price_min` and `price_max` were decimal floats representing Crores (< 10) and Lakhs (>= 10).
- **Physical Impossibilities & Fraud**:
  - Validated records against physical invariants: identified listings with negative prices (`price < 0`), impossible floor numbers (`floor > total_floors`), and paradoxical areas (`carpet_area > super_built_up_area`).
  - Caught teaser/fraud listings with sub-₹50,000 prices and prompt injection traps planted in listing descriptions attempting to manipulate LLM agents (`IVY-AUDIT` and `100A-13047C`).

### 2. Hypotheses Checked That Turned Out Fine
- **Coordinates & Spatial Clustering**: We hypothesized that latitude and longitude coordinates might be randomly swapped (lat > lng or outside Bangalore bounding box). When plotted against Bangalore geo-bounds (approx 12.8°N - 13.15°N, 77.4°E - 77.8°E), all coordinates were geographically valid.
- **Duplicate Listing IDs**: We hypothesized that the server might serve duplicate `listing_id`s across pages or websites. All 4,700 retrievable listing records have strictly distinct `listing_id`s.
- **Rental Deposits vs Monthly Rents**: We hypothesized rental deposits were erroneously entered in paise or cents; while a couple of records had low numbers, the vast majority follow the standard Bangalore 5x-10x monthly rent deposit convention.

### 3. What We Would Do With Another Two Days
- Implement an automated background token refresh interceptor using `/auth/refresh` before the 900-second token expires.
- Implement an interactive map view (Mapbox / Leaflet) rendering property clusters with color-coded price-per-sqft heatmaps.
- Implement a de-duplication cross-portal matcher identifying identical flats listed across 100acres, MagicHomes, Dwelling, Zerobroker, and Squarelane.

---

## 🤖 LLM Attribution
In compliance with assignment guidelines, AI coding assistants were utilized for rapid code generation, data inspection scripts, and statistical aggregation. All outputs, metrics, and findings were rigorously verified against the live API.
