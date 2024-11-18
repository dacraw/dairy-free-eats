require 'rails_helper'

RSpec.feature "Admin Dashboard", type: :feature do
    context "when there is an admin user logged in" do
        let!(:orders) { create_list :order, 3, :with_line_items, :with_a_user }
        let(:user) { create :user, :valid_user, admin: true }
        let(:mailer_double) { double('OrderMailer') }

        before(:each) do
            feature_login_user user
        end

        it "allows the user to set a received order to active" do
            expect(OrderMailer).to receive(:with).with(order: orders.first) { mailer_double }
            expect(mailer_double).to receive(:order_active) { mailer_double }
            expect(mailer_double).to receive(:deliver_later) { true }

            visit admin_dashboard_index_path

            expect(page).to have_content "Admin Dashboard"

            order_row = find("p", text: orders.first.user.email_address).find(:xpath, "./..")
            set_active_button = order_row.find_button("Set Active")

            set_active_button.click
            expect(page).to have_button "Confirm"
            click_button "Confirm"

            expect(order_row.find("p", text: "active")).to be_present
            expect(orders.first.reload.active?).to be true
        end
    end
end
