import express, {Express, Request, Response} from 'express';
import {getWeather} from "./api.service";
require('dotenv').config()

const app: Express = express();
const PORT = process.env.PORT || 3500;

const handleError = (e: any, req: Request, res: Response): Response => {
  switch (e?.response?.status) {
    case 404:
      return res.status(404).json({ message: 'Неверно указан город'});
    case 401:
      return res.status(401).json({ message: 'Неверно указан токен'});
    default:
      return res.status(400).json({ message: e.message });
  }
}

app.get('/:city', async (req: Request, res: Response) => {
  const city: string = req.params.city
  const token: string = req.query.token as string

  if (!city || Number.isNaN(Number(city))) {
    return res.status(404).json({ message: 'Укажите город'})
  }
  if (!token) {
    return res.status(404).json({ message: 'Укажите токен'})
  }

  try {
    const weather = await getWeather(city, token)
    res.status(200).json({ weather })
  } catch (e: any) {
    handleError(e, req, res);
  }
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))