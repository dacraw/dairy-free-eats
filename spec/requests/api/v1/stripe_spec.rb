require 'rails_helper'

RSpec.describe "Api::V1::Stripe", type: :request do
  describe "POST /create_checkout_session" do
    context "when there is an error with the request" do
      it "returns an error for missing stripe param" do
        post api_v1_stripe_create_checkout_session_url

        body = JSON.parse response.body

        expect(body["message"]).to eq "missing the required key for the values"
        expect(response.status).to eq 400
      end

      it "returns an error when any of the keys do not resemble a price id" do
        allow(Stripe::Checkout::Session).to receive(:create) { }
        post api_v1_stripe_create_checkout_session_url, params: { stripe: { price_1: "", fake_price: "" } }

        body = JSON.parse response.body

        expect(body["message"]).to eq "one of the entered keys doesn't represent a price id"
        expect(response.status).to eq 400
      end

      it "returns an error when no quantities are entered" do
        allow(Stripe::Checkout::Session).to receive(:create) { }
        post api_v1_stripe_create_checkout_session_url, params: { stripe: { price_1: "", price_2: "" } }

        body = JSON.parse response.body

        expect(body["message"]).to eq "no quantities entered"
        expect(response.status).to eq 400
      end

      it "returns an error when a checkout session cannot be created" do
        error = Stripe::InvalidRequestError.new "error stub", "error stub 2"

        expect(Stripe::Checkout::Session).to receive(:create).and_raise(error)
        post api_v1_stripe_create_checkout_session_url, params: { stripe: { price_1: "1", price_2: "" } }

        body = JSON.parse response.body

        expect(body["message"]).to eq "Unfortunately, there is an issue with the Stripe checkout at this time. Please try again later."
        expect(body["error"]).to eq error.message
        expect(response.status).to eq 500
      end
    end

    context "when the response is successful" do
      let(:session_double) { double(Stripe::Checkout::Session, "url" => "www.checkoutpage.com") }

      it "returns a success message and the checkout url" do
        expect(Stripe::Checkout::Session).to receive(:create) { session_double }

        post api_v1_stripe_create_checkout_session_url, params: { stripe: { price_1: "1", price_2: "" } }

        body = JSON.parse response.body

        expect(body["message"]).to eq "success"
        expect(body["checkout_url"]).to eq session_double.url
        expect(response.status).to eq 200
      end
    end
  end
end
