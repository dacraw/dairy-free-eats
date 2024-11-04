class Api::V1::StripeController < ApplicationController
    def products
        products = Stripe::Product.list

        if products.data.empty?
            return render json: { message: "No products could be fetched" }, status: 400
        end

        values = products.data.map { |product| product.to_h.slice :default_price, :description, :name }

        render json: values, status: 200
    end

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
                success_url: "https://glad-promoted-falcon.ngrok-free.app/success",
                cancel_url: "https://glad-promoted-falcon.ngrok-free.app/order",
                line_items: line_items,
                mode: "payment"
            })
        rescue Stripe::InvalidRequestError => e
            return render json: { message: "failed", error: e.message }, status: 400
        end

        render json: { message: "success", checkout_url: checkout_session.url }, status: 200
    end
end
