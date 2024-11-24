require "rails_helper"

RSpec.describe "Current User Notifications query spec", type: :request do
    let(:user) { create :user, :valid_user, :with_notifications }
    let(:query) {
        <<-GRAPHQL
            query FetchCurrentUserNotifications($after: String, $first: Int) {
                currentUserNotifications(after: $after, first: $first) {
                    edges {
                        node {
                        id
                        message
                        path
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }#{'            '}
        GRAPHQL
    }

    def perform_query(json_params)
        post graphql_path, headers: { "Content-Type": "application/json" }, params: json_params

        JSON.parse(response.body)['data']
    end

    it "fetches the current user's notifications" do
        login_user user

        params = {
            query: query,
            variables: {
                first: 5
            }
        }

        notification = user.notifications.first
        data = perform_query params.to_json
        node = data["currentUserNotifications"]["edges"].first["node"]

        expect(node["id"].to_i).to eq notification.id
        expect(node["message"]).to eq notification.message
        expect(node["path"]).to eq notification.path
    end
end
