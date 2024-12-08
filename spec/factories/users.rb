FactoryBot.define do
  factory :user do
    trait :valid_user do
      email_address { Faker::Internet.unique.email }

      before :create do |user|
        password = Faker::Internet.password min_length: 8
        user.password = password
        user.password_confirmation = password
      end
    end

    trait :with_orders do
      after(:create) do |user|
        user.orders = [ create(:order, :with_line_items) ]
        user.save!
        user.reload
      end
    end

    trait :with_notifications do
      after(:create) do |user|
        user.notifications = [ create(:notification, message: "hey", user: user) ]
        user.save
        user.reload
      end
    end
  end

  factory :gemini_user, parent: :user do
    email_address { User::GEMINI_USER_EMAIL }

    before :create do |user|
      password = Faker::Internet.password min_length: 8
      user.password = password
      user.password_confirmation = password
    end
  end
end
