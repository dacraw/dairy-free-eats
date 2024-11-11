class Stripe::EventsController < ApplicationController
    protect_from_forgery except: [ :create ]

    def create
        payload = request.body.read

        endpoint_secret = Rails.application.credentials.dig(:stripe, :endpoint_secret)

        if endpoint_secret
            signature = request.env["HTTP_STRIPE_SIGNATURE"]

            begin
                event = Stripe::Webhook.construct_event(payload, signature, endpoint_secret)

                case event.type
                when "payment_intent.succeeded"
                    payment_intent_succeeded(event)
                end

            rescue Stripe::SignatureVerificationError => e
                puts "Stripe webhook signature verification failed. #{e.message}"

                return json: { message: "There was an issue with this Stripe request. Please try again later." }, status 500
            end
        end

        render json: { message: "success" }, status: 200
    end

    private

    def payment_intent_succeeded(event)
        customer_email = event.data.object.customer

        if customer_email
            user = User.find_by_email(customer_email)
        end

        order = Order.new stripe_id: event.data.object.id, user: user

        if !order.save
            puts "There was an issue creating an order for Payment Intent# #{event.data.object.id}"
            render json: {
                message: "There was an issue creating your order. Please try again later."
            }, status: 500
        end
    end
end
