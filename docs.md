# API Documentation

## Authentication

### Logout

- **Endpoint:** `/api/auth/logout`
- **Request Type:** `POST`
- **Required Data:** None (session is validated internally)
- **Response:**
  - `200`: Logged out successfully
  - `302`: Redirect to home page

### Roblox OAuth Callback

- **Endpoint:** `/api/auth/roblox/callback`
- **Request Type:** `GET`
- **Required Data:** `code` (query parameter)
- **Response:**
  - `302`: Redirect to home page on success
  - `302`: Redirect to error page on failure

### Get User

- **Endpoint:** `/api/auth/user`
- **Request Type:** `GET`
- **Required Data:** None (session is validated internally)
- **Response:**
  - `200`: User data
  - `200`: `{ user: null }` if no user found

## Groups

### Fetch Group

- **Endpoint:** `/api/groups/fetch`
- **Request Type:** `GET`
- **Required Data:** `groupId` (query parameter)
- **Response:**
  - `200`: Group data
  - `401`: Unauthorized
  - `400`: Group ID is required
  - `500`: Failed to fetch group data

### Fetch Group Products

- **Endpoint:** `/api/groups/products/fetch`
- **Request Type:** `GET`
- **Required Data:** `groupId` (query parameter)
- **Response:**
  - `200`: Group products data
  - `401`: Unauthorized
  - `400`: groupId is required
  - `500`: Failed to fetch store items

## Products

### Get Product Thumbnail

- **Endpoint:** `/api/products/thumbnail`
- **Request Type:** `GET`
- **Required Data:** `id` (query parameter)
- **Response:**
  - `200`: `{ thumbnailUrl: string }`
  - `400`: Product ID is required
  - `404`: Thumbnail not found
  - `500`: Internal server error

## Search

### Search Stores

- **Endpoint:** `/api/search/stores`
- **Request Type:** `GET`
- **Required Data:** `keyword` (query parameter, optional)
- **Response:**
  - `200`: Array of matching stores
  - `500`: Failed to fetch search results

## Stores

### Get Store by Slug

- **Endpoint:** `/api/stores/[slug]`
- **Request Type:** `GET`
- **Required Data:** `slug` (route parameter)
- **Response:**
  - `200`: Store and products data
  - `401`: Unauthorized
  - `404`: Store not found
  - `500`: Failed to fetch store and products

### Check Existing Store

- **Endpoint:** `/api/stores/check`
- **Request Type:** `GET`
- **Required Data:** `userId` and `groupId` (query parameters)
- **Response:**
  - `200`: Existing store data or null
  - `401`: Unauthorized
  - `400`: Missing userId or groupId
  - `500`: Failed to check existing store

### Create Store

- **Endpoint:** `/api/stores/create`
- **Request Type:** `POST`
- **Required Data:** `userId`, `groupId`, `name`, `slug` (in request body)
- **Response:**
  - `201`: Created store data
  - `500`: Failed to create store or update user

### Fetch Store Items

- **Endpoint:** `/api/stores/fetch`
- **Request Type:** `GET`
- **Required Data:** `groupId` (query parameter)
- **Response:**
  - `200`: Store items data
  - `401`: Unauthorized
  - `400`: groupId is required
  - `500`: Failed to fetch store items

### Update Store Slug

- **Endpoint:** `/api/stores/slug/update`
- **Request Type:** `PATCH`
- **Required Data:** `slug` (in request body), `userId` and `groupId` (in route parameters)
- **Response:**
  - `200`: Updated store data
  - `401`: Unauthorized
  - `500`: Failed to update slug

## Thumbnails

### Get Thumbnail

- **Endpoint:** `/api/thumbnails`
- **Request Type:** `GET`
- **Required Data:** `id` (query parameter)
- **Response:**
  - `200`: `{ success: true, data: string }` (thumbnail URL)
  - `400`: No ID provided
  - `500`: Failed to fetch thumbnail

## Users

### Get User Data

- **Endpoint:** `/api/users`
- **Request Type:** `GET`
- **Required Data:** `userId` (query parameter)
- **Response:**
  - `200`: User data
  - `401`: Unauthorized
  - `500`: Failed to fetch user data
