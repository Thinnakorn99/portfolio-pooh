# Portfolio Blog API

REST API for portfolio blog posts. Data is stored in MongoDB, so posts and analytics values persist after restarting the API server.

## Requirements

- Node.js 18+
- MongoDB Atlas or local MongoDB
- `.env` file for configuration

## Setup

Install dependencies:

```bash
npm install
```

Create `.env` from the example file:

```powershell
Copy-Item .env.example .env
```

Then edit `.env`:

```env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=portfolio_blog
MONGODB_POSTS_COLLECTION=posts
```

For MongoDB Atlas, paste your Atlas connection string into `MONGODB_URI`. Do not commit `.env` because it can contain username, password, or secrets.

## MongoDB Setup

### Option 1: Local MongoDB

1. Install MongoDB Community Server.
2. Start the MongoDB service.
3. Use this URI in `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=portfolio_blog
MONGODB_POSTS_COLLECTION=posts
```

### Option 2: MongoDB Atlas

1. Create a MongoDB Atlas project and cluster.
2. Create a database user.
3. Add your IP address in Network Access.
4. Copy the driver connection string.
5. Put the connection string in `.env` as `MONGODB_URI`.

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster-url/?retryWrites=true&w=majority
MONGODB_DB_NAME=portfolio_blog
MONGODB_POSTS_COLLECTION=posts
```

If `mongodb+srv://` has DNS issues, use the non-SRV connection string from Atlas that starts with `mongodb://`.

## Run API

```bash
npm run api
```

Success output:

```text
Blog API is running at http://localhost:3001
Connected to MongoDB database: portfolio_blog
```

## Resource: posts

Post object fields:

```json
{
  "id": "MongoDB ObjectId string",
  "title": "Post title",
  "content": "Post content",
  "createdAt": "2026-06-10T00:00:00.000Z",
  "views": 0
}
```

Notes:

- MongoDB stores the real id as `_id`.
- The API returns `_id` as `id` for easier client use.
- `createdAt` is created by the server when `POST /posts` runs.
- `views` starts at `0` and increases with `POST /posts/:id/view`.

## Endpoints

### GET /

Check that the API is running and list available routes.

```powershell
Invoke-RestMethod http://localhost:3001/ | ConvertTo-Json -Depth 5
```

### GET /posts

Get all posts from MongoDB.

```powershell
Invoke-RestMethod http://localhost:3001/posts | ConvertTo-Json -Depth 5
```

### POST /posts

Create a new post in MongoDB. New posts start with `views: 0`.

```powershell
Invoke-RestMethod -Method Post http://localhost:3001/posts `
  -ContentType 'application/json' `
  -Body '{"title":"My first post","content":"Hello from MongoDB API"}' |
  ConvertTo-Json -Depth 5
```

Validation rules:

- `title` must be a non-empty string.
- `content` must be a non-empty string.

### GET /posts/:id

Get one post by id.

```powershell
Invoke-RestMethod http://localhost:3001/posts/POST_ID_HERE | ConvertTo-Json -Depth 5
```

### POST /posts/:id/view

Increase a post view count by 1. This value is saved in MongoDB.

```powershell
Invoke-RestMethod -Method Post http://localhost:3001/posts/POST_ID_HERE/view | ConvertTo-Json -Depth 5
```

Example response:

```json
{
  "data": {
    "id": "POST_ID_HERE",
    "title": "My first post",
    "content": "Hello from MongoDB API",
    "createdAt": "2026-06-10T00:00:00.000Z",
    "views": 1
  }
}
```

### DELETE /posts/:id

Delete a post by id.

```powershell
Invoke-RestMethod -Method Delete http://localhost:3001/posts/POST_ID_HERE | ConvertTo-Json -Depth 5
```

Example response:

```json
{
  "data": {
    "id": "POST_ID_HERE",
    "deleted": true
  }
}
```

### GET /analytics/top-posts

Get the top 3 posts with the highest `views` count.

```powershell
Invoke-RestMethod http://localhost:3001/analytics/top-posts | ConvertTo-Json -Depth 5
```

Example response:

```json
{
  "data": [
    {
      "id": "POST_ID_HERE",
      "title": "Most viewed post",
      "content": "Post content",
      "createdAt": "2026-06-10T00:00:00.000Z",
      "views": 5
    }
  ],
  "count": 1
}
```

## Task 3 Test Flow

Run the API in Terminal 1:

```powershell
npm run api
```

Use Terminal 2 for testing:

```powershell
Invoke-RestMethod -Method Post http://localhost:3001/posts `
  -ContentType 'application/json' `
  -Body '{"title":"Analytics Test","content":"Testing views and top posts"}' |
  ConvertTo-Json -Depth 5
```

Copy the returned `id`, then increase views:

