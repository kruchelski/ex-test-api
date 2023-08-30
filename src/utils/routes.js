export const registerRoutes = (router, routes) => {
  routes.forEach(({ path, method, controller }) => {
    router[method](path, controller);
  });
};
