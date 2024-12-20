class User < ApplicationRecord
    DEMO_ADMIN_EMAIL = "demoadmin@dairytest.com"
    GEMINI_USER_EMAIL = "dairyfreeeatsgemini@not_an_email.com"

    has_secure_password

    normalizes :email_address, with: ->(e) { e.strip.downcase }

    validates :email_address, presence: true
    validates_length_of :password, minimum: 8
    validates_presence_of :password_confirmation, on: :create
    validate :stripe_customer_id_format, if: -> { stripe_customer_id.present? }

    has_many :orders
    has_many :sessions, dependent: :destroy
    has_many :notifications, dependent: :destroy

    def demo_admin?
        self.email_address === DEMO_ADMIN_EMAIL
    end

    def gemini_user?
        self.email_address == GEMINI_USER_EMAIL
    end

    private

    def stripe_customer_id_format
        if !self.stripe_customer_id.match? /^cus_.*/
            self.errors.add :stripe_customer_id, "does not represent a properly formatted Stripe Customer id."
        end
    end
end
