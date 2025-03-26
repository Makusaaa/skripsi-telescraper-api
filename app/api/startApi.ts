import express from 'express';
import routing from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const port = Number(process.env.APP_API_PORT);

export default async function startApi() {
    app.use(express.json());
    
    app.get('/', (_req, res) => {
        res.end("TeleScraper API 1.0");
    })

    app.use('/', routing);
    app.use(errorHandler)
    
    app.listen(port, () => {
        console.log(`Api listening on http://localhost:${port}`);
    })

}

export { app };