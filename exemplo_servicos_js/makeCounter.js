const makeCounter = (start = 0) => {
  let current = start;

  const add = (value = 1) => current += value;
  const remove = (value = 1) => add(value * -1);
  const get = () => current;

  return { add, remove, get };
};

export default makeCounter