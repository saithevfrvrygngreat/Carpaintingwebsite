This project is set up to be deployed on Vercel.

## Deployment Steps

 **Important Warning**: This project uses local filesystem storage (`uploads/` folder) for images (gallery, avatars). **Vercel Serverless Functions are ephemeral and read-only.** Any image uploaded to the deployed site **WILL NOT PERSIST** and will disappear after a short time. For a production app, you MUST implement cloud storage like Cloudinary or AWS S3. The current deployment will work for the code and database, but image uploads will fail or vanish.

### Prerequisites

1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
2.  **GitHub Repository**: Push this code to a GitHub repository.
3.  **MongoDB Atlas**: You need a cloud-hosted database (e.g., MongoDB Atlas). Local `mongodb://` URLs will NOT work on Vercel.

### Step 1: Environment Variables

Prepare the following values:
- `MONGO_URI`: Your MongoDB Atlas connection string.
- `JWT_SECRET`: A secure random string.
- `EMAIL_USER` & `EMAIL_PASS`: For email functionality (optional, but code expects it).

### Step 2: Push to GitHub

Ensure your project structure is clean. Your repository should look like:
```
/backend
  package.json
  server.js
  vercel.json
  ...
/frontend
  package.json
  vite.config.js
  vercel.json
  ...
```

### Step 3: Deploy Frontend

1.  Go to Vercel Dashboard -> "Add New..." -> "Project".
2.  Import your GitHub repository.
3.  **Root Directory**: Click "Edit" and select `frontend`.
4.  **Framework Preset**: It should auto-detect "Vite".
5.  **Environment Variables**:
    - Add `VITE_API_URL`.
    - Value: `https://your-backend-project-name.vercel.app` (You won't have this URL until you deploy the backend. For the first deploy, you can leave it blank or put a placeholder, then redeploy later).
6.  Click **Deploy**.

### Step 4: Deploy Backend

1.  Go to Vercel Dashboard -> "Add New..." -> "Project".
2.  Import **the same** GitHub repository again.
3.  **Project Name**: Give it a different name (e.g., `car-painting-api`).
4.  **Root Directory**: Click "Edit" and select `backend`.
5.  **Framework Preset**: Select "Other" (or leave as Default).
6.  **Environment Variables**:
    - Add `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, etc.
7.  Click **Deploy**.

### Step 5: Connect Them

1.  Once the **Backend** is deployed, copy its domain (e.g., `https://car-painting-api.vercel.app`).
2.  Go to your **Frontend** project on Vercel > Settings > Environment Variables.
3.  Update (or Add) `VITE_API_URL` with the value of your backend URL (no trailing slash).
4.  Go to Deployments and **Redeploy** the latest commit of the Frontend to apply the new environment variable.

### Troubleshooting

-   **CORS Issues**: If the frontend can't talk to the backend, ensure your backend `server.js` CORS settings allow the frontend domain. You might need to update:
    ```javascript
    app.use(cors({
        origin: ["https://your-frontend.vercel.app", "http://localhost:5173"]
    }));
    ```
    (Currently it is `app.use(cors())` which enables all origins, so it should work fine for now).

-   **Database**: Ensure your MongoDB Atlas Network Access whitelist includes `0.0.0.0/0` (Allow Access from Anywhere) so Vercel can connect.
