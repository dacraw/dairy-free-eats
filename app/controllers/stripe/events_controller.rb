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

                return render json: { message: "There was an issue with this Stripe request. Please try again later." }, status: 500
            end
        end

        render json: { message: "success" }, status: 200
    end

    private

    def payment_intent_succeeded(event)
        stripe_customer_id = event.data.object.customer

        if stripe_customer_id
            user = User.find_by_stripe_customer_id stripe_customer_id
        end

        stripe_checkout_session = Stripe::Checkout::Session.list payment_intent: event.data.object.id

        if stripe_checkout_session.blank?
            puts "No Stripe Checkout session associated with payment intent ##{event.data.object.id} - Cannot proceed since line items cannot be stored in the order."
            render json: {
                message: "There was an issue creating your order. Please try again later."
            }, status: 500
        end

        checkout_line_items = Stripe::Checkout::Session.list_line_items stripe_checkout_session.first.id

        stripe_checkout_session_line_items = checkout_line_items.map { |item| { name: item.description, quantity: item.quantity } }

        order = Order.new(
            user: user,
            stripe_checkout_session_line_items: stripe_checkout_session_line_items,
            stripe_payment_intent_id: event.data.object.id
        )

        if !order.save
            puts "There was an issue creating an order for Payment Intent# #{event.data.object.id}"
            render json: {
                message: "There was an issue creating your order. Please try again later."
            }, status: 500
        end

        OrderMailer
            .with(
                order: order,
                stripe_customer_email: stripe_checkout_session.first.customer_details.email,
                line_items: order.stripe_checkout_session_line_items
            )
            .order_received
            .deliver_later

        Admin::OrderMailer
            .with(
                order: order,
                stripe_checkout_session: stripe_checkout_session.first,
                line_items: order.stripe_checkout_session_line_items
            )
            .order_received
            .deliver_later
    end
end
