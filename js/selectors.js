export const getCustomer = (customers, id) => customers.find((c) => c.id === id);
export const getProduct = (products, id) => products.find((p) => p.id === id);

export const getLineAmount = (item, products) => {
  const product = getProduct(products, item.productId);
  return product ? product.price * item.quantity : 0;
};

export const getOrderTotal = (order, products) => {
  let total = 0;
  order.items.forEach((item) => {
    total += getLineAmount(item, products);
  });
  return total;
};

const orderHasCategory = (order, category, products) =>
  order.items.some((item) => {
    const product = getProduct(products, item.productId);
    return product && product.category === category;
  });

export const getVisibleOrders = ({ orders, customers, products, search, status, category }) =>
  orders.filter((order) => {
    const customer = getCustomer(customers, order.customerId);
    const matchesSearch =
      !search || (customer && customer.name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = status === "all" || order.status === status;
    const matchesCategory = category === "all" || orderHasCategory(order, category, products);
    return matchesSearch && matchesStatus && matchesCategory;
  });

export const getOrderDetails = (order, { customers, products }) => {
  const customer = getCustomer(customers, order.customerId);
  return {
    id: order.id,
    customerName: customer ? customer.name : "Unknown customer",
    city: customer ? customer.city : "-",
    date: order.date,
    status: order.status,
    lines: order.items.map((item) => {
      const product = getProduct(products, item.productId);
      return {
        name: product ? product.name : "Unknown product",
        image: product ? product.image : "",
        price: product ? product.price : 0,
        quantity: item.quantity,
        amount: getLineAmount(item, products),
      };
    }),
    total: getOrderTotal(order, products),
  };
};

export const getStats = ({ customers, products, orders }) => {
  let amount = 0;
  orders.forEach((order) => {
    if (order.status !== "Annulee") {
      amount += getOrderTotal(order, products);
    }
  });
  return { customers: customers.length, products: products.length, orders: orders.length, amount };
};