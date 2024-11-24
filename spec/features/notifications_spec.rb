require "rails_helper"

RSpec.describe "Notifications Features Spec",:perform_enqueued do
    let(:user) { create :user, :valid_user, :with_orders }
    let(:admin_user) { create :user, :valid_user, admin: true }
    
    it "sends a live notification to the admin user from the order user" do
        admin_session = "Admin session"
        user_session = "User session"
        chat_message = "test message"

        Capybara.using_session(admin_session) do
            feature_login_user admin_user

            visit order_chats_admin_dashboard_path

            chat_text = "Order ##{user.orders.first.id} Chat"
            expect(page).to have_content chat_text
        end

        Capybara.using_session(user_session) do
            feature_login_user user

            chat_text = "Order ##{user.orders.first.id} Chat"
            expect(page).to have_content chat_text

            find("p", text: chat_text).click

            expect {
                fill_in "message", with: chat_message
    
                click_button "Submit Message"
    
                expect(page).to have_content chat_message
            }.to change { Notification.count }.by(1)
        end

        Capybara.using_session(admin_session) do
            expect(page).to have_selector "#new-notifications-dot"
            
            find("#current-notifications-bell").click

            expect(page).not_to have_selector "#new-notifications-dot"
            
            expect(page).to have_content "#{user.email_address} has sent a message for order##{user.orders.first.id}: \"#{chat_message.truncate 20}\""
        end
    end

    it "sends a live notification to the user from the admin" do
        admin_session = "Admin session"
        user_session = "User session"
        chat_message = "test message"

        Capybara.using_session(user_session) do
            feature_login_user user

            chat_text = "Order ##{user.orders.first.id} Chat"
            expect(page).to have_content chat_text
        end

        Capybara.using_session(admin_session) do
            feature_login_user admin_user

            visit order_chats_admin_dashboard_path

            chat_text = "Order ##{user.orders.first.id} Chat"
            expect(page).to have_content chat_text

            find("p", text: chat_text).click

            expect {
                fill_in "message", with: chat_message
    
                click_button "Submit Message"
    
                expect(page).to have_content chat_message
            }.to change { Notification.count }.by(1)
        end

        Capybara.using_session(user_session) do
            expect(page).to have_selector "#new-notifications-dot"
            
            find("#current-notifications-bell").click

            expect(page).not_to have_selector "#new-notifications-dot"
            
            expect(page).to have_content "An order admin has just messaged you about Order ##{user.orders.first.id}: \"#{user.orders.first.order_messages.first.body.truncate 20}\""
        end
    end
end