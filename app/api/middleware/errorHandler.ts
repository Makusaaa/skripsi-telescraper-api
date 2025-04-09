export class CustomError extends Error {
    constructor(
        message: string,
        private statuscode: number){
        super(message)
    }
}

export default function errorHandler (err, req, res, next) {
    console.error(`[ERROR]: ${err.message}`)
    err.statuscode ??= 500;
    res.status(err.statuscode).json({ error: err.message });
}