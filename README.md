# Audit Log Dashboard

A dashboard for security engineers to bulk-upload, view, and investigate system audit logs. Built with React, Node.js/Express, and MongoDB.

**Live demo:** `<your deployed frontend URL>`
**API:** `<your deployed backend URL>`

---

## Stack

| Layer    | Tech                                   |
|----------|-----------------------------------------|
| Frontend | React (Vite), axios                     |
| Backend  | Node.js, Express, Mongoose              |
| Database | MongoDB (Atlas)                         |
| Hosting  | Vercel (frontend) · Render/Railway (backend) · MongoDB Atlas (DB) |

---

## Project structure

```
audit-log-dashboard/
├── backend/
│   ├── config/db.js              # Mongoose connection
│   ├── models/AuditLog.js        # Schema + indexes
│   ├── controllers/logsController.js  # Bulk upload, list/filter/search/sort/paginate
│   ├── routes/logs.js
│   ├── middleware/errorHandler.js
│   ├── scripts/seed.js           # Generates sample log data for testing
│   └── server.js
└── frontend/
    └── src/
        ├── api/client.js         # axios wrapper
        ├── components/           # FiltersSidebar, LogsTable, Pagination, SearchBar,
        │                         # UploadPanel, LogDetailDrawer, Badge
        ├── hooks/useDebounce.js
        ├── App.jsx
        └── styles.css
```

---

