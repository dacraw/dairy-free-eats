require 'vcr'
require 'rubygems'

VCR.configure do |config|
    config.cassette_library_dir = "#{::Rails.root}/spec/cassettes"
    config.ignore_localhost = true
    config.configure_rspec_metadata!
    config.hook_into :webmock
    config.filter_sensitive_data("<BEARER_TOKEN>") do |interaction|
        interaction.request.headers["Authorization"].first
    end
    config.filter_sensitive_data("<IDEMPOTENCY_KEY>") do |interaction|
        target = interaction.request.headers["Idempotency-Key"]&.first
        target if target.present?
    end
    config.filter_sensitive_data("<IDEMPOTENCY_KEY>") do |interaction|
        target = interaction.response.headers["Idempotency-Key"]&.first
        target if target.present?
    end
    config.filter_sensitive_data("<X_STRIPE_CLIENT_USER_AGENT>") do |interaction|
        target = interaction.request.headers["X-Stripe-Client-User-Agent"]&.first
        target if target.present?
    end
    config.filter_sensitive_data("<CLIENT_SECRET>") do |interaction|
        target = JSON.parse(interaction.response.body)["client_secret"]
        target if target.present?
    end
end
