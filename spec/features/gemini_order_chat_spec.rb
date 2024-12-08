require "rails_helper"

RSpec.feature "Gemini Order Chat Spec", type: :feature do
    describe "when the current user is not an admin" do
        describe "when chatbot response feature is enabled", :perform_enqueued do
            let!(:user) { create :user, :valid_user, :with_orders }
            let!(:gemini_user) { create :gemini_user }
            let(:nanobot_double) { double('Nanobot') }

            before(:each) do
                # Mocking per comment in `spec/requests/graphql/mutation/generate_gemini_order_message_mutation_spec.rb``
                expect(NanoBot).to receive(:new) { nanobot_double }
                expect(nanobot_double).to receive(:eval) { "Mocked bot response" }

                feature_login_user user
            end

            it "allows user to send messages and receive them from the chatbot" do
                order = user.orders.first

                order_chat_title = "Order ##{order.id} Chat"
                expect(page).to have_content "Order ##{order.id} Chat"

                find('p', text: order_chat_title).click

                expect(page).to have_content "This chat will be available after an order is received and until it is completed."

                expect(page).to have_selector("#receive-gemini-response")
                expect(find("#receive-gemini-response")).to be_checked

                fill_in "message", with: "Hey there"

                click_button "Submit Message"

                expect(find("#chat")).to have_content "Hey there"

                expect(find("#chat")).to have_content "Mocked bot response"
            end
        end
    end

    describe "when the current user is an admin", :perform_enqueued do
        let!(:order) { create :order, :with_a_user, :with_line_items }
        let!(:admin_user) { create :user, :valid_user, admin: true }
        let!(:gemini_user) { create :gemini_user }

        it "does not allow them to receive chatbot responses" do
            expect(NanoBot).not_to receive(:new)

            feature_login_user admin_user

            visit order_chats_admin_dashboard_path

            expect(page).to have_content "Order ##{order.id} Chat"

            find("p", text: "Order ##{order.id} Chat").click

            expect(page).to have_content "This chat will be available after an order is received and until it is completed."

            expect(page).to have_no_selector("#receive-gemini-response")

            fill_in "message", with: "Test Message"

            click_button "Submit Message"

            expect(find("#chat")).to have_content "Test Message"
        end
    end
end
