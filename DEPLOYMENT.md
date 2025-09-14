# Vercel Deployment Guide for hellodaho.com

## Quick Fix for 404 Error

The 404 error was caused by GitHub Pages configuration being used for Vercel deployment. Here's what was fixed:

### 1. Updated `next.config.js`
- Removed `basePath` and `assetPrefix` (only needed for GitHub Pages)
- Kept image optimization settings for Vercel

### 2. Updated Components
- Removed `basePath` references from Navbar and Footer components
- Simplified logo path handling

### 3. Added Vercel Configuration
- Created `vercel.json` with proper Next.js settings

## Deployment Steps

1. **Push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js
   - Use these settings:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm install`

3. **Environment Variables (Optional):**
   If you want to use environment variables for Firebase, add these in Vercel dashboard:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

   **Note:** The app will work without these as it has fallback values.

## Custom Domain Configuration (hellodaho.com)

### ⚠️ Important: Use Vercel, NOT GitHub Pages

**Your domain should be configured in Vercel, not GitHub Pages!**

### Step 1: Remove from GitHub Pages
1. Go to your GitHub repository settings
2. Navigate to **Pages** section  
3. **Remove** `hellodaho.com` from custom domain settings
4. This stops the DNS check errors

### Step 2: Configure in Vercel Dashboard
1. Go to your **Vercel Dashboard**
2. Select your project
3. Go to **Settings** → **Domains**
4. Add `hellodaho.com` as a custom domain
5. Add `www.hellodaho.com` (optional but recommended)

### Step 3: Update DNS Records
In your domain registrar, add these DNS records:

**Option A: CNAME Records (Recommended)**
```
Type: CNAME
Name: hellodaho.com
Value: cname.vercel-dns.com

Type: CNAME  
Name: www.hellodaho.com
Value: cname.vercel-dns.com
```

**Option B: A Records**
```
Type: A
Name: hellodaho.com
Value: 76.76.19.61

Type: A
Name: www.hellodaho.com  
Value: 76.76.19.61
```

### Step 4: SSL Certificate
- Vercel automatically provides SSL certificates for custom domains
- Your site will be accessible via HTTPS

## What Was Fixed

- ❌ **Before:** `basePath: '/alidaho.github.io'` (GitHub Pages specific)
- ✅ **After:** No basePath (Vercel compatible)

- ❌ **Before:** `assetPrefix: '/alidaho.github.io/'` (GitHub Pages specific)  
- ✅ **After:** No assetPrefix (Vercel compatible)

- ❌ **Before:** Logo paths with basePath concatenation
- ✅ **After:** Direct logo paths from Firebase

## Testing

After deployment, your site should be accessible at:
- **Custom Domain:** https://hellodaho.com/
- **Vercel Domain:** [your-project].vercel.app

Both should work without any 404 errors.

## For GitHub Pages (if needed later)

If you want to deploy to GitHub Pages later, use the `next.config.prod.js` file and update the components to include basePath logic.
