import find from 'lodash/find';
import remove from 'lodash/remove';
import Money from 'dinero.js';

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

const calculatePercentageDiscount = (amount, item) =>
  item.condition?.percentage && item.quantity > item.condition.minimum
    ? amount.percentage(item.condition.percentage)
    : Money({ amount: 0 });

const calculateQuantityDiscount = (amount, item) => {
  const isEven = item.quantity % 2 === 0;
  return item.condition?.quantity && item.quantity > item.condition.quantity
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
    return this.items.reduce((acc, item) => {
      const amount = Money({ amount: item.quantity * item.product.price });
      const discount = item.condition
        ? calculateDiscount(amount, item.quantity, item.condition)
        : Money({ amount: 0 });

      return acc.add(amount).subtract(discount);
    }, Money({ amount: 0 }));
  }

  summary() {
    const total = this.getTotal().getAmount();
    const items = this.items;

    return { total, items };
  }

  checkout() {
    const { total, items } = this.summary();

    this.items = [];

    return { total, items };
  }
}