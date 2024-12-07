require "rails_helper"

RSpec.describe "My Orders Features Spec" do
    let!(:user) { create :user, :valid_user, :with_orders }

    it "renders" do
        feature_login_user user

        visit my_orders_path
        expect(page).to have_content "My Orders"
        expect(page).to have_content "Order #"
    end
end
