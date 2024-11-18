require 'rails_helper'

RSpec.feature "Admin Dashboard", type: :feature do
    context "when there is an admin user logged in" do
        let(:user) { create :user, :valid_user, admin: true }
        let(:mailer_double) { double(OrderMailer) }

        before(:each) do
            feature_login_user user
        end

        it "allows the user to set a received order to active" do
            order = create :order, :with_line_items, :with_a_user

            expect(OrderMailer).to receive(:with).with(order: order) { mailer_double }
            expect(mailer_double).to receive(:order_active) { mailer_double }
            expect(mailer_double).to receive(:deliver_later) { true }

            visit admin_dashboard_index_path

            expect(page).to have_content "Admin Dashboard"

            click_button "Set Active"
            expect(page).to have_button "Confirm"
            click_button "Confirm"

            expect(page).to have_content "Active"
            expect(order.reload.active?).to be true
        end

        it "allows the user to set a received order to in transit" do
            order = create :order, :with_line_items, :with_a_user, :active

            expect(OrderMailer).to receive(:with).with(order: order) { mailer_double }
            expect(mailer_double).to receive(:order_in_transit) { mailer_double }
            expect(mailer_double).to receive(:deliver_later) { true }

            visit admin_dashboard_index_path

            expect(page).to have_content "Admin Dashboard"

            click_button "Set In-Transit"
            expect(page).to have_button "Confirm"
            click_button "Confirm"

            expect(page).to have_content "In Transit"
            expect(order.reload.in_transit?).to be true
        end

        it "allows the user to set a received order to completed" do
            order = create :order, :with_line_items, :with_a_user, :in_transit

            expect(OrderMailer).to receive(:with).with(order: order) { mailer_double }
            expect(mailer_double).to receive(:order_completed) { mailer_double }
            expect(mailer_double).to receive(:deliver_later) { true }

            visit admin_dashboard_index_path

            expect(page).to have_content "Admin Dashboard"

            click_button "Set Completed"
            expect(page).to have_button "Confirm"
            click_button "Confirm"

            expect(page).to have_content "Completed"
            expect(order.reload.completed?).to be true
        end
    end
end
