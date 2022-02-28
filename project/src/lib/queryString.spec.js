import { queryString, parse } from './queryString';

describe('Object to query string', () => {
  it('should create a valid query string when an object is provided', () => {
    const obj = {
      name: 'Andrielson',
      profession: 'developer',
    };

    expect(queryString(obj)).toBe('name=Andrielson&profession=developer');
  });

  it('should create a valid query string even when an array is passed as value', () => {
    const obj = {
      name: 'Andrielson',
      abilities: ['JS', 'TDD'],
    };

    expect(queryString(obj)).toBe('name=Andrielson&abilities=JS,TDD');
  });

  it('should throw an error when an object is passed as value', () => {
    const obj = {
      name: 'Andrielson',
      abilities: {
        first: 'JS',
        second: 'TDD',
      },
    };

    expect(() => {
      queryString(obj);
    }).toThrowError();
  });
});

describe('Query string to object', () => {
  it('should convert a query string to object', () => {
    const qs = 'name=Andrielson&profession=developer';
    expect(parse(qs)).toEqual({
      name: 'Andrielson',
      profession: 'developer',
    });
  });

  it('should convert a query string of a single key-value pair to object', () => {
    const qs = 'name=Andrielson';
    expect(parse(qs)).toEqual({
      name: 'Andrielson',
    });
  });

  it('should convert a query string to an object taking care of comma separated values', () => {
    const qs = 'name=Andrielson&abilities=JS,TDD';
    expect(parse(qs)).toEqual({
      name: 'Andrielson',
      abilities: ['JS', 'TDD'],
    });
  });
});
