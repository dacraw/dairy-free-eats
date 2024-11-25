require "rails_helper"

RSpec.describe "Notifications Features Spec", :perform_enqueued do
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

            # when the subscription is done loading, the chat messsage icon appears to enable opening chat
            expect(page).to have_selector('svg[data-icon="message"]')

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

            # when the subscription is done loading, the chat messsage icon appears to enable opening chat
            expect(page).to have_selector('svg[data-icon="message"]')

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

    it "adds a new notification to the list and allows more to be fetched" do
        # the purpose of this is to ensure that the cache is working
        # When a new notification is created, it should be added to Apollo cache and thus appear in the notifications list
        # Then, when clicking "Load More", messages should be appended to the list
        # This stems from the original issue with default Relay connection & relayStylePagination,
        # In which after creating a new Notification, the cursors wouldn't be offset and thus fetch "duplicate" notifications (i.e. older notifications that didn't account for a new notification being created)

        admin_session = "Admin session"
        user_session = "User session"
        chat_message = "test message"

        notifications = build_list :notification, 6, user: user do |notification|
            notification.message = Faker::Lorem.sentence
            notification.save
        end

        user.notifications = notifications
        user.save

        Capybara.using_session(user_session) do
            feature_login_user user

            find("#current-notifications-bell").click
            expect(page).to have_content "NOTIFICATIONS"
        end

        Capybara.using_session(admin_session) do
            feature_login_user admin_user

            visit order_chats_admin_dashboard_path

            chat_text = "Order ##{user.orders.first.id} Chat"
            expect(page).to have_content chat_text

            # when the subscription is done loading, the chat messsage icon appears to enable opening chat
            expect(page).to have_selector('svg[data-icon="message"]')

            find("p", text: chat_text).click

            expect {
                fill_in "message", with: chat_message

                click_button "Submit Message"

                expect(page).to have_content chat_message
            }.to change { Notification.count }.by(1)
        end

        Capybara.using_session(user_session) do
            expect(page).to have_content user.notifications.last.message

            scroll_to(find_button "Load More")
            click_button "Load More"

            expect(page).to have_content notifications.last.message
        end
    end
end
