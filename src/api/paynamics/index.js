import axios from 'axios';

const createPayment = async (order, config) => {
  const {firstName, lastName, phone, email, shippingAddress} = order.author;
  const add = shippingAddress;
  const items = [
    {
      name: 'Total Bill',
      quantity: 1,
      amount: order.amount,
    },
  ];

  const payload = {
    user: {
      firstName,
      lastName,
      address1: `${add.line1} ${add.line2}`,
      city: add.city,
      state: 'PH-00',
      country: 'PH',
      zip: add.zip,
      mobile: phone,
      email,
    },
    items,
    amount: order.amount,
    misc: {
      paymentMethod: order.source,
    },
  };
  return axios({
    url: config.PAYNAMICS_CONFIG.url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
    .then(r => {
      return r.data;
    })
    .catch(err => {
      console.error(
        'FAILED TO CREATE PAYMENT',
        err.toJSON(),
        err.response?.data,
      );
      throw err;
    });
};
export {createPayment};
