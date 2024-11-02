class Api::V1::StripeController < ApplicationController
    def products
        products = Stripe::Product.list
        
        if products.blank?
            render json: {message: "No products could be fetched"}, status: 400
        end

        render json: products, status: 200
    end
end
