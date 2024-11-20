require "rails_helper"

RSpec.describe ApplicationCable::Connection, type: :channel do
    let(:session) { create :session, :with_a_user }

    it "connects with verified user" do
        cookies.signed[:session_id] = session.id

        connect "/cable"

        expect(connection.current_user).to eq session.user
    end
end
