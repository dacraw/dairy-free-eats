require "rails_helper"
require "./spec/support/vcr"

RSpec.describe "User Create Mutation", type: :request do
    let(:query) {
        <<-GRAPHQL
            mutation CreateUser($input: UserCreateInput!) {
                userCreate(input: $input){
                    user {
                        id
                        email
                    }
                    errors {
                        message
                        path
                    }
                }
            }
        GRAPHQL
    }

    context "with valid params" do
        let(:email) { "new_user_valid_params@test.com" }
        let(:password) { Faker::Internet.password(min_length: 8) }
        let(:variables) {
            {
                input: {
                    userInput: {
                        email: email,
                        password: password,
                        passwordConfirmation: password,
                        address: {
                            city: "San Francisco",
                            country: "USA",
                            line1: "123 Main St.",
                            line2: "Suite 55",
                            postalCode: "12555",
                            state: "CA"
                        },
                        name: "Tester Testington",
                        phone: "123-555-8901"
                    }
                }
            }
        }

        it "creates a new user and logs them in" do
            expect {
                 VCR.use_cassette "user_signup_create_stripe_customer" do
                    post "/graphql", params: { query: query, variables: variables }
                end
            }.to change { User.count }.from(0).to(1)

            stripe_customer_json = YAML.load_file("./spec/cassettes/user_signup_create_stripe_customer.yml")["http_interactions"].first["response"]["body"]["string"]

            stripe_customer = JSON.parse(stripe_customer_json, symbolize_names: true)
            
            user = User.last
            expect(user.session_token).to eq session[:session_token]
            expect(user.email).to eq email

            expect(stripe_customer[:email]).to eq user.email
            expect(user.stripe_customer_id).to eq stripe_customer[:id]
        end
    end

    context "with invalid params" do
        it "does not create the user and displays errors" do
            variables = {
                input: {
                    userInput: {
                        address: {
                            city: "Here",
                            country: "#1",
                            line1: "555 Big St.",
                            postalCode: "555555",
                            state: "There"
                        },
                        email: "not_an_email",
                        name: "Some Body",
                        phone: "123-555-1111",
                        password: "short",
                        passwordConfirmation: "does_not_match"
                    }
                }
            }

            expect(Stripe::Customer).not_to receive(:create)

            expect {
                post "/graphql", params: { query: query, variables: variables }
            }.not_to change { User.count }

            data = JSON.parse(response.body)["data"]
            expect(data["userCreate"]["user"]).to be nil

            errors = data["userCreate"]["errors"]
            expect(errors).to eq [ { "message"=>"doesn't match Password", "path"=>[ "attributes", "passwordConfirmation" ] }, { "message"=>"is too short (minimum is 8 characters)", "path"=>[ "attributes", "password" ] } ]
        end
    end
end
