class Api::V1::StripeController < ApplicationController
    def create_checkout_session
        line_items = []

        return render json: { message: "missing the required key for the values" }, status: 400 if params[:stripe].blank?

        prices = params[:stripe].keys

        return render json: { message: "one of the entered keys doesn't represent a price id" }, status: 400 if prices.any? { |price_id| !price_id.match? /^price_.*$/ }

        return render json: { message: "no product ids present" }, status: 400 if prices.empty?

        prices.each do |price_id|
            quantity = params[:stripe][price_id]

            next if quantity.blank?

            line_item = {
                price: price_id,
                quantity: quantity
            }

            line_items << line_item
        end

        return render json: { message: "no quantities entered" }, status: 400 if line_items.empty?


        begin
            checkout_session = Stripe::Checkout::Session.create({
                success_url: "http://localhost:3000/success",
                cancel_url: "http://localhost:3000/order",
                line_items: line_items,
                mode: "payment",
                phone_number_collection: {
                    enabled: true
                },
                customer_email: (current_user.email if current_user.present?)
            })

        rescue Stripe::InvalidRequestError => e
            return render json: { message: "Unfortunately, there is an issue with the Stripe checkout at this time. Please try again later.", error: e.message }, status: 500
        end

        render json: { message: "success", checkout_url: checkout_session.url }, status: 200
    end
end
