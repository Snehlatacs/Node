# DevTinder APIs

**authRouters**

- POST /signp
- POST /login
- POST /logout

**profileRouters**

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

**connectionRequestRouters**

- POST /request/send/interest/:userId
- POST /request/send/interest/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

**userRouters**

- GET /user/connections
- GET /user/requests
- GET /user/feed - gets you the profile of other users on platform
