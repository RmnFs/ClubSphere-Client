# How to Set Up Firebase for ClubSphere

The `VITE_` keys in your `.env` file are actually **Firebase** configuration keys. Vite requires them to start with `VITE_` to be visible in your browser. You do not need a "Vite account".

## Step 1: Create a Firebase Project
1.  Go to [console.firebase.google.com](https://console.firebase.google.com/) and log in with your Google account.
2.  Click **"Add project"**.
3.  Name it `ClubSphere` (or anything you like).
4.  Disable Google Analytics (for simplicity) and click **"Create project"**.

## Step 2: Register the App
1.  Look for the white button **"+ Add app"** under the "ClubSphere" title (or the **Web `</>` icon** if visible).
2.  Click **"+ Add app"**, then select the **Web** platform (icon looks like `</>`).
3.  App nickname: `ClubSphere-Client`.
4.  Click **"Register app"**.

## Step 3: Get Your Keys
1.  You will see a code block with `const firebaseConfig = { ... }`.
2.  Copy the values from there into your `.env` file in the `client` folder.

Example mapping:
*   `apiKey` -> `VITE_APIKEY`
*   `authDomain` -> `VITE_AUTHDOMAIN`
*   `projectId` -> `VITE_PROJECTID`
*   `storageBucket` -> `VITE_STORAGEBUCKET`
*   `messagingSenderId` -> `VITE_MESSAGINGSENDERID`
*   `appId` -> `VITE_APPID`

## Step 4: Enable Authentication
1.  Go to **Build** > **Authentication** in the sidebar.
2.  Click **"Get started"**.
3.  Select **"Google"**, enable it, and save.
4.  Select **"Email/Password"**, enable it, and save.

## Step 5: Restart
1.  Stop your running terminal (Ctrl+C).
2.  Run `npm run dev` again.
