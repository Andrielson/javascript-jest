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

export const calculateDiscount = (amount, quantity, condition) => {
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
