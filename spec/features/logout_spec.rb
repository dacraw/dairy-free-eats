require 'rails_helper'

RSpec.feature "Logout", type: :feature do
  let!(:user) { create :user, :valid_user }
  
  before(:each) do
    visit login_path

    expect(page).to have_content "Email"
    expect(page).to have_content "Password"

    fill_in "Email", with: user.email
    fill_in "Password", with: user.password
    find("input[type='submit']").click

    expect(page).to have_content "Order lactose-free food that is tasty and affordable."
    expect(page).to have_content "Logged in as: #{user.email}"
    expect(page).to have_button "Logout"
  end

  it "logs out the current user and redirects to the root page" do
    click_button "Logout" 

    expect(page).not_to have_content "Logged in as: #{user.email}"
  end
end
