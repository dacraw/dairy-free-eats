require "rails_helper"

RSpec.describe "Stripe Refund Create Mutation" do
    let(:order) { create :order, :with_line_items, :with_a_user }
    let(:query) {
        <<-GRAPHQL
            mutation StripeRefundCreate($input: StripeRefundCreateInput!){
                stripeRefundCreate(input: $input){
                    stripeRefund {
                        id
                        amount
                        paymentIntent {
                            id
                            amountReceived
                        }
                    }
                }
            }
        GRAPHQL
     }

    it "Provides stripe refund details" do
        mocked_refund = Stripe::Refund.construct_from(
            {
                id: "re_3QUHb4ElA4InVgv81eDXEAB8",
                object: "refund",
                amount: 1200,
                balance_transaction: "txn_3QUHb4ElA4InVgv81Hi0TzZW",
                charge: "ch_3QUHb4ElA4InVgv81cziIkM3",
                created: 1733799549,
                currency: "usd",
                destination_details: Stripe::StripeObject.construct_from(
                    {
                        card:                             {
                                reference_status: "pending",
                                reference_type: "acquirer_reference_number",
                                type: "refund"
                            },
                        type: "card"
                    }
                ),
                metadata: {},
                payment_intent: Stripe::PaymentIntent.construct_from(
                    {
                        id: "pi_12345",
                        amount_received: 1200
                    }
                ),
                reason: nil,
                receipt_number: nil,
                source_transfer_reversal: nil,
                status: "succeeded",
                transfer_reversal: nil
            }
        )

        expect(Stripe::Refund).to receive(:create) { mocked_refund }

        params = {
            query: query,
            variables: {
                input: {
                    paymentIntentId: "pi_12345"
                }
            }
        }

        post graphql_url,
            headers: { "Content-Type": "application/json" },
            params: params.to_json

        gql_refund = JSON.parse(response.body)["data"]["stripeRefundCreate"]["stripeRefund"]

        expect(gql_refund["id"]).to eq mocked_refund.id
        expect(gql_refund["amount"]).to eq mocked_refund.amount
        expect(gql_refund["paymentIntent"]["id"]).to eq mocked_refund.payment_intent.id
        expect(gql_refund["paymentIntent"]["amountReceived"]).to eq mocked_refund.payment_intent.amount_received
    end
end
