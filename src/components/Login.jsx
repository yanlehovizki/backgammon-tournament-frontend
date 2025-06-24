# Frontend Deployment Guide for AWS Amplify (Beginner-Friendly)

## Overview

This guide will walk you through deploying your Backgammon Tournament System React frontend to AWS Amplify, step-by-step. AWS Amplify is a service that makes it incredibly easy to host modern web applications. It handles everything from building your code to deploying it globally, and even setting up secure connections (HTTPS) automatically. It's perfect for beginners because it simplifies many complex deployment tasks.

## Prerequisites: What You Need Before You Start

Before we begin, make sure you have the following:

-   **An AWS Account**: You'll need an active Amazon Web Services (AWS) account. If you don't have one, you can sign up for a free tier account at [aws.amazon.com](https://aws.amazon.com/).
-   **Your React Frontend Code**: Ensure you have the `backgammon-frontend` folder (containing your React application code, `package.json`, `amplify.yml`, `vite.config.js`, `src/config/api.js`, and `prepare-deploy.sh`) ready on your local computer. This is the code we'll be deploying.
-   **A Git Repository**: Your frontend code needs to be in a Git repository (like GitHub, GitLab, Bitbucket, or AWS CodeCommit). AWS Amplify connects directly to your repository to automate deployments.
    -   If your code is not yet in a Git repository, you'll need to initialize one and push your code. I'll show you how in Step 1.
-   **Your Backend API URL**: You should have already deployed your Flask backend to AWS Lightsail (as per the Backend Deployment Guide). You'll need the public IP address or custom domain of your Lightsail instance (e.g., `http://YOUR_LIGHTSAIL_IP` or `https://api.yourdomain.com`). This is how your frontend will talk to your backend.

## Step 1: Prepare Your Code for Deployment (Getting Your Code Ready)

AWS Amplify deploys your application directly from a Git repository. If your `backgammon-frontend` code is not yet in a Git repository, follow these steps. If it already is, you can skip to Step 1.3.

### 1.1: Initialize a Git Repository (If You Haven't Already)

This creates a local Git repository in your project folder.

1.  **Open your local terminal or command prompt**.
2.  **Navigate to your frontend project directory**:
    ```bash
    cd /path/to/your/backgammon-frontend
    ```
    (Replace `/path/to/your/backgammon-frontend` with the actual path to your project folder).
3.  **Initialize Git**: 
    ```bash
    git init
    ```
4.  **Add all your project files to Git**: 
    ```bash
    git add .
    ```
5.  **Commit your changes**: 
    ```bash
    git commit -m "Initial commit - Backgammon Tournament Frontend"
    ```

### 1.2: Push Your Code to a Remote Repository (e.g., GitHub)

Now, you need to push your local Git repository to a remote hosting service like GitHub. If you don't have a remote repository yet, create an empty one on your preferred platform (e.g., GitHub, GitLab).

1.  **Add your remote repository URL**: 
    ```bash
    git remote add origin https://github.com/yourusername/backgammon-frontend.git
    ```
    (Replace `https://github.com/yourusername/backgammon-frontend.git` with the actual URL of your empty remote repository).
2.  **Rename your default branch to `main` (optional but recommended)**:
    ```bash
    git branch -M main
    ```
3.  **Push your code to the remote repository**: 
    ```bash
    git push -u origin main
    ```
    -   You might be prompted to enter your Git username and password/personal access token.

    *Your code is now safely stored in your remote Git repository!*

### 1.3: Verify Your Repository Structure

Before connecting to Amplify, quickly check that your repository contains the necessary files for Amplify to build your application correctly. These files should be at the root of your `backgammon-frontend` project folder:

-   `package.json`: Defines your project and its dependencies.
-   `amplify.yml`: This is a special file that tells AWS Amplify how to build and deploy your application. (I've already created this for you).
-   `vite.config.js`: Your React project's build configuration (if you're using Vite, which this project does).
-   `.env.production`: A template for production environment variables.
-   `src/config/api.js`: The file where your frontend's API base URL is configured.
-   `prepare-deploy.sh`: A script to help prepare your frontend for deployment.

## Step 2: Update Your Frontend's API Configuration (Connecting to Your Backend)

Your frontend application needs to know where your backend API is located. We'll update a file in your frontend code to point to your deployed Lightsail backend.

1.  **Open the `src/config/api.js` file** in your `backgammon-frontend` project using a text editor (like VS Code, Sublime Text, Notepad++).

2.  **Find the `API_BASE_URL` variable**.

3.  **Replace the placeholder URL** with the actual public IP address or custom domain of your Lightsail backend instance (e.g., `http://YOUR_LIGHTSAIL_IP` or `https://api.yourdomain.com`).

    *Example of `src/config/api.js` after update:*
    ```javascript
    // API configuration utility
    export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 

