Technologies Used
Frontend: Next.js,  Tailwind CSS
Backend: Next.js API routes, Drizzle ORM
Database: PostgreSQL (neondb)
Authentication: Cookie-based session management
Styling: Geist fonts, Sonner toasts


you have got to download and install [ollama](https://ollama.ai/) first, then download the [deepseek r1:1.5](https://ollama.com/library/deepseek-r1:1.5b) (just for now, later planning to add versions like `7b` and `14b`, and also stronger models like v2, v3, etc.)

after downloading the deepseek model, you just run `ollama run deepseek-r1:1.5b`, then `ollama pull deepseek-r1:1.5b`
now go ahead and try the app to talk to your model <b>locally</b>.

(for me) things to do
- [X] auth
- [X] db
- [X] google auth
- [X] neonDB queries and server actions & muations
- [X] stream chat
- [ ] dexie deletion