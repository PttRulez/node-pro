import express, {Express, Request, Response} from 'express';
import {getWeather} from "./api.service";
const app: Express = express();

app.get('/:city', async (req: Request, res: Response) => {
  const city: string = req.params.city
  const token: string = req.query.token as string

  try {
    const weather = await getWeather(city, token)
    res.status(200).json({ weather })
  } catch (e: any) {
    if (e?.response?.status === 404) {
      return res.status(404).json({ message: 'Неверно указан город'})
		} else if (e?.response?.status === 401) {
      return res.status(401).json({ message: 'Неверно указан токен'})
		} else {
      return res.status(400).json({ message: e.message })
		}
  }
})

app.listen(8000, () => console.log(`Server is listening on port 8000`))