import express from 'express';

const app = express();

const users = [
    'Filipe',
    'Karina',
    'Isabela'
];

app.get('/user', (req, res) => {
    console.log('Listar usuários');

    res.json(users);
});

app.get('/user/:id', (req, res) => {
    const id = Number(req.params.id);

    const user = users[id];

    return res.json(user);
})

app.post('/user', (req, res) => {
    const users = {
        nome : 'Filipe',
        email : 'f.nadai05@gmail.com'
    };
    return res.json(users);
});

app.listen(3333);