```powershell
Invoke-RestMethod -Method Post http://localhost:3001/posts/POST_ID_HERE/view | ConvertTo-Json -Depth 5
Invoke-RestMethod -Method Post http://localhost:3001/posts/POST_ID_HERE/view | ConvertTo-Json -Depth 5
```

Check analytics:

```powershell
Invoke-RestMethod http://localhost:3001/analytics/top-posts | ConvertTo-Json -Depth 5
```

## Persistence Behavior

- Posts are saved in MongoDB.
- `views` are saved in MongoDB.
- Restarting the API does not delete data if the same MongoDB instance is used.
- There is no in-memory posts array anymore.



## Docker Run

Task 4 adds Docker support for running the API and MongoDB together with one command.

Files:

- `Dockerfile` builds the API container.
- `docker-compose.yml` runs both API and MongoDB.
- `.dockerignore` keeps local files such as `node_modules`, `dist`, and `.env` out of the image.

Run the full system:

```powershell
docker compose up --build
```

The API will be available at:

```text
http://localhost:3001
```

MongoDB runs inside Docker as service `mongo`. The API uses this connection string inside compose:

```env
MONGODB_URI=mongodb://mongo:27017
MONGODB_DB_NAME=portfolio_blog
MONGODB_POSTS_COLLECTION=posts
```

The MongoDB data is persisted in a Docker volume named `mongo-data`, so data remains after containers stop.

If you want to connect MongoDB Compass to the Docker MongoDB, use:

```text
mongodb://localhost:27018
```

Stop containers:

```powershell
docker compose down
```

Stop containers and delete MongoDB Docker data:

```powershell
docker compose down -v
```

### Docker Test Commands

Open a second terminal after `docker compose up --build` is running.

Create a post:

```powershell
$post = Invoke-RestMethod -Method Post http://localhost:3001/posts `
  -ContentType 'application/json' `
  -Body '{"title":"Docker Test","content":"Running API and MongoDB with Docker Compose"}'

$post | ConvertTo-Json -Depth 5
```

Increase views:

```powershell
Invoke-RestMethod -Method Post "http://localhost:3001/posts/$($post.data.id)/view" | ConvertTo-Json -Depth 5
```

Check top posts:

```powershell
Invoke-RestMethod http://localhost:3001/analytics/top-posts | ConvertTo-Json -Depth 5
```

## Project Scripts

```bash
npm run dev      # run frontend Vite dev server
npm run build    # build frontend
npm run preview  # preview frontend build
npm run api      # run blog REST API with MongoDB
```

## Troubleshooting

### Missing required environment variable: MONGODB_URI

Create `.env` from `.env.example` and set `MONGODB_URI`.

### MongoServerSelectionError

Check that MongoDB is running, the connection string is correct, Atlas IP access is allowed, and username/password are correct.

### Invalid post id

`GET /posts/:id`, `POST /posts/:id/view`, and `DELETE /posts/:id` need a valid MongoDB ObjectId returned by the API.




## Task 5: CI/CD and Docker Hub Image Publishing

This project uses GitHub Actions to simulate a production image publishing workflow.

Workflow file:

```text
.github/workflows/publish-docker-image.yml
```

### What the Workflow Does

1. Runs when code is pushed to `main`, `master`, or `poohseo92`.
2. Checks out the repository in GitHub Actions.
3. Sets up Docker Buildx.
4. Logs in to Docker Hub using GitHub Secrets.
5. Builds the API Docker image from `Dockerfile`.
6. Pushes the image to Docker Hub with two tags:
   - `latest`
   - `v1`

### Required GitHub Secrets

Create these secrets in GitHub repository settings:

```text
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
```

Do not hardcode Docker Hub username or token in the workflow file.

Recommended setup:

1. Go to Docker Hub.
2. Create an access token from Account Settings > Personal access tokens.
3. Go to GitHub repository > Settings > Secrets and variables > Actions.
4. Add `DOCKERHUB_USERNAME` with your Docker Hub username.
5. Add `DOCKERHUB_TOKEN` with your Docker Hub access token.

### Docker Image

After the workflow succeeds, the image will be available at:

```text
https://hub.docker.com/r/mheepooh1150/portfolio-blog-api
```

Pull the latest image:

```powershell
docker pull mheepooh1150/portfolio-blog-api:latest
```

Pull the versioned image:

```powershell
docker pull mheepooh1150/portfolio-blog-api:v1
```

Run the published image manually:

```powershell
docker run --rm -p 3001:3001 `
  -e MONGODB_URI="mongodb://host.docker.internal:27017" `
  -e MONGODB_DB_NAME="portfolio_blog" `
  -e MONGODB_POSTS_COLLECTION="posts" `
  mheepooh1150/portfolio-blog-api:latest
```

The production workflow keeps secrets in GitHub Actions, builds the Docker image in CI, and publishes image tags that can be pulled by deployment servers later.
