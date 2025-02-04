Technologies Used
Frontend: Next.js,  Tailwind CSS
Backend: Next.js API routes, Drizzle ORM
Database: PostgreSQL (neondb)
Authentication: Cookie-based session management
Styling: Geist fonts, Sonner toasts


#### Live
you have got to download and install [ollama](https://ollama.ai/) first, then download the [deepseek r1:1.5](https://ollama.com/library/deepseek-r1:1.5b) (the only model version supported now, later `7b` and `14b`, and stronger models like v2, v3 will be added)

after downloading the deepseek model, you just run
 `ollama run deepseek-r1:1.5b`,
  then 
 `ollama pull deepseek-r1:1.5b`
now go ahead and try the app to talk to your model <b>locally</b>.

#### Cloning (dev)
follow the steps in the [live section](https://github.com/Ebrahim-Ramadan/chatjj?tab=readme-ov-file#live) above, then clone this repo, and do not forget to add the `.env` file at the root, containing
```
DATABASE_URL='postgresql://neondb_owner:<your connection string>neondb?sslmode=require'

GOOGLE_CLIENT_ID = ""
GOOGLE_CLIENT_SECRET = ""
GOOGLE_REDIRECT_URI = "http://localhost:3000/api/GoogleCallBack"

NEXT_PUBLIC_GOOGLE_CLIENT_ID = ""
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET = ""
NEXT_PUBLIC_GOOGLE_REDIRECT_URI = "http://localhost:3000/api/GoogleCallBack"
```

then run 
`bun install`
 and 
`bun run dev`

now you will see something like `[PWA] PWA support is disabled` because PWA is not supported in development, I made it that way through `next.config.mjs` [here](https://github.com/Ebrahim-Ramadan/chatjj/blob/main/next.config.mjs) with `next-pwa` package, but you can remove it if you want. (this is the recommended way by the masters)

in the manifest file, I used a single high-resolution icon (512x512), the browser will automatically resize the icon as needed. However, this approach may not be ideal for all devices, as smaller icons may lose quality when resized.


<br/>
<br/>
<br/>
<br/>
-------------------------------------------------------
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

(for me) things to do
- [X] auth
- [X] db
- [X] google auth
- [X] neonDB queries and server actions & muations
- [X] stream chat
- [ ] dexie deletion