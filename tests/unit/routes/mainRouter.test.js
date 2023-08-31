import { mainRouter, mainRoutes } from '../../../src/routes';

describe('Tests the mainRouter', () => {
  it('should import a truthy router', () => {
    expect(mainRouter).toBeTruthy();
  });

  it('should have all routes registered', () => {
    const numOfRoutesToRegister = mainRoutes.length;
    const numOfRegisteredRoutes = mainRoutes.reduce((prev, curr) => {
      const foundRoute = mainRouter.stack.find((routeInfo) => routeInfo.route.path === curr.path);
      if (foundRoute) return prev + 1;
      return prev;
    }, 0);

    expect(numOfRegisteredRoutes).toBe(numOfRoutesToRegister);
  });
});
