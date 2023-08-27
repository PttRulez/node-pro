import axios from "axios";

const getWeather = async (city: string, token: string) => {
	if (!token) {
		throw new Error('Не задан ключ API, задайте его в query параметрах GET запроса в виде \"?token=yourapitoken\"');
	}
	const {data} = await axios.get(process.env.API_URL || '', {
		params: {
			q: city,
			appid: token,
			lang: 'ru',
			units: 'metric'
		}
	});
	return data;
};

export {getWeather};