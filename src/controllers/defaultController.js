const routeNotFound = (_, res) => {
  res.status(404).send('Route not found');
};

export { routeNotFound };
