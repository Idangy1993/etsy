# Etsy OAuth Setup for Complete Listings Access

## Problem

The public Etsy API with application API key only shows 11 listings instead of all 17 active listings in your shop.

## Solution

Switch to OAuth authentication to access all listings, including:

- Recently activated or edited listings
- Not yet indexed listings
- Region-limited listings
- Temporary filtered listings

## Setup Steps

### 1. Create .env.local file

Create a `.env.local` file in your project root with:

```env
# Etsy OAuth Configuration
ETSY_ACCESS_TOKEN=your_real_oauth_token_here
ETSY_SHOP_ID=your_shop_id_here
ETSY_SHOP_NAME=StraightBackwards

# Other existing config...
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Get OAuth Access Token

1. Go to [Etsy Developer Portal](https://www.etsy.com/developers/)
2. Create/configure your app with `listings_r` scope
3. Complete OAuth flow to get access token
4. Add the token to `ETSY_ACCESS_TOKEN` in `.env.local`

### 3. Get Shop ID

Your shop ID is the numeric ID from your Etsy shop URL or API responses.

## API Endpoints

### Get All Active Listings

```
GET /api/etsy/get-listings
```

Returns all active listings using OAuth authentication.

### Get Shop Stats

```
GET /api/etsy/getStats
```

Returns shop statistics using OAuth authentication.

## Changes Made

1. **Updated `lib/etsy.ts`**:

   - `getActiveListings()` now uses `Authorization: Bearer {token}` instead of `x-api-key`
   - Added better error handling

2. **Created `/api/etsy/get-listings.ts`**:

   - New endpoint specifically for fetching all listings
   - Uses `ETSY_ACCESS_TOKEN` environment variable
   - Includes proper error handling for missing config

3. **Updated `/api/etsy/getStats.ts`**:
   - Now uses `ETSY_ACCESS_TOKEN` instead of `ETSY_API_TOKEN`
   - Added validation for required environment variables

## Success Criteria

✅ API returns all 17 listings (not just 11)  
✅ OAuth is used for authentication  
✅ No hardcoded tokens in code  
✅ Secure token management via environment variables
