import { faCheck, faComputer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 md:grid-rows-[min-content_min-content] justify-center gap-6 max-w-screen-lg">
      <div className="text-center rounded lg:col-start-2 md:col-span-2 lg:row-span-1">
        <div className="text-2xl p-4">
          <p className="animate-home-title-shimmer font-bold">
            Order Dairy Free Food
          </p>
        </div>
      </div>

      <div className="dark-blue-background rounded p-6 lg:col-start-1 lg:col-span-2 md:row-start-2">
        <h5 className="text-lg font-bold text-center mb-4 border-b-2 pb-2">
          How to Demo <FontAwesomeIcon className="ml-2" icon={faCheck} />
        </h5>
        <ol className="list-decimal ml-2">
          <li className="mb-4 text-gray-200">
            <Link to="/signup" className="site-link">
              Sign Up
            </Link>{" "}
            for an account using an email that you can receive messages to.
          </li>
          <li className="mb-4 text-gray-200">
            <Link to="/order" className="site-link">
              Place An Order
            </Link>{" "}
            using a Stripe test card number (4242 4242 4242 4242).
          </li>
          <li className="mb-4 text-gray-200">
            Send an order message using the expandable "Order # Chat" panel that
            will appear at the bottom right of the screen after your order is
            placed.
          </li>
          <li className="mb-4 text-gray-200">
            Logout of your user account and become a demo admin user by clicking
            "Admin Demo" in the header navigation. You will be redirected to the{" "}
            <Link className="site-link" to="admin/dashboard">
              Admin Dashboard
            </Link>
            .
          </li>
          <li className="mb-4 text-gray-200">
            Play around in the admin dashboard, where you can set order statuses
            (an email is sent for each status change) and send messages to order
            chats.
          </li>
        </ol>
      </div>

      <div className="text-center dark-blue-background rounded p-6 lg:col-start-3 lg:col-span-2 text-lg md:row-start-2 ">
        <h3 className="font-bold mb-2 border-b-2 pb-2">
          Project Technical Information{" "}
          <FontAwesomeIcon className="ml-2" icon={faComputer} />
        </h3>
        <div>
          <div className="mb-4">
            <p>Ruby on Rails 8</p>
            <p>Postgresql</p>
            <p>ReactJS (v18.3)</p>
            <p>Tailwind CSS (v3.4)</p>
            <p>GraphQL</p>
            <p>Apollo Client (v3.11)</p>
            <p>Stripe gem (v13.1)</p>
          </div>

          <div>
            <h5>Order Chat</h5>
            <p>Powered by ActionCable and Solid Cable</p>
          </div>

          <div>
            <h6 className="text-sm">This project has test coverage using:</h6>
            <p>RSpec (v3.13)</p>
            <p>FactoryBot (v6.5)</p>
            <p>Faker</p>
            <p>VCR (backend)</p>
            <p>WebMock (backend)</p>
            <p>Jest (v29.7)</p>
            <p>Capybara (v3.40)</p>
            <p className="text-sm">
              ...all written manually and automated by Github actions &#10024;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
