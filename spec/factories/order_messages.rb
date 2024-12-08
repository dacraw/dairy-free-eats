FactoryBot.define do
  factory :order_message do
    order { nil }
    user { nil }
    body { "MyText" }
  end

  trait :valid_order_message do
    order { create :order, :with_a_user, :with_line_items }
    user { create :user, :valid_user }
    body { Faker::Lorem.sentence }
  end
end
