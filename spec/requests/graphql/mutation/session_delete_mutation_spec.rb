require "rails_helper"

RSpec.describe "Session Delete Mutation Spec" do
    let!(:user) { create :user, :valid_user }

    let(:query) {
        <<-GRAPHQL
            mutation SessionDelete {
                sessionDelete(input: {}) {
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

    let(:login_query) {
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

    let(:login_variables) {
        {
            input: {
                sessionInput: {
                    email: user.email_address,
                    password: user.password
                }
            }
        }
    }

    context "when there is a user logged in" do
        it "logs out the current user" do
            post "/graphql", params: { query: login_query, variables: login_variables }

            expect(session[:session_token]).to eq User.last.session_token

            post "/graphql", params: { query: query, variables: { input: nil } }

            data = JSON.parse(response.body)["data"]
            expect(data["sessionDelete"]["user"]).to be nil
            expect(data["sessionDelete"]["errors"]).to be_empty
            expect(session[:session_token]).to be nil
        end
    end

    context "when there is no user logged in" do
        it "returns an error in the response" do
            post "/graphql", params: { query: query, variables: { input: nil } }

            data = JSON.parse(response.body)["data"]

            expect(data["sessionDelete"]["user"]).to be nil
            expect(data["sessionDelete"]["errors"]).to match_array([ { "message"=>"There is no current user", "path"=>nil } ])
            expect(session[:session_token]).to be nil
        end
    end
end
