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

        def feature_login_user(user)
            visit login_path

            expect(page).to have_content "Email"
            expect(page).to have_content "Password"

            fill_in "Email", with: user.email
            fill_in "Password", with: user.password
            find("input[type='submit']").click

            expect(page).to have_content "Order lactose-free food that is tasty and affordable."
            expect(page).to have_content "Logged in as: #{user.email}"
        end
    end
end
