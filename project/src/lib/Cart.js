import find from 'lodash/find';
import remove from 'lodash/remove';
import Money from 'dinero.js';

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

const calculatePercentageDiscount = (amount, { condition, quantity }) =>
  condition?.percentage && quantity > condition.minimum
    ? amount.percentage(condition.percentage)
    : Money({ amount: 0 });

const calculateQuantityDiscount = (amount, { condition, quantity }) => {
  const isEven = quantity % 2 === 0;
  return condition?.quantity && quantity > condition.quantity
    ? amount.percentage(isEven ? 50 : 40)
    : Money({ amount: 0 });
};

const calculateDiscount = (amount, quantity, condition) => {
  const list = Array.isArray(condition) ? condition : [condition];

  return list
    .map(c => {
      if (c.percentage)
        return calculatePercentageDiscount(amount, {
          condition: c,
          quantity,
        });
      if (c.quantity)
        return calculateQuantityDiscount(amount, {
          condition: c,
          quantity,
        });
      return Money({ amount: 0 });
    })
    .sort((a, b) => b.getAmount() - a.getAmount())
    .shift();
};

export default class Cart {
  items = [];

  add(item) {
    const itemToFind = { product: item.product };

    if (find(this.items, itemToFind)) {
      remove(this.items, itemToFind);
    }

    this.items.push(item);
  }

  remove(product) {
    remove(this.items, { product });
  }

  getTotal() {
    return this.items.reduce((acc, { quantity, product, condition }) => {
      const amount = Money({ amount: quantity * product.price });
      const discount = condition
        ? calculateDiscount(amount, quantity, condition)
        : Money({ amount: 0 });

      return acc.add(amount).subtract(discount);
    }, Money({ amount: 0 }));
  }

  summary() {
    const total = this.getTotal();
    const formatted = total.toFormat('$0,0.00');
    const items = this.items;

    return { total, items, formatted };
  }

  checkout() {
    const { total, items } = this.summary();

    this.items = [];

    return { total: total.getAmount(), items };
  }
}
