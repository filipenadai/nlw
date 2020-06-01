import express from 'express';

const app = express();

app.get('/users', (req, res) => {
    console.log('Listar usuários');

    res.json([
        'Filipe',
        'Karina',
        'Isabela'
    ]);
});

app.listen(3333);