const { exec } = require('child_process');
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 8000;

app.use(express.json());

async function executarNoBanco(query) {
    const conexao = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'bruno'
    });

    const [results, ] = await conexao.execute(query);

    return results;
}

app.get('/produtos', async (req, res) => {
    let produtos = await executarNoBanco('SELECT * FROM produtos')

    res.send(produtos)
})

app.get('/produtos/:id', async (req,res) => {
    let produtos = await executarNoBanco(`SELECT * FROM produtos WHERE id = ${req.params.id}`)

    res.send(produtos)
})

app.post('/produtos', async (req,res) => {
    const body = req.body;

    let query = `INSERT INTO produtos
        (nome, valor, categoria, tamanho)
            VALUES 
        ('${body.nome}','${body.valor}','${body.categoria}','${body.tamanho}')`;

    const resultado = await executarNoBanco(query)
    body.id = resultado.insertId;

    res.send(body)
})

app.patch('/produtos/:id', async (req,res)=> {
    let query = `
    UPDATE produtos SET 
        categoria = '${req.body.cagtegoria}'
    WHERE id = ${req.params.id}
    `;
    await executarNoBanco(query);

    res.send(req.body);

})

app.delete('/produtos/:id', async (req,res) => {
    let query = 'DELETE FROM produtos WHERE id = '+ req.params.id;

    await executarNoBanco(query);

    res.send(204);
})


app.listen(port, () => console.log("Servidor no AR"))