import React from "react";
import { render } from "@testing-library/react";
import Signup from "components/signup/Signup";
import { BrowserRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";

describe("<Signup />", () => {
  test("renders", async () => {
    render(
      <MockedProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
          }}
        >
          <Signup />
        </BrowserRouter>
      </MockedProvider>
    );
  });
});
