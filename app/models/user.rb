class User < ApplicationRecord
    DEMO_ADMIN_EMAIL = "demoadmin@dairytest.com"

    has_secure_password

    normalizes :email_address, with: ->(e) { e.strip.downcase }

    validates :email_address, presence: true
    validates_length_of :password, minimum: 8
    validates :session_token, { uniqueness: true, presence: true }
    validates :recovery_password_digest, { uniqueness: true, presence: true }
    validates_presence_of :password_confirmation, on: :create
    validate :stripe_customer_id_format, if: -> { stripe_customer_id.present? }

    after_initialize :ensure_recovery_password_digest, :ensure_session_token

    has_many :orders
    has_many :sessions, dependent: :destroy

    def self.generate_token
        SecureRandom.urlsafe_base64 36
    end

    def ensure_recovery_password_digest
        self.recovery_password_digest ||= User.generate_token
    end

    def ensure_session_token
        self.session_token ||= User.generate_token
    end

    def reset_session_token!
        self.update_column(:session_token, User.generate_token)
        self.session_token
    end

    def demo_admin?
        self.email === DEMO_ADMIN_EMAIL
    end

    private

    def stripe_customer_id_format
        if !self.stripe_customer_id.match? /^cus_.*/
            self.errors.add :stripe_customer_id, "does not represent a properly formatted Stripe Customer id."
        end
    end
end
