const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

const payments = {};

app.use(express.json());

app.post('/charge', async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ error: 'userId e amount são obrigatórios' });
    }
    const response = await axios.get(`http://localhost:3001/products`);
    const paymentId = Date.now();
    
    payments[paymentId] = { userId, amount, status: 'PENDING' };

    console.log(`Processando pagamento de ${amount} para o usuário ${userId}`);

    setTimeout(async () => {
      payments[paymentId].status = 'COMPLETED';
      console.log(`Pagamento de ${amount} concluído para o usuário ${userId}`);

      try {
        await axios.post('http://localhost:3001/payment-status', {
          paymentId,
          status: 'COMPLETED'
        });
        console.log('Notificação enviada para ProductService.');
      } catch (error) {
        console.error('Erro ao notificar ProductService:', error.message);
      }

    }, 3002);

    res.status(201).json({ paymentId, status: 'PENDING' });
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    res.status(500).json({ error: 'Erro no servidor ao processar o pagamento' });
  }
});

app.get('/payment-status/:paymentId', (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = payments[paymentId];

    if (payment) {
      return res.json(payment);
    }

    res.status(404).json({ error: 'Pagamento não encontrado' });
  } catch (error) {
    console.error('Erro ao consultar status do pagamento:', error);
    res.status(500).json({ error: 'Erro no servidor ao consultar status do pagamento' });
  }
});

app.listen(port, () => {
  console.log(`PaymentService rodando na porta ${port}`);
});
