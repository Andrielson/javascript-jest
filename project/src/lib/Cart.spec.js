import Cart from './Cart';

describe('Cart', () => {
  let cart;
  const product = {
    title: 'Adidas running shoes - men',
    price: 35388,
  };

  const product2 = {
    title: 'Adidas running shoes - women',
    price: 41872,
  };

  beforeEach(() => {
    cart = new Cart();
  });

  describe('getTotal()', () => {
    it('should return 0 when getTotal() is executed in a newly created instance', () => {
      expect(cart.getTotal().getAmount()).toBe(0);
    });

    it('should multiply quantity and price and receive the total amount', () => {
      const item = {
        product,
        quantity: 2,
      };

      cart.add(item);

      expect(cart.getTotal().getAmount()).toBe(70776);
    });

    it('should ensure no more than one product exists at a time', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product,
        quantity: 1,
      });

      expect(cart.getTotal().getAmount()).toBe(35388);
    });

    it('should update total when a product gets included and then removed', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 1,
      });

      cart.remove(product);

      expect(cart.getTotal().getAmount()).toBe(41872);
    });
  });

  describe('summary()', () => {
    it('should return an object with the total and the list of items', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 3,
      });

      expect(cart.summary()).toMatchSnapshot();
      expect(cart.getTotal().getAmount()).toBeGreaterThan(0);
    });

    it('should include formatted amount in the summary', () => {
      cart.add({
        product,
        quantity: 5,
      });

      cart.add({
        product: product2,
        quantity: 3,
      });

      expect(cart.summary().formatted).toBe('R$3,025.56');
    });
  });

  describe('checkout()', () => {
    it('should return an object with the total and the list of items', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 3,
      });

      expect(cart.checkout()).toMatchSnapshot();
    });

    it('should reset the cart when checkout is called', () => {
      cart.add({
        product: product2,
        quantity: 3,
      });

      cart.checkout();

      expect(cart.getTotal().getAmount()).toBe(0);
    });
  });

  describe('special conditions', () => {
    it('should apply percentage discount when quantity above mininum is passed', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({ product, condition, quantity: 3 });

      expect(cart.getTotal().getAmount()).toBe(74315);
    });

    it('should not apply percentage discount when quantity equals mininum is passed', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({ product, condition, quantity: 2 });

      expect(cart.getTotal().getAmount()).toBe(70776);
    });

    it('should not apply percentage discount when quantity below mininum is passed', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({ product, condition, quantity: 1 });

      expect(cart.getTotal().getAmount()).toBe(35388);
    });

    it('should apply quantity discount for even quantities', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({ product, condition, quantity: 4 });

      expect(cart.getTotal().getAmount()).toBe(70776);
    });

    it('should apply quantity discount for odd quantities', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({ product, condition, quantity: 5 });

      expect(cart.getTotal().getAmount()).toBe(106164);
    });

    it('should not apply quantity discount when quantity is below minimum', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({ product, condition, quantity: 1 });

      expect(cart.getTotal().getAmount()).toBe(35388);
    });

    it('should receive two or more conditions and determine/apply the best discount. First case.', () => {
      const percentageCondition = {
        percentage: 30,
        minimum: 2,
      };

      const quantityCondition = {
        quantity: 2,
      };

      cart.add({
        product,
        condition: [percentageCondition, quantityCondition],
        quantity: 5,
      });

      expect(cart.getTotal().getAmount()).toBe(106164);
    });

    it('should receive two or more conditions and determine/apply the best discount. Second case.', () => {
      const percentageCondition = {
        percentage: 80,
        minimum: 2,
      };

      const quantityCondition = {
        quantity: 2,
      };

      cart.add({
        product,
        condition: [percentageCondition, quantityCondition],
        quantity: 5,
      });

      expect(cart.getTotal().getAmount()).toBe(35388);
    });

    it('should not apply discount when condition is unknown', () => {
      const condition = {
        discount: 10,
      };

      cart.add({
        product,
        condition,
        quantity: 1,
      });

      expect(cart.getTotal().getAmount()).toBe(35388);
    });
  });
});
