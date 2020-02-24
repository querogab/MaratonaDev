// config servidor 
const express = require("express");

const server = express()
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }))

//conf conexão com banco
const Pool = require('pg').Pool
const db = new Pool({
	user: 'postgres',
	password: '0000',
	host: 'localhost',
	port: 5432,
	database: 'donation'
});

//config template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
	express: server,
	noCache: true, 
});

// array de doadoras
const donors = [
	{
		name: "Maria Silva",
		blood: "AB+"
	},

	{
		name: "Fernanda Fernandes",
		blood: "A+"
	},

	{
		name: "Joelma Calypso",
		blood: "B+"
	},

	{
		name: "Lucinda Lucia",
		blood: "O+"
	},

	{
		name: "Carlota Joaquina",
		blood: "O-"
	},
]

// config aoresentação
server.get("/", function(req, res) {
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Oops! ocorreu um erro no banco de dados!");
        const donors = result.rows;
        res.render('index.html', { donors });
    })

});

server.post("/", function(req, res) {
	//pegar do form
	const name = req.body.name
	const email = req.body.email
	const blood = req.body.blood


		if (name == "" || email == "" || blood == "") {
			return res.send("Todos os campos são obrigatórios")
		}

	//inserir valores no banco de dados
	const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        if (err) return res.send("erro no banco de dados.")
        
        return res.redirect("/")
    })
});

server.listen(3000, function() {
    console.log("Servidor inciado!")
});

