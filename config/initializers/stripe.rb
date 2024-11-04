# Note that this is the test key and will be used in production for demo'ing
Stripe.api_key = Rails.application.credentials.dig(:stripe, :secret_key)
