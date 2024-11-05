class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  def encode_token(payload)
    payload[:exp] = Time.now.to_i + 4 * 3600

    JWT.encode payload, Rails.application.credentials.dig(:jwt, :hmac_secret), "HS256"
  end

  def decode_token
    auth_header = request.headers['Authorization']
    token = auth_header.split(' ').last

    JWT.decode token, Rails.application.credentials.dig(:jwt, :hmac_secret), true, {algorithm: 'HS256'}
  end

  def current_user
    if decode_token
    end
  end
end
