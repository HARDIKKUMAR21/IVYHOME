#!/usr/bin/env python3
"""
Fetch all data from the Ivy Homes API and save to JSON files for analysis.
"""

import requests
import json
import time
import sys

API_KEY = "IVY26-ED62B530A404"
BASE_URL = "https://solve.ivy.homes"
PASSWORD = "f90f957386"
EMAIL = "demo1@ivy.homes"

def login():
    """Login and return access token."""
    resp = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": EMAIL, "password": PASSWORD},
        headers={"X-API-Key": API_KEY}
    )
    resp.raise_for_status()
    data = resp.json()
    print(f"Logged in as {EMAIL}, token expires in {data['expires_in']}s")
    return data["access_token"]

def get_headers(token):
    return {
        "X-API-Key": API_KEY,
        "Authorization": f"Bearer {token}"
    }

def fetch_all_pages(endpoint, token, limit=50):
    """Fetch all records from a paginated endpoint using offset-based pagination."""
    all_results = []
    offset = 0
    total = None
    retries = 0
    
    while True:
        try:
            resp = requests.get(
                f"{BASE_URL}{endpoint}",
                params={"limit": limit, "offset": offset},
                headers=get_headers(token),
                timeout=30
            )
        except requests.exceptions.RequestException as e:
            retries += 1
            if retries > 3:
                print(f"  Too many retries, stopping at {len(all_results)} records")
                break
            print(f"  Request error: {e}, retrying...")
            time.sleep(2)
            continue
        
        if resp.status_code == 401:
            print("Token expired, re-logging in...")
            token = login()
            retries += 1
            if retries > 5:
                break
            continue
        
        if resp.status_code != 200:
            print(f"  Error {resp.status_code}: {resp.text}")
            retries += 1
            if retries > 3:
                break
            time.sleep(1)
            continue
            
        retries = 0
        data = resp.json()
        
        if total is None:
            total = data.get("total", 0)
            print(f"  {endpoint}: total = {total}")
        
        results = data.get("results", [])
        if not results:
            break
            
        all_results.extend(results)
        
        if len(all_results) % 500 == 0 or not data.get("has_more", False):
            print(f"  Fetched {len(all_results)}/{total} records...")
        
        if not data.get("has_more", False):
            break
            
        offset += len(results)  # Use actual count returned
        
        # Small delay to avoid rate limiting
        time.sleep(0.05)
    
    return all_results, token

def main():
    print("=" * 60)
    print("Ivy Homes Data Fetcher")
    print("=" * 60)
    
    # Get health info
    health = requests.get(f"{BASE_URL}/health").json()
    print(f"Server time: {health['server_time']}")
    print(f"Reference date: {health['reference_date']}")
    
    # Login
    token = login()
    
    # Fetch listings
    print("\nFetching listings...")
    listings, token = fetch_all_pages("/v1/listings", token)
    with open("listings.json", "w") as f:
        json.dump(listings, f, indent=2)
    print(f"Saved {len(listings)} listings")
    
    # Fetch rentals
    print("\nFetching rentals...")
    rentals, token = fetch_all_pages("/v1/rentals", token)
    with open("rentals.json", "w") as f:
        json.dump(rentals, f, indent=2)
    print(f"Saved {len(rentals)} rentals")
    
    # Fetch projects
    print("\nFetching projects...")
    projects, token = fetch_all_pages("/v1/projects", token)
    with open("projects.json", "w") as f:
        json.dump(projects, f, indent=2)
    print(f"Saved {len(projects)} projects")
    
    # Try analytics endpoint variants
    print("\nTrying analytics endpoints...")
    for endpoint in ["/v1/analytics/summary", "/v1/analytics", "/analytics/summary", "/analytics"]:
        resp = requests.get(f"{BASE_URL}{endpoint}", headers=get_headers(token))
        print(f"  {endpoint}: {resp.status_code}")
        if resp.status_code == 200:
            with open("analytics.json", "w") as f:
                json.dump(resp.json(), f, indent=2)
            print(f"  Saved analytics data")
    
    print("\n" + "=" * 60)
    print("Data fetching complete!")
    print(f"  Listings: {len(listings)}")
    print(f"  Rentals:  {len(rentals)}")
    print(f"  Projects: {len(projects)}")
    print("=" * 60)

if __name__ == "__main__":
    main()
