class User < ApplicationRecord
    has_secure_password
    has_secure_password :recovery_password, validations: false
    
    validates :email, presence: true
    validates_length_of :password, minimum: 8, maximum: 32
end
