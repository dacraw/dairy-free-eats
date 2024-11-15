require 'rails_helper'

RSpec.feature "Logins", type: :feature do
  let!(:user) { create :user, :valid_user }

  context "with valid credentials" do
    it "redirects to the root page" do
      feature_login_user user
    end
  end

  context "with invalid credentials" do
    context "rendering error message" do
      it "returns error for an invalid email" do
        visit login_path

        expect(page).to have_content "Email"
        expect(page).to have_content "Password"

        fill_in "Email", with: Faker::Internet.unique.email
        fill_in "Password", with: user.password
        find("input[type='submit']").click

        expect(page).to have_content "Credentials invalid"
      end

      it "renders error for an invalid password" do
        visit login_path

        expect(page).to have_content "Email"
        expect(page).to have_content "Password"

        fill_in "Email", with: user.email
        fill_in "Password", with: Faker::Internet.password(min_length: 9)
        find("input[type='submit']").click

        expect(page).to have_content "Credentials invalid"
      end
    end
  end
end
