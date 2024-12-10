require "rails_helper"

RSpec.describe "Set Order Status Mutation Spec" do
   let(:query) {
      <<-GRAPHQL
         mutation SetOrderStatus($input: SetOrderStatusInput!) {
            setOrderStatus(input: $input) {
               order {
               id
               status
               }
            }
         }
      GRAPHQL
   }

   context "when the current user is not an admin user" do
      let(:order) { create :order, :with_line_items }
      let(:user) { create :user, :valid_user }

      it "raises an error" do
         login_user user

         expect {
            post "/graphql", params: {
               query: query,
               variables: {
                  input: {
                     setOrderStatusInputType: {
                        id: order.id,
                        status: "active"
                     }
                  }
               }
            }
         }.not_to change { order.status }

         graphql_response = JSON.parse(response.body)
         expect(graphql_response["errors"].first["message"]).to eq "Only admins can perform this action."
         expect(order.received?).to be true
      end
   end

   context "when the current user is an admin" do
      let(:user) { create :user, :valid_user, admin: true }
      let(:order) { create :order, :with_a_user, :with_line_items }

      before(:each) do
         login_user user
      end

      def perform_query(order)
         expect {
            post graphql_path, params: {
               query: query,
               variables: {
                  input: {
                     setOrderStatusInputType: {
                        id: order.id,
                        status: "active"
                     }
                  }
               }
            }
         }.to change { order.reload.status }.from("received").to("active")
      end

      it "creates a notification" do
         notifications = order.user.notifications

         expect {
            perform_query order
         }.to change { notifications.reload.count }.from(0).to(1)

         notification = notifications.last
         expect(notification.message).to eq "Your order ##{order.id} has been set to status: #{order.status.titleize}"
         expect(notification.path).to eq "/orders/#{order.id}"
      end

      context "when the order does not exist" do
         it "returns an error" do
            post graphql_path, params: {
               query: query,
               variables: {
                  input: {
                     setOrderStatusInputType: {
                        id: 12345,
                        status: "active"
                     }
                  }
               }
            }

            graphql_response = JSON.parse(response.body)
            expect(graphql_response["errors"].first["message"]).to eq "The order does not exist."
         end
      end

      context "when changing the order status to active" do
         let(:order) { create :order, :with_a_user, :with_line_items }
         let(:mailer_double) { double('OrderMailer') }

         def perform_query(order)
            expect {
               post graphql_path, params: {
                  query: query,
                  variables: {
                     input: {
                        setOrderStatusInputType: {
                           id: order.id,
                           status: "active"
                        }
                     }
                  }
               }
            }.to change { order.reload.status }.from("received").to("active")
         end

         it "sets the order status" do
            perform_query order

            graphql_response = JSON.parse(response.body)

            graphql_order = graphql_response["data"]["setOrderStatus"]["order"]
            expect(graphql_order["id"].to_i).to eq order.id
            expect(graphql_order["status"]).to eq order.status
         end

         it "sends an email to the user's email address" do
            expect(OrderMailer).to receive(:with).with(order: order) { mailer_double }
            expect(mailer_double).to receive(:order_active) { mailer_double }
            expect(mailer_double).to receive(:deliver_later) { true }

            perform_query order
         end
      end

      context "when changing the order status to in_transit" do
         let(:order) { create :order, :with_line_items, :active }
         let(:mailer_double) { double(OrderMailer) }

         def perform_query(order)
            expect {
               post graphql_path, params: {
                  query: query,
                  variables: {
                     input: {
                        setOrderStatusInputType: {
                           id: order.id,
                           status: "in_transit"
                        }
                     }
                  }
               }
            }.to change { order.reload.status }.from("active").to("in_transit")
         end

         it "sets the order status" do
            perform_query order

            graphql_response = JSON.parse(response.body)

            graphql_order = graphql_response["data"]["setOrderStatus"]["order"]
            expect(graphql_order["id"].to_i).to eq order.id
            expect(graphql_order["status"]).to eq order.status
         end

         it "sends an email" do
            expect(OrderMailer).to receive(:with).with(order: order) { mailer_double }
            expect(mailer_double).to receive(:order_in_transit) { mailer_double }
            expect(mailer_double).to receive(:deliver_later) { true }

            perform_query order
         end
      end

      context "when changing the order status to completed" do
         let(:order) { create :order, :with_line_items, :in_transit }
         let(:mailer_double) { double(OrderMailer) }

         def perform_query(order)
            expect {
               post graphql_path, params: {
                  query: query,
                  variables: {
                     input: {
                        setOrderStatusInputType: {
                           id: order.id,
                           status: "completed"
                        }
                     }
                  }
               }
            }.to change { order.reload.status }.from("in_transit").to("completed")
         end

         it "sets the order status" do
            perform_query order

            graphql_response = JSON.parse(response.body)

            graphql_order = graphql_response["data"]["setOrderStatus"]["order"]
            expect(graphql_order["id"].to_i).to eq order.id
            expect(graphql_order["status"]).to eq order.status
         end

         it "sends an email" do
            expect(OrderMailer).to receive(:with).with(order: order) { mailer_double }
            expect(mailer_double).to receive(:order_completed) { mailer_double }
            expect(mailer_double).to receive(:deliver_later) { true }

            perform_query order
         end

         it "sets the completed at column" do
            expect(order.completed_at).to be nil

            perform_query order

            expect(order.completed_at).to be_present
         end
      end
   end
end
