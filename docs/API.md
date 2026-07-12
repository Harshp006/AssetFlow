METHOD    ENDPOINT                     DESCRIPTION

POST      /api/auth/login              Login

GET       /api/assets                  Get all assets
GET       /api/assets/:id              Get asset
POST      /api/assets                  Create asset
PUT       /api/assets/:id              Update asset
DELETE    /api/assets/:id              Delete asset

POST      /api/allocations/request
POST      /api/allocations/approve
POST      /api/allocations/return

POST      /api/transfers/request
POST      /api/transfers/approve

POST      /api/bookings
PUT       /api/bookings/:id
DELETE    /api/bookings/:id

POST      /api/maintenance
PUT       /api/maintenance/:id

GET       /api/dashboard

GET       /api/notifications