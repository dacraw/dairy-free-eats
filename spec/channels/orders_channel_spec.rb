require 'rails_helper'

RSpec.describe OrdersChannel, type: :channel do
  let(:order) { create :order, :with_line_items, :with_a_user }

  it "connects" do
    subscribe id: order.id

    expect(subscription).to be_confirmed
  end

  it "rejects" do
    subscribe id: nil

    expect(subscription).to be_rejected
  end
end
