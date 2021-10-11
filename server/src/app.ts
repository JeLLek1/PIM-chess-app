import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;
app.get('/', (req, res) => {
  res.send('Test');
});
app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
