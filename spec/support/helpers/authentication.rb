module Helpers
    module Authentication
        def login_user(user)
          # Sign in user - convert this into a helper
          sign_in_query =
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

          sign_in_variables = {
            input: {
                sessionInput: {
                    email: user.email,
                    password: user.password
                }
            }
          }

          post "/graphql", params: { query: sign_in_query, variables: sign_in_variables }

          expect(controller.current_user).to be_present

          user
        end
    end
end
