require 'rails_helper'

RSpec.feature "Logout", type: :feature do
  let!(:user) { create :user, :valid_user }

  before(:each) do
    feature_login_user user
  end

  it "logs out the current user and redirects to the root page" do
    click_button "Logout"

    expect(page).not_to have_content "Logged in as: #{user.email_address}"

    expect(page).to have_content "Email"
    expect(page).to have_content "Password"
  end
end
