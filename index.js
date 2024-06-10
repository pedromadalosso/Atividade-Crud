const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Configurações de conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'server',
    database: 'biblioteca'
});

// Conectar ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar: ' + err.stack);
        return;
    }
    console.log('Conexão bem sucedida com o ID ' + connection.threadId);
});

// Middleware para tratar o corpo das requisições como JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create - Adicionar um novo livro
app.post('/livros', (req, res) => {
    const { titulo, autor, isbn } = req.body;

    // Verificar se o livro já existe
    connection.query('SELECT * FROM livros WHERE titulo = ? AND autor = ? AND isbn = ?', [titulo, autor, isbn], (err, result) => {
        if (err) {
            console.error('Erro ao verificar livro existente:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }

        if (result.length > 0) {
            // Se o livro já existe, retornar uma mensagem de erro
            res.status(400).send('Este livro já está cadastrado');
            return;
        }

        // Se o livro não existe, inserir o novo registro
        connection.query('INSERT INTO livros (titulo, autor, isbn) VALUES (?, ?, ?)', [titulo, autor, isbn], (err, result) => {
            if (err) {
                console.error('Erro ao adicionar livro:', err);
                res.status(500).send('Erro interno no servidor');
                return;
            }
            res.status(201).send('Livro adicionado com sucesso');
        });
    });
});

// Read - Obter todos os livros
app.get('/livros', (req, res) => {
    connection.query('SELECT * FROM livros', (err, result) => {
        if (err) {
            console.error('Erro ao obter livros:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.json(result);
    });
});

// Read - Obter todos os autores
app.get('/autores', (req, res) => {
    connection.query('SELECT * FROM autores', (err, result) => {
        if (err) {
            console.error('Erro ao obter autores:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.json(result);
    });
});

// Create - Adicionar um novo autor
app.post('/autores', (req, res) => {
    const { nome, nacionalidade } = req.body;

    console.log(req.body); // Verificar se os dados estão sendo recebidos corretamente

    connection.query('INSERT INTO autores (nome, nacionalidade) VALUES (?, ?)', [nome, nacionalidade], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar autor:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.status(201).send('Autor adicionado com sucesso');
    });
});

// Update - Atualizar um livro existente
app.put('/livros/:id', (req, res) => {
    const { titulo, autor, isbn } = req.body;
    const id = req.params.id;
    connection.query('UPDATE livros SET titulo = ?, autor = ?, isbn = ? WHERE id = ?', [titulo, autor, isbn, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar livro:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.send('Livro atualizado com sucesso');
    });
});

// Delete - Remover um livro
app.delete('/livros/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM livros WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover livro:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.send('Livro removido com sucesso');
    });
});

// Update - Atualizar um autor existente
app.put('/autores/:id', (req, res) => {
    const { nome, nacionalidade } = req.body;
    const id = req.params.id;
    connection.query('UPDATE autores SET nome = ?, nacionalidade = ? WHERE id = ?', [nome, nacionalidade, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar autor:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.send('Autor atualizado com sucesso');
    });
});

// Delete - Remover um autor
app.delete('/autores/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM autores WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover autor:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.send('Autor removido com sucesso');
    });
});

// Rota principal servindo o arquivo home.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

// Rota para a página de cadastro de autores
app.get('/cadastrar_autor', (req, res) => {
    res.sendFile(__dirname + '/cadastrar_autor.html');
});
app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
