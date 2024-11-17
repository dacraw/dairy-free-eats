require 'rails_helper'

RSpec.feature "PasswordResets", type: :feature do
  let(:user) { create :user, :valid_user }
  let(:passwords_mailer_double) { double PasswordsMailer }

  it "sends an email" do
    visit password_reset_path

    expect(page).to have_content "Reset Password"

    expect(PasswordsMailer).to receive(:reset).with(user) { passwords_mailer_double }
    expect(passwords_mailer_double).to receive(:deliver_later) { true }

    fill_in "Email", with: user.email_address
    click_button "Email Reset Instructions"
    expect(page).to have_content "Password reset instructions sent"
  end

  it "allows the user to set a new password" do
    visit edit_password_path(token: user.password_reset_token)

    expect(page).to have_content "Create New Password"

    new_password = Faker::Internet.password min_length: 8

    expect {
      fill_in "password", with: new_password
      fill_in "passwordConfirmation", with: new_password
      click_button "Update Password"

      expect(page).to have_content "Email"
      expect(page).to have_content "Password"
    }.to change { user.reload.password_digest }

    expect(user.reload.authenticate(new_password)).to eq user
  end

  it "shows validation error when passwords do not match" do
    visit edit_password_path(token: user.password_reset_token)

    expect(page).to have_content "Create New Password"

    current_password = user.password

    expect {
      fill_in "password", with: "super_s3cr3t_password"
      fill_in "passwordConfirmation", with: "this_will_not_match"
      click_button "Update Password"

      expect(page).to have_content "Passwords did not match."
    }.not_to change { user.reload.password_digest }

    expect(user.reload.authenticate(current_password)).to eq user
  end
end
