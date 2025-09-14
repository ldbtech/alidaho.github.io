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

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Domains" section
   - Add `hellodaho.com` as a custom domain
   - Add `www.hellodaho.com` as well (optional but recommended)

2. **DNS Configuration:**
   - Add a CNAME record pointing `hellodaho.com` to `cname.vercel-dns.com`
   - Add a CNAME record pointing `www.hellodaho.com` to `cname.vercel-dns.com`
   - Or use A records pointing to Vercel's IP addresses

3. **SSL Certificate:**
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
