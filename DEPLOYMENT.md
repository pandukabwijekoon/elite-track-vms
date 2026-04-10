# EliteTrack Deployment Phase: Operational Launch 🚀

Your project is now configured for a **Monolithic Production Build**. This manual will guide you through making the website visible to everyone on the internet.

## 🏁 Step 1: Preparation
1.  **MongoDB Atlas**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
    - Create a Database User.
    - Allow IP access from `0.0.0.0/0` (for deployment).
    - Copy your **Connection String**.

## ☁️ Step 2: Deploying to Render.com
1.  **Sign Up**: Create an account on [Render.com](https://render.com).
2.  **New Web Service**: Click **New +** > **Web Service**.
3.  **Connect Repo**: Connect your GitHub account and select your `elite-track-vms` repository.
4.  **Configuration**:
    - **Name**: `elite-track` (or any name you prefer).
    - **Environment**: `Node`
    - **Build Command**: `npm run build`
    - **Start Command**: `npm start`
5.  **Environment Variables**: Click **Advanced** and add these:
    - `NODE_ENV`: `production`
    - `MONGO_URI`: (Your MongoDB Connection String)
    - `JWT_SECRET`: (A random long string)
    - `JWT_EXPIRE`: `30d`
    - `VITE_API_URL`: `/api` (This is important for the monolithic setup)

## 🎯 Step 3: Final Launch (Git Push)
Now, run these commands to push the final production code to GitHub:

```bash
git add .
git commit -m "Deployment Readiness: Monolithic Build Engine"
git push
```

**Once you push these changes and set up the Render service, your website will be live at a URL like `https://elite-track.onrender.com`!**
