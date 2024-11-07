class User < ApplicationRecord
    has_secure_password
    has_secure_password :recovery_password, validations: false

    validates :email, presence: true
    validates_length_of :password, minimum: 8
    validates :session_token, { uniqueness: true, presence: true }
    validates :recovery_password_digest, { uniqueness: true, presence: true }
    validates_presence_of :password_confirmation, on: :create

    after_initialize :ensure_recovery_password_digest, :ensure_session_token

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
        # debugger
        # self.update(session_token: User.generate_token)
        self.update_column(:session_token, User.generate_token)
        self.session_token
    end
end
