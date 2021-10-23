import Http from 'http';

const server = Http.createServer()
export const port = parseInt(process.env.PORT);
export default server;