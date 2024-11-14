import React from "react";

const Home = () => {
  return (
    <div className="grid place-content-center gap-6">
      <div className="text-center w-80 bg-blue-700 rounded p-6">
        <p className="mb-4 text-gray-200 font-bold">
          Order lactose-free food that is tasty and affordable.
        </p>
        <p className="mb-4 text-sm">
          This is a portfolio project, so anything ordered will not be delivered
          to you. Please do not enter real card information as this website is
          for <span className="underline">DEMONSTRATION PURPOSES ONLY.</span>
        </p>
        <p className="mb-4 text-sm">
          But, the goal is to get this up and running one day and deliver
          lactose-free food locally based on my current location...so stay tuned
          ;)
        </p>
      </div>

      <div className="text-center w-80 bg-green-700 rounded p-6 text-lg">
        <h3 className="font-bold mb-2 underline">
          Project Technical Information:
        </h3>
        <div>
          <div className="mb-4">
            <p>Ruby on Rails 8 (es-build)</p>
            <p>Postgresql</p>
            <p>ReactJS (v18.3)</p>
            <p>Tailwind CSS (v3.4)</p>
            <p>GraphQL</p>
            <p>Apollo Client (v3.11)</p>
            <p>Stripe gem (v13.1)</p>
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
