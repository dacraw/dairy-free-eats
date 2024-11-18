FactoryBot.define do
  factory :order_message do
    order { nil }
    user { nil }
    body { "MyText" }
  end
end
