RightBuyer AI — Setup Guide (No Coding Needed)
You now have a real, working app, not a demo. When someone types in a product,
it actually gets analyzed by AI and gives a different answer every time.
There are 2 things to do:
Get a free AI key (5 minutes)
Put the app online (10 minutes)
---
Step 1: Get a free Groq API key
Groq is the AI provider. It's very cheap — many apps like this run entirely on
their free tier before you ever pay a cent.
Go to https://console.groq.com
Sign up (Google login is fine)
In the left menu, click API Keys
Click Create API Key, give it any name (e.g. "rightbuyer")
Copy the key it shows you — it looks like `gsk_xxxxxxxxxxxxxxxx`
Save it somewhere safe (Notes app, password manager). You can't view it again later.
---
Step 2: Put the app online with Vercel
Vercel is a hosting service. Free plan, no credit card required to start.
Go to https://vercel.com and sign up (use "Continue with GitHub" — it will
ask you to create a free GitHub account too if you don't have one. GitHub is
just where the app's files live.)
Once logged into Vercel, click Add New → Project
It will ask you to import a GitHub repository. You need to upload this folder
to GitHub first:
Go to https://github.com/new
Name the repository `rightbuyer-ai`, keep it Private or Public (either is fine), click Create repository
On the next page, click uploading an existing file
Drag and drop ALL the files/folders from this project (`api` folder, `public` folder, `package.json`) into the upload box
Click Commit changes
Go back to Vercel, click Add New → Project again, and now your `rightbuyer-ai`
repository will show up. Click Import.
Before clicking Deploy, open Environment Variables and add:
Name: `GROQ_API_KEY`
Value: (paste the key you copied in Step 1)
Click Add
Click Deploy. Wait ~1 minute.
Vercel gives you a live link like `https://rightbuyer-ai.vercel.app` — that's
your real, live product. Anyone can visit it and use it.
---
What it costs
Groq free tier: generous daily free usage — enough for testing and even
real early users. If you outgrow it, Groq's paid pricing is among the cheapest
of any AI provider (fractions of a cent per analysis).
Vercel free tier: enough for a small-to-medium amount of traffic, $0/month.
GitHub: free.
So you can run this for $0/month until you have real, meaningful usage.
---
Making changes later
If you ever want to change the text, colors, or how it works, come back to me,
tell me what you want changed, and I'll edit the files for you — you just
re-upload the changed file to GitHub (Vercel auto-updates the live site within
about a minute of any change).
If something breaks
If the "Find My Right Customers" button shows an error:
Double check the `GROQ_API_KEY` was pasted correctly in Vercel's Environment
Variables (Project → Settings → Environment Variables)
Come back here and paste me the exact error message — I'll fix it.
