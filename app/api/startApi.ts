import express from 'express';
import routing from './routes';

const app = express();
const port = Number(process.env.APP_API_PORT);

export default async function startApi() {
    app.use(express.json());
    
    app.get('/', (_req, res) => {
        res.end("TeleScraper API 1.0");
    })

    app.use('/', routing);
    
    app.listen(port, () => {
        console.log(`Api listening on http://localhost:${port}`);
    })

}

export { app };