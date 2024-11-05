FactoryBot.define do
  factory :user do
    trait :valid_user do
      email { Faker::Internet.email }

      before :create do |user|
        password = Faker::Internet.password min_length: 8
        user.password = password
        user.password_confirmation = password
      end
    end
  end
end