## Local setup

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local MongoDB or a free [Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env and set MONGODB_URI to your connection string
npm run dev        # starts on http://localhost:5000
```

Optional: generate sample data to test the bulk upload endpoint and dashboard:

```bash
node scripts/seed.js 10000        # writes scripts/sample-logs.json
```

You can then upload `scripts/sample-logs.json` through the dashboard's Upload button, or directly:

```bash
curl -X POST http://localhost:5000/api/logs/bulk \
  -H "Content-Type: application/json" \
  --data @scripts/sample-logs.json
```

### 2. Frontend

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev        # starts on http://localhost:5173
```

---

## Deployment

- **Backend → Render/Railway:** set the root directory to `backend`, build command `npm install`, start command `npm start`, and add the `MONGODB_URI` and `CORS_ORIGIN` (your Vercel frontend URL) environment variables.
- **Database → MongoDB Atlas:** create a free cluster, add a database user, and allow network access from your backend host (or `0.0.0.0/0` for simplicity in this exercise).
- **Frontend → Vercel:** set the root directory to `frontend`, and add an environment variable `VITE_API_URL` pointing to your deployed backend URL (no trailing slash).

---

## API

| Method | Endpoint                    | Description                                      |
|--------|------------------------------|---------------------------------------------------|
| POST   | `/api/logs/bulk`             | Bulk-insert up to 10,000 log records              |
| GET    | `/api/logs`                  | List logs — filter, search, sort, paginate        |
| GET    | `/api/logs/filter-options`   | Distinct values per field, for filter dropdowns   |
| GET    | `/api/logs/:id`               | Fetch a single log by ID                          |
| GET    | `/api/health`                 | Health check                                      |

### `GET /api/logs` query params

| Param                              | Example                     |
|-------------------------------------|------------------------------|
| `page`, `limit`                    | `page=2&limit=50`           |
| `search`                           | `search=priya`               |
| `sortBy`, `sortOrder`               | `sortBy=severity&sortOrder=asc` |
| `severity`, `status`, `region`, `role`, `action`, `resourceType`, `ipAddress` | `severity=HIGH,CRITICAL` (comma-separated = OR) |
| `startDate`, `endDate`             | ISO date, filters on `timestamp` |

All filtering, searching, sorting, and pagination happen server-side via MongoDB queries — the frontend never fetches more than one page of results.

---

## Technical decisions

**Bulk upload via `insertMany({ ordered: false })`.** Inserting 10,000 documents one at a time would mean 10,000 round trips to MongoDB. `insertMany` batches the writes into far fewer round trips. `ordered: false` means a single invalid document doesn't stop the rest of the batch from being inserted — the API reports how many succeeded vs. failed. The endpoint also caps requests at 10,000 records; the frontend upload panel automatically splits larger files into 10,000-record chunks and uploads them sequentially with a progress bar, so uploading more than the per-request limit is transparent to the user.

**Indexing strategy.** Every field that appears in a filter or a sort has an index. Single-field indexes exist on `actor`, `action`, `resourceType`, `region`, `severity`, `status`, and `timestamp`. Compound indexes cover the combinations most likely to be queried together: `{severity, status, timestamp}` (the "show me unresolved high-severity events, newest first" case), `{region, timestamp}`, and `{actor, timestamp}`. A text index across `actor`, `action`, `resource`, and `ipAddress` (with `actor` weighted highest) powers the search box without needing a separate search engine like Atlas Search or Elasticsearch — reasonable at this data scale (tens of thousands of records), but would need revisiting well beyond that.

**Search implementation.** The search box uses MongoDB's `$text` operator against the text index rather than a regex scan, since regex scans on unindexed string fields don't scale and can't use an index for partial-word matches. When a search is active, results are also sorted by MongoDB's relevance score (`textScore`) as a tiebreaker.

**Pagination: skip/limit, not cursor-based.** For this exercise, offset pagination (`skip`/`limit`) is simpler to implement and gives users direct access to "page 5" or "jump to the last page," which the UI exposes. The tradeoff is that `skip` gets slower on very large offsets since MongoDB still has to walk past the skipped documents. Cursor-based pagination (using `_id` or `timestamp` as a cursor) would perform better at very large scale or high page numbers, but adds UX complexity (no arbitrary page jumps) that isn't worth it for this dataset size. A `_id` tiebreaker is added to every sort to keep pagination stable when many rows share the same sort value (e.g. same timestamp).

**Count query runs alongside the page query, not as a single `$facet` aggregation.** Two separate indexed queries (`find` + `countDocuments`) run in parallel via `Promise.all`. This is simpler to read and debug than a single `$facet` pipeline, and at this data volume the performance difference is negligible. `$facet` would be worth revisiting if the collection grew to the point where an extra round trip mattered more than code clarity.

**Filter dropdowns use `distinct()`, not a hardcoded list.** `/api/logs/filter-options` returns the actual distinct values present in the collection for `role`, `action`, `resourceType`, and `region` (severity and status are fixed enums, so those are hardcoded on the frontend). This means the filter UI always reflects real data rather than going stale if new action types or regions are introduced.

**Multi-select filters via comma-separated values.** Passing `severity=HIGH,CRITICAL` translates to a MongoDB `$in` query. This keeps the query string simple and avoids repeated-key array syntax (`severity[]=HIGH&severity[]=CRITICAL`), which some hosting/proxy layers mangle.

**Schema validation at the database layer.** `severity` and `status` are Mongoose enums, so malformed values are rejected at insert time rather than silently stored and causing bugs downstream in the UI.

**Debounced search input (400ms).** Prevents firing a request on every keystroke; the request only fires once the user pauses typing, cutting down unnecessary load on the `/api/logs` endpoint.

**Rate limiting and `helmet`.** Basic protections (300 requests/minute per client, standard security headers) since this API is reachable over the public internet for the deployed demo, even though it's designed as an internal tool.

**Request body limit of 15mb.** Sized to comfortably fit a 10,000-record batch (each record is a few hundred bytes) with headroom, while still rejecting abusive payloads.

**Dark, data-dense UI.** Built for engineers scanning many rows quickly: monospace type for actor emails, IPs, and resource paths (values people compare character-by-character), a compact severity indicator (colored tick) instead of a bulky badge on every row, and sticky table headers so column context stays visible while scrolling through paginated results.

---

## What's not included (out of scope for this exercise)

- Authentication/authorization (the brief doesn't specify a login flow; the API is currently open)
- Automated tests
- Real-time/streaming ingestion (bulk upload only, as specified)
