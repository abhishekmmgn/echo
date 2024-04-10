# Echo App

A messaging application



<!-- ADD IMAGES -->










## Get Started

### Set environment variables

#### Client Directory

- Go to Auth0 and create account.

- Create a new regualar web app (React).

- Create a **.env.local** file in the **client** directory.

- Now head on to env.txt file in the root dir of this project and copy the **env** titles and paste the **CLIENT** ID and **DOMAIN**.

- Then create account of [Firebase](https://console.firebase.google.com), and create an application.

- Now paste the **API KEY** to all the other configuration details which firebase gives.

#### Server directory

- Create a new account on [CockroachDB](https://cockroachlabs.cloud/).

- Create new project & copy the database configuration string.

- Sly, `cd` to **server** and paste cockroachdb url in **env.local**.

### Installation and setup

First, `cd` to server directory.

Then, install packages using `bun install` command.

Now, run the server with `bun --watch index.ts`.

On new terminal `cd client`.

Install packages using `npm i` or `npm install`.

For development, `use npm run dev`.

For production, first build it using `npm run build`.

Then, run with `npm run start`.

For, prisma studio, on new terminal `cd` to server directory.

Next, run `npx prisma studio` or `prisma studio`.
