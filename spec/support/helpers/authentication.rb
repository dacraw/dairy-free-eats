module Helpers
    module Authentication
        def login_user(user)
          # Sign in user - convert this into a helper
          post session_url, params: { session: { email_address: user.email_address, password: user.password }}

          jar = ActionDispatch::Cookies::CookieJar.build(request, cookies.to_hash)

          expect(jar.signed[:session_id]).to eq user.sessions.last.id
        end

        def feature_login_user(user)
            visit login_path

            expect(page).to have_content "Email"
            expect(page).to have_content "Password"

            fill_in "Email", with: user.email_address
            fill_in "Password", with: user.password
            find("input[type='submit']").click

            expect(page).to have_content "Order lactose-free food that is tasty and affordable."
            expect(page).to have_content "Logged in as: #{user.email_address}"
        end
    end
end
