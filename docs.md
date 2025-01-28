# API Documentation

## Auth Endpoints

### Logout
- **Endpoint:** `/app/api/auth/logout`
- **Request Type:** `POST`
- **Required Data:** None (session is validated internally)

### Roblox Callback
- **Endpoint:** `/app/api/auth/roblox/callback`
- **Request Type:** `GET`
- **Required Data:**
  - `code`: The authorization code received from Roblox.

### User Info
- **Endpoint:** `/app/api/auth/user`
- **Request Type:** `GET`
- **Required Data:** None (session is validated internally)

## Debug Endpoints

### Debug Request
- **Endpoint:** `/app/api/debug/[endpoint]`
- **Request Type:** `GET`
- **Required Data:**
  - `endpoint`: The specific endpoint to debug (e.g., `user`, `product`, `purchase`).

## Product Endpoints

### Product Details
- **Endpoint:** `/app/api/products/[id]`
- **Request Type:** `GET`
- **Required Data:**
  - `id`: The ID of the product to fetch.

### All Products
- **Endpoint:** `/app/api/products`
- **Request Type:** `GET`
- **Required Data:** None

### Product Thumbnails
- **Endpoint:** `/app/api/products/thumbnails`
- **Request Type:** `GET`
- **Required Data:**
  - `ids`: Comma-separated list of item IDs.

## Store Endpoints

### Check Store
- **Endpoint:** `/app/api/stores/check`
- **Request Type:** `GET`
- **Required Data:**
  - `userId`: The ID of the user.
  - `groupId`: The ID of the group.

### Create Store
- **Endpoint:** `/app/api/stores/create`
- **Request Type:** `POST`
- **Required Data:**
  - `userId`: The ID of the user.
  - `groupId`: The ID of the group.
  - `name`: The name of the store.
  - `description`: A description of the store.
  - `slug`: A unique slug for the store.

### Update Store Slug
- **Endpoint:** `/app/api/stores/slug/update`
- **Request Type:** `PATCH`
- **Required Data:**
  - `slug`: The new slug for the store.
  - `userId`: The ID of the user (from URL params).
  - `groupId`: The ID of the group (from URL params).

## Thumbnail Endpoints

### Fetch Thumbnail
- **Endpoint:** `/app/api/thumbnails`
- **Request Type:** `GET`
- **Required Data:**
  - `id`: The ID of the asset to fetch the thumbnail for.

## User Endpoints

### User Data
- **Endpoint:** `/app/api/users`
- **Request Type:** `GET`
- **Required Data:**
  - `userId`: The ID of the user (from query parameters).
