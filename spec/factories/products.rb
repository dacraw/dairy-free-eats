FactoryBot.define do
  factory :product do
    trait :valid_product do
      stripe_product_id { Faker::Lorem.word }
      stripe_price_unit_amount { 300 }
      stripe_description { Faker::Lorem.sentence }
      stripe_images { [ Faker::Lorem.word ] }
      stripe_name { Faker::Lorem.word }
      stripe_default_price_id { Faker::Lorem.word }
    end
  end
end
