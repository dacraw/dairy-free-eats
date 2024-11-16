require 'rails_helper'

RSpec.feature "Admin Dashboard", type: :feature do
    context "when there is an admin user logged in" do
        let!(:orders) { create_list :order, 3, :with_line_items, :with_a_user }
        let(:user) { create :user, :valid_user, admin: true }

        before(:each) do
            feature_login_user user
        end

        it "allows the user to set a received order to active" do
            visit admin_dashboard_index_path

            expect(page).to have_content "Admin Dashboard"

            order_row = find("p", text: orders.first.user.email_address).find(:xpath, "./..")
            set_active_button = order_row.find_button("Set Active")

            set_active_button.click
            expect(order_row.find("p", text: "active")).to be_present
            expect(orders.first.reload.active?).to be true
        end
    end
end
