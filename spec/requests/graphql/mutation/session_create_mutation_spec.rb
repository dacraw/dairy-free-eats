require "rails_helper"

RSpec.describe "Session Create Mutation" do
    let(:query) {
        <<-GRAPHQL
            mutation CreateSession($input: SessionCreateInput!) {
                sessionCreate(input: $input){
                    user {
                        id
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
        let!(:user) { create :user, :valid_user }
        let(:variables) {
            {
                input: {
                    sessionInput: {
                        email: user.email_address,
                        password: user.password
                    }
                }
            }
        }

        it "logs the user in" do
            expect(User.count).to eq 1
            expect {
                post "/graphql", params: { query: query, variables: variables }
            }.not_to change { User.count }

            logged_in_user = User.last
            data = JSON.parse(response.body)["data"]

            expect(data["sessionCreate"]["user"]["id"].to_i).to eq logged_in_user.id
            expect(data["sessionCreate"]["errors"]).to be_empty
            expect(session[:session_token]).to eq logged_in_user.session_token
        end
    end

    context "with invalid params" do
        let!(:user) { create :user, :valid_user }

        it "verifies a user with the provided email exists" do
            variables = {
                input: {
                    sessionInput: {
                        email: "not_a_user@nope.com",
                        password: Faker::Internet.password(min_length: 8)
                    }
                }
            }
            post "/graphql", params: { query: query, variables: variables }

            data = JSON.parse(response.body)["data"]
            expect(data["sessionCreate"]["user"]).to be nil
            expect(data["sessionCreate"]["errors"]).to match_array([ { "message"=>"invalid", "path"=>[ "attributes", "credentials" ] } ])
            expect(session[:session_token]).to be nil
        end

        it "verifies that the entered password is correct" do
            variables = {
                input: {
                    sessionInput: {
                        email: user.email_address,
                        password: "thisCannotBeCorrect"
                    }
                }
            }

            post "/graphql", params: { query: query, variables: variables }

            data = JSON.parse(response.body)["data"]

            expect(data["sessionCreate"]["user"]).to be nil
            expect(data["sessionCreate"]["errors"]).to match_array([ { "message"=>"invalid", "path"=>[ "attributes", "credentials" ] } ])
            expect(session[:session_token]).to be nil
        end
    end
end
