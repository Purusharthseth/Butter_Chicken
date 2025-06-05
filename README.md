# Chapter Performance Dashboard - Backend API
## Overview

A RESTful API for managing and analyzing chapter performance data with Redis caching and rate-limiting. Built with Node.js, Express, MongoDB, and deployed on Railway.


### Deployment

The API is deployed on Railway: [butterchicken-production.up.railway.app](https://butterchicken-production.up.railway.app)

### Collection on postman
[![Run in Postman](https://run.pstmn.io/button.svg)](https://butter-chicken.postman.co/workspace/Team-Workspace~16c86b0c-80e8-4b52-80a2-8a61cbfbad69/collection/42572664-8861cf4a-895f-4e1d-87d7-a0512e3d0acc?action=share&creator=42572664)

## Features
#### ✅ Chapter Management

- Get all chapters with filtering (class, unit, status, subject)
- Get single chapter by ID
- Admin-only chapter upload via JSON file as well as json body data.

####  ⚡ Performance Optimizations

- Redis caching (1-hour TTL for /chapters)
- Automatic cache invalidation on new uploads
- Rate limiting (30 requests/minute per IP)

#### 📊 Pagination Support

- page and limit query params
- Returns total chapter count

## 📚 API Endpoints

| Method | Endpoint               | Description                     | Input Type            |
|--------|------------------------|----------------------------------|------------------------|
| GET    | /api/v1/chapters       | Get all chapters (filterable)    | –                      |
| GET    | /api/v1/chapters/:id   | Get single chapter               | –                      |
| POST   | /api/v1/chapters       | Upload chapters (Admin-only)     | JSON or File Upload    |

### 📝 POST /api/v1/chapters Input Types

| Input Type     | Content-Type           |
|----------------|------------------------|
| JSON Body      | `application/json`     | 
| File Upload    | `multipart/form-data`  |
