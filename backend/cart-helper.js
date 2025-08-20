const products = require('./product-test-data');

function getDetailedCart(cart) {
  let total = 0;
  const detailedCart = cart.map(item => {
    const itemProduct = products.find(p => p.id === item.productId);
    const price = itemProduct ? itemProduct.price : 0;
    const currency = itemProduct ? itemProduct.currency : 'USD';
    total += price * item.quantity;
    return {
      productId: item.productId,
      name: itemProduct ? itemProduct.name : 'Unknown',
      price,
      currency,
      quantity: item.quantity,
      subtotal: price * item.quantity
    };
  });

  return {
    cart: detailedCart,
    total,
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
  };
}

module.exports = { getDetailedCart };