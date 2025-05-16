# Legal Frontend Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   **Node.js**: Make sure you have Node.js version 20 or newer installed. You can download it from [nodejs.org](https://nodejs.org/).
    *   It's recommended to use the Node.js version specified in the `engines` field of your `package.json` file, or the latest Long Term Support (LTS) version if not specified.

### Environment Variables

This project uses environment variables to manage configuration settings, such as API endpoints.

1.  **Create a local environment file**:
    Copy the example environment file to a new file named `.env`. You can do this by running the following command in your terminal from the project root:

    ```bash
    cp .env.example .env
    ```

2.  **Configure variables**:
    Open the `.env` file and update the variables as needed. For example:

    ```env
    NEXT_PUBLIC_BACKEND_URL=http://your-backend-api-url.com
    ```
    Replace `http://your-backend-api-url.com` with the actual URL of your backend service.


### Installation & Development

1.  **Install dependencies**:
    Navigate to the project directory and install the required dependencies:

    ```bash
    npm install
    ```
    Alternatively, you can use `yarn install`, `pnpm install`, or `bun install` depending on your preferred package manager.

2.  **Run the development server**:
    Once the dependencies are installed, start the development server:

    ```bash
    npm run dev
    ```
    Or `yarn dev`, `pnpm dev`, `bun dev`.

    This will start the application in development mode. Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) in your browser to see the result. The page will auto-update as you edit the files. The main page to start editing is typically `app/page.tsx`.

## Building for Production

To create a production-ready build of the application, run:

```bash
npm run build
```
Or `yarn build`, `pnpm build`, `bun run build`.

This command compiles and optimizes your application for production. The output will be in the `.next` folder.

## Running in Production Mode

After building the application, you can start the production server using:

```bash
npm run start
```
Or `yarn start`, `pnpm start`, `bun run start`.

This will serve the optimized application. It's recommended to run this behind a reverse proxy like Nginx or on a platform that handles this for you.

