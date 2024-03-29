import pg from 'pg';
import express from 'express';

const { Client } = pg;

const clientOptions = {
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT,
};
const client = new Client(clientOptions);
client.connect();

const createTable = async () => {
	await client.query(`CREATE TABLE IF NOT EXISTS users 
    (id serial PRIMARY KEY, name VARCHAR (255) UNIQUE NOT NULL, 
    email VARCHAR (255) UNIQUE NOT NULL, age INT NOT NULL);`);
};

createTable();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/all', async (req, res) => {
	try {
		const response = await client.query(`SELECT * FROM users`);

		if (response) {
			res.status(200).send(response.rows);
		}
	} catch (error) {
		res.status(500).send('Error');
		console.log(error);
	}
});

app.post('/form', async (req, res) => {
	try {
		const name = req.body.name;
		const email = req.body.email;
		const age = req.body.age;

		const response = await client.query(
			`INSERT INTO users(name, email, age) VALUES ('${name}', '${email}', ${age});`
		);
		if (response) {
			res.status(200).send(req.body);
		}
	} catch (error) {
		res.status(500).send('Error');
		console.log(error);
	}
});

app.listen(3000, () => console.log(`App running on port 3000.`));
