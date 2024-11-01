class Stripe::EventsController < ApplicationController
    protect_from_forgery except: [:create]

    def create
        payload = request.body.read

        
        endpoint_secret = Rails.application.credentials.stripe[:endpoint_secret]

        if endpoint_secret
            signature = request.env['HTTP_STRIPE_SIGNATURE']
            
            
            begin
                event = Stripe::Webhook.construct_event(payload, signature, endpoint_secret)
            rescue Stripe::SignatureVerificationError => e
                puts "Stripe webhook signature verification failed: #{e.message}"
                status 400
            end
        end
        
        render json: {message: "success"}, status: 200
    end
end
