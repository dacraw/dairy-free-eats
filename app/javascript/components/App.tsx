import React from "react";
import HeaderNav from "components/HeaderNav";
import AppRoute from "routes";

const App = () => {
  return (
    <>
      {
        <AppRoute>
          <HeaderNav />
        </AppRoute>
      }
    </>
  );
};

export default App;
