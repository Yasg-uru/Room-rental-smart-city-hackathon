const catchasyncerrors = (thefunc) => (req, res, next) => {
  thefunc(req, res, next).catch(next);
};

export default catchasyncerrors;
