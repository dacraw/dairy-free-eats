import "@testing-library/jest-dom";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: "success", redirect_url: "/login" }),
  })
) as jest.Mock;
