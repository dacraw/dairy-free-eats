FactoryBot.define do
  factory :order do
    trait :with_line_items do
      completed_at { nil }
      amount_total { 600 }
      stripe_payment_intent_id  { "pi_12345" }
      stripe_checkout_session_line_items {
        [
          {
            "name": "Mega Burrito",
            "quantity": 1,
            "image_url": "www.someimage.com",
            "unit_amount": 300
          },
          {
            "name": "Beeborito",
            "quantity": 2,
            "image_url": "www.someimage.com",
            "unit_amount": 300
          }
        ]
      }
    end

    trait :active do
      after(:create) do |order|
        order.active!
      end
    end

    trait :in_transit do
      after(:create) do |order|
        order.in_transit!
      end
    end

    trait :completed do
      after(:create) do |order|
        order.completed!
      end
    end


    trait :cancelled do
      after(:create) do |order|
        order.cancelled!
      end
    end

    trait :with_order_messages do
      after(:create) do |order|
        order.order_messages.push create(:order_message, order: order, user: order.user)

        order.save
        order.reload
      end
    end

    trait :with_a_user do
      user { create :user, :valid_user }
    end
  end
end
