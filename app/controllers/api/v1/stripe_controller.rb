PRICES = {
    "prod_R8KkVOibvpRPlc" => "price_1QG44XElA4InVgv8dOnqfhyu",
    "prod_R8KiBa0tljS7SV" => "price_1QG432ElA4InVgv8Zy7PaGPY"
}


class Api::V1::StripeController < ApplicationController
    def products
        products = Stripe::Product.list
        
        if products.blank?
            render json: {message: "No products could be fetched"}, status: 400
        end

        render json: products, status: 200
    end

    def create_checkout_session
        line_items = []

        checkout_params.to_hash.entries.each do |prod_id, quantity|
            next if quantity.blank?

            price = PRICES[prod_id]

            line_item = {
                price: price,
                quantity: quantity.to_i
            }

            line_items << line_item
        end

        begin
            checkout_session = Stripe::Checkout::Session.create({
                success_url: "https://glad-promoted-falcon.ngrok-free.app/success",
                line_items: line_items,
                mode: "payment"
            })
        rescue Stripe::InvalidRequestError => e
            return render json: {message: "failed", error: e.message}
        end

        render json: {message: "success", checkout_url: checkout_session["url"]}, status: 200
    end

    def checkout_params
        params.require(:stripe).permit(*PRICES.keys)
    end
end
