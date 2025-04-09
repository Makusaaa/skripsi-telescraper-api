import express from 'express';
import routing from './routes';
import cors from 'cors'
import errorHandler from './middleware/errorHandler';
import config from './constraints/config';

const app = express();
const port = Number(config.APP_API_PORT);

export default async function startApi() {
    app.use(express.json());
    app.use(cors())
    
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