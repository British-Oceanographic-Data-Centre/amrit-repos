function add(a: number, b: number): number {
	return a + b;
  }
  
  describe('add function', () => {
	it('returns the sum of two numbers', () => {
	  expect(add(2, 3)).toBe(5);
	});
  });
  