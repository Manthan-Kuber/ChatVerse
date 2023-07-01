# ChatVerse

[ChatVerse](https://chat-verse-omega.vercel.app/) is a real-time chat app powered by web sockets<br>
Entirely made by yours truly from UI/UX to Deployment with minute attention to detail<br>
Built with my absolute favourite programming language - TypeScript<br>
Here's the [Socket Server GitHub Repo](https://github.com/Manthan-Kuber/ChatVerseSocketServer)<br>  
Don't forget to ⭐ the repo 

## Tech Stack

[![My Skills](https://skillicons.dev/icons?i=ts)](https://www.typescriptlang.org/)
[![My Skills](https://skillicons.dev/icons?i=next)](https://nextjs.org/)
[![My Skills](https://skillicons.dev/icons?i=tailwind)](https://tailwindcss.com/)
[![My Skills](https://skillicons.dev/icons?i=nodejs)](https://nodejs.org)
[![My Skills](https://skillicons.dev/icons?i=express)](https://expressjs.com)
[![My Skills](https://skillicons.dev/icons?i=supabase)](https://supabase.com/)
[![My Skills](https://skillicons.dev/icons?i=prisma)](https://www.prisma.io/)
[![My Skills](https://skillicons.dev/icons?i=vercel)](https://vercel.com/)

- Built with `create-t3-app` i.e the T3 stack minus tRPC. 
- Built Entirely in **TypeScript**
- Uses **NextJS** for FullStack development framework
- Uses **TailwindCSS** as a CSS framework 
- Uses **Supabase** as BaaS which use **PostgreSQL** under the hood
- Uses **Prisma** as ORM
- Uses a **hybrid backend architecture** consisting of:
    1. NextJS's **serverless functions** to perform database queries
    2. **NodeJs + ExpressJs** server to facilitate realtime websocket based **full duplex** communication
- Uses [Socket.IO](https://socket.io/) for managaing websocket communication
- Uses [NextAuth](https://next-auth.js.org/) for managing authentication
- Uses a SMTP server for password-less e-mail based authentication
- Uses vercel's [SWR](https://swr.vercel.app/)(stale-while-revalidate) react hooks for data fetching,caching and (re)validation

