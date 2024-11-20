require "rails_helper"

RSpec.describe "Admin Order Page" do
    context "when the user is an admin" do
        let(:user) { create :user, :valid_user, admin: true }
        let(:order) { create :order, :with_line_items, :with_a_user }

        before(:each) do
            feature_login_user user
        end

        it "allows an admin to set the order status to active" do
            visit admin_dashboard_order_path(id: order.id)

            expect(page).to have_content "Order Details"

            click_button "Set Active"

            click_button "Confirm"

            expect(page).to have_content "active"
        end
    end
end
