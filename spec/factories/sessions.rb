FactoryBot.define do
  factory :session do
    trait :with_a_user do
      user { create :user, :valid_user }
    end
  end
end
