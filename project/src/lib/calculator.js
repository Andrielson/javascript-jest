module.exports.sum = (arg1, arg2) => {
  const int1 = parseInt(arg1);
  const int2 = parseInt(arg2);

  if (Number.isNaN(int1) || Number.isNaN(int2))
    throw new Error("Please check your input");

  return int1 + int2;
};
