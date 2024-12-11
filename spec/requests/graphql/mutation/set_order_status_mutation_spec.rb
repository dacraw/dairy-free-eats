require "rails_helper"
require_relative "../../../support/vcr"

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

      context "when changing the order status to cancelled" do
         let(:order) { create :order, :with_line_items }
         let(:mailer_double) { double(OrderMailer) }

         def perform_query(order)
            expect {
               post graphql_path, params: {
                  query: query,
                  variables: {
                     input: {
                        setOrderStatusInputType: {
                           id: order.id,
                           status: "cancelled"
                        }
                     }
                  }
               }
            }.to change { order.reload.status }.from("received").to("cancelled")
         end

         def mock_successful_refund
            Stripe::Refund.construct_from(
               {
                  id: "re_3QUcBIElA4InVgv80IXokEJM",
                  object: "refund",
                  amount: 1200,
                  balance_transaction: "txn_3QUcBIElA4InVgv801r2LO3A",
                  charge: "ch_3QUcBIElA4InVgv80qzhLOwp",
                  created: 1733870803,
                  currency: "usd",
                  destination_details: Stripe::StripeObject.construct_from(
                     {
                        card: Stripe::StripeObject.construct_from(
                           {
                              reference_status: "pending",
                              reference_type: "acquirer_reference_number",
                              type: "refund"
                           }
                        ),
                        type: "card"
                     }
                  ),
                  metadata: {},
                  payment_intent: "pi_3QUcBIElA4InVgv80nFH9SD1",
                  reason: nil,
                  receipt_number: nil,
                  source_transfer_reversal: nil,
                  status: "succeeded",
                  transfer_reversal: nil
               }
            )
         end

         it "sets the order status" do
            mock_refund = mock_successful_refund

            expect(Stripe::Refund)
               .to receive(:create)
               .with(payment_intent: order.stripe_payment_intent_id, expand: [ "payment_intent" ])
               .and_return(mock_refund)

            perform_query order

            graphql_response = JSON.parse(response.body)

            graphql_order = graphql_response["data"]["setOrderStatus"]["order"]
            expect(graphql_order["id"].to_i).to eq order.id
            expect(graphql_order["status"]).to eq order.status
         end

         it "sends an email" do
            mock_refund = mock_successful_refund

            expect(Stripe::Refund)
               .to receive(:create)
               .with(payment_intent: order.stripe_payment_intent_id, expand: [ "payment_intent" ])
               .and_return(mock_refund)

            expect(OrderMailer).to receive(:with).with(order: order) { mailer_double }
            expect(mailer_double).to receive(:order_cancelled) { mailer_double }
            expect(mailer_double).to receive(:deliver_later) { true }

            perform_query order
         end

         context "when there's an error creating the refund" do
            let(:cassette_name) { "set_error_status" }

            it "raises an error" do
               VCR.use_cassette cassette_name do
                  # expect(Stripe::Refund).to receive(:create) { Stripe::InvalidRequestError.new "Some issue with the request", ""}
                  expect { Stripe::Refund.create }.to raise_error(Stripe::InvalidRequestError)

                  expect {
                     post graphql_path, params: {
                        query: query,
                        variables: {
                           input: {
                              setOrderStatusInputType: {
                                 id: order.id,
                                 status: "cancelled"
                              }
                           }
                        }
                     }
                  }.not_to change { order.reload.status }

                  graphql_response = JSON.parse(response.body)
                  error_message = graphql_response["errors"].first["message"]

                  expect(error_message).to eq "There was an error issuing the refund. Order status unchanged. No such payment_intent: '#{order.stripe_payment_intent_id}'"
               end
            end
         end
      end
   end
end
