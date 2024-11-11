module Stripe::EventHelper
    def self.construct_event_request(event_object_data, event_type)
        {
            id: "evt_123456",
            object: "event",
            api_version: "2024-10-28.acacia",
            created: Time.now.to_i,
            data: { object: event_object_data },
            livemode: false,
            pending_webhooks: 3,
            request: {
            id: "req_12345",
            idempotency_key: "12345-54321-12345-54321"
            },
            type: event_type
        }
    end
end
