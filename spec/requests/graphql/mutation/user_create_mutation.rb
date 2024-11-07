require "rails_helper"

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
        let(:email) { Faker::Internet.email }
        let(:password) { Faker::Internet.password }
        let(:variables) {
            {
                input: {
                    userInput: {
                        email: email,
                        password: password,
                        passwordConfirmation: password
                    }
                }
            }
        }

        it "creates a new user and logs them in" do
            expect {
                post "/graphql", params: {query: query, variables: variables}
            }.to change { User.count }.from(0).to(1)

            user = User.last
            expect(user.session_token).to eq session[:session_token]
            expect(user.email).to eq email
        end
    end

    context "with invalid params" do
        it "does not create the user and displays errors" do
            variables = {
                input: {
                    userInput: {
                        email: "not_an_email",
                        password: "short",
                        passwordConfirmation: "does_not_match"
                    }
                }
            }

            post "/graphql", params: { query: query, variables: variables }
            
            data = JSON.parse(response.body)["data"]
            expect(data["userCreate"]["user"]).to be nil
            
            errors = data["userCreate"]["errors"]
            expect(errors).to eq [{"message"=>"doesn't match Password", "path"=>["attributes", "passwordConfirmation"]}, {"message"=>"is too short (minimum is 8 characters)", "path"=>["attributes", "password"]}]
        end
    end
end