const products = require('./product-test-data');

function getDetailedCart(cart) {
  let total = 0;
  const detailedCart = cart.map(item => {
    const itemProduct = products.find(p => p.id === item.productId);
    const price = itemProduct ? itemProduct.price : 0;
    const currency = itemProduct ? itemProduct.currency : 'USD';
    const subtotal = Math.round((price * item.quantity) * 100) / 100;
    total += subtotal;
    return {
      productId: item.productId,
      name: itemProduct ? itemProduct.name : 'Unknown',
      price,
      currency,
      quantity: item.quantity,
      subtotal
    };
  });

  return {
    cart: detailedCart,
    total: Math.round(total * 100) / 100,
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
  };
}

module.exports = { getDetailedCart };