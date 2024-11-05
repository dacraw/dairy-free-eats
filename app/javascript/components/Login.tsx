import React from "react";

const Login = () => {
  return (
    <div className="grid place-content-center">
      <form>
        <h3 className="mb-4 text-2xl">Login</h3>
        <div>
          <label className="block ">Email</label>
          <input className="mb-2 text-center" type="email" />
        </div>
        <div>
          <label className="block ">Password</label>
          <input className="mb-2 text-center" type="password" />
        </div>
        <div>
          <input type="submit" className="w-full border-2 col-end-3" />
        </div>
      </form>
    </div>
  );
};

export default Login;
