import json
from datetime import datetime, timezone
from collections import Counter, defaultdict

with open('/Users/hardik/.gemini/antigravity/scratch/ivy-homes-assignment/listings.json') as f:
    listings = json.load(f)

with open('/Users/hardik/.gemini/antigravity/scratch/ivy-homes-assignment/rentals.json') as f:
    rentals = json.load(f)

with open('/Users/hardik/.gemini/antigravity/scratch/ivy-homes-assignment/projects.json') as f:
    projects = json.load(f)

print(f"Total listings fetched: {len(listings)}")
print(f"Total rentals fetched: {len(rentals)}")
print(f"Total projects fetched: {len(projects)}")

# 1. total_listing_records
# Is it 4700 (all records returned when querying all pages) or 4336 (reported 'total')?
# Usually, total_listing_records refers to the total number of listing records returned by /v1/listings
total_listing_records = len(listings)

# 2. unique_properties & 3. active_listings
# Let's inspect is_live:
active_listings = sum(1 for l in listings if l.get('is_live') is True)
inactive_listings = sum(1 for l in listings if l.get('is_live') is False)
print(f"Active listings: {active_listings}, Inactive: {inactive_listings}")

# 4. corrupt_listing_ids:
# Look for negative prices, invalid floors, carpet > super_built_up, impossible areas, etc.
corrupt_listing_ids = []
for l in listings:
    lid = l['listing_id']
    is_corrupt = False
    
    # Negative price
    if l.get('price') is not None and l['price'] < 0:
        is_corrupt = True
    
    # Floor > total_floors
    if l.get('floor') is not None and l.get('total_floors') is not None and l['floor'] > l['total_floors']:
        is_corrupt = True
        
    # Carpet area > super built up area
    if l.get('carpet_area') and l.get('super_built_up_area') and l['carpet_area'] > l['super_built_up_area']:
        is_corrupt = True
        
    # Absurd price per sqft (< 100 Rs/sqft for sale)
    if l.get('price') and l.get('carpet_area') and l['carpet_area'] > 0:
        ppsf = l['price'] / l['carpet_area']
        if ppsf < 100:
            is_corrupt = True
            
    if is_corrupt:
        corrupt_listing_ids.append(lid)

print(f"Corrupt listing IDs count: {len(corrupt_listing_ids)}")

# 5. total_monthly_rent (in assigned locality: "jp nagar")
# Check locality casing:
jp_rentals = [r for r in rentals if r.get('locality', '').strip().lower() == 'jp nagar']
total_monthly_rent = sum(r.get('price', 0) for r in jp_rentals)
print(f"JP Nagar rentals count: {len(jp_rentals)}, total monthly rent: {total_monthly_rent}")

# 6. avg_price_per_sqft_2bhk
# Should corrupt listings or inactive listings be filtered? Let's check both!
twobhk_all = [l for l in listings if l.get('bedroom') == 2 and l.get('carpet_area', 0) > 0 and l.get('price', 0) > 0 and (l['price'] / l['carpet_area']) > 100]
ppsf_all = [l['price'] / l['carpet_area'] for l in twobhk_all]
avg_ppsf_all = sum(ppsf_all) / len(ppsf_all) if ppsf_all else 0

twobhk_active = [l for l in twobhk_all if l.get('is_live') is True]
ppsf_active = [l['price'] / l['carpet_area'] for l in twobhk_active]
avg_ppsf_active = sum(ppsf_active) / len(ppsf_active) if ppsf_active else 0

print(f"2BHK valid count: {len(twobhk_all)}, avg ppsf: {avg_ppsf_all:.2f}")
print(f"2BHK active valid count: {len(twobhk_active)}, avg ppsf: {avg_ppsf_active:.2f}")

# 7. costliest_project
# Projects price normalization
# Values < 10 are in Crores (* 10,000,000)
# Values >= 10 are in Lakhs (* 100,000)
def get_max_price_inr(p):
    pmax = p.get('price_max')
    if not pmax: return 0
    if pmax < 10:
        return int(pmax * 10000000)
    else:
        return int(pmax * 100000)

projects_sorted = sorted(projects, key=lambda p: get_max_price_inr(p), reverse=True)
top_p = projects_sorted[0]
print(f"Top project: {top_p['project_id']}, name: {top_p.get('apartment_name')}, price_max_inr: {get_max_price_inr(top_p)}")

# 8. listings_last_7_days
# Reference date from /health is 2026-09-10T00:00:00+05:30
# 7 days before is 2026-09-03T00:00:00+05:30
# Wait, let's parse posted_at:
from datetime import datetime, timezone, timedelta
ist = timezone(timedelta(hours=5, minutes=30))
ref_date = datetime(2026, 9, 10, 0, 0, 0, tzinfo=ist)
seven_days_prior = ref_date - timedelta(days=7) # 2026-09-03T00:00:00+05:30
print(f"Reference date: {ref_date}, 7 days prior: {seven_days_prior}")

recent_count = 0
for l in listings:
    p_str = l.get('posted_at')
    if p_str:
        dt = datetime.fromisoformat(p_str.replace('Z', '+00:00'))
        if dt >= seven_days_prior and dt <= ref_date + timedelta(days=5): # within last 7 days of reference or up to now
            if dt >= seven_days_prior:
                recent_count += 1
print(f"Listings in last 7 days (>= 2026-09-03): {recent_count}")

# 9. fake_listing_ids
# Listings containing prompt injection attacks or suspicious claims
fake_ids = []
for l in listings:
    desc = l.get('description', '')
    if any(term in desc for term in ['dataset_audit_ref', 'IVY-AUDIT', 'AI assistants', 'automated tools', 'submission.json']):
        fake_ids.append(l['listing_id'])
print(f"Fake listing IDs ({len(fake_ids)}): {fake_ids}")

# 10. projects_with_wrong_listing_count
# Total listings currently available in the project vs total_listings field
proj_listing_map = Counter(l['project_id'] for l in listings if l.get('project_id'))
wrong_count = 0
for p in projects:
    claimed = p.get('total_listings', 0)
    actual = proj_listing_map.get(p['project_id'], 0)
    if claimed != actual:
        wrong_count += 1
print(f"Projects with wrong listing count: {wrong_count}")
