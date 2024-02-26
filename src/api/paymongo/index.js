import axios from 'axios';

const createPayment = async (order, config) => {
  const {shippingAddress} = order.author;
  const add = shippingAddress;
  const address = `$`;

  return axios({
    url: config.PAYMONGO_CONFIG.url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      user: {
        firstName: order.author.firstName,
        lastName: order.author.lastName,
        address1: `${add.line1} ${add.line2} ${add.city}`,
        mobile: order.author.phone,
        email: order.author.email,
      },
      amount: order.amount,
    },
  })
    .then(response => {
      console.log('Payment created', response.data);
      return response.data;
    })
    .catch(err => {
      console.error('FAILED TO CREATE PAYENT', err);
      throw err;
    });
};

export {createPayment};
