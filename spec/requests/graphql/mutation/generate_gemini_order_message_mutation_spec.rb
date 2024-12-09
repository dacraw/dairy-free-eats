require "rails_helper"

RSpec.describe "Generate Gemini Order Message Mutation", type: :request do
    let(:query) {
        <<-MUTATION
            mutation GenerateGeminiOrderMessage($input: GenerateGeminiOrderMessageInput!) {
                generateGeminiOrderMessage(input: $input) {
                    orderMessage {
                        id
                        body
                    }
                    errors {
                        path
                        message
                    }
                }
            }
        MUTATION
    }

    def perform_mutation(variables)
        post graphql_path,
            params: { query: query, variables: variables }.to_json,
            headers: { "Content-Type": "application/json" }

        JSON.parse(response.body)["data"]
    end

    it "generates a Gemini response to an order message" do
        # Going to mock the gemini response
        # I tried VCR, and but it appears that the chatbot response isn't being saved in the cassette
        # i.e., running the first time passes w/ gemini response, cassette is formed w/o the response
        # fails every time after because the cassette lacks a chatbot response

        nanobot_double = double('Nanobot')
        expect(NanoBot).to receive(:new) { nanobot_double }
        expect(nanobot_double).to receive(:eval) { "Mocked bot response" }

        gemini_user = create :gemini_user
        order_message = create :order_message, :valid_order_message, body: "Is this food good?"

        variables = {
            input: {
                orderMessageId: order_message.id
            }
        }

        data = perform_mutation variables

        graphql_response = data["generateGeminiOrderMessage"]["orderMessage"]
        expect(graphql_response["id"].to_i).to eq OrderMessage.last.id
        expect(graphql_response["body"]).to eq OrderMessage.last.body
        expect(OrderMessage.count).to eq 2
    end
end
