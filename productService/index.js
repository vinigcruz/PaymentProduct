const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

app.use(express.json());

const products = [
    { id: 1, name: 'Chocolate', price: 5 },
    { id: 2, name: 'Monster', price: 12 },
    { id: 3, name: 'Coxinha', price: 7 }
];

app.get('/products', (req, res) => {
    res.json(products);
})

app.post('/payment-status', (req, res) => {
    const { paymentId, status } = req.body;

    console.log(`Recebido status de pagamento: ${paymentId} - ${status}`);

    if (status === 'COMPLETED') {
        res.json({ message: `Pagamento confirmado, seu pedido esta sendo processado.` });
    } else {
        res.json({ message: `Pagamento não confirmado, tente novamente.` });
    }
});

app.listen(port, () => {
    console.log(`ProductService rodando na porta ${port}`);
});