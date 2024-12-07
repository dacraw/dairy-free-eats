require "rake/task"


task :add_image_url_line_items do
    Rake::Task["environment"].invoke
    # image_url will be a part of an order stripe_checkout_session_line_items

    # first, find all orders
    orders = Order.all

    # then iterate through them all and recreate their line items

    orders.in_batches of: 10 do |batch|
        batch.each do |order|
            stripe_checkout_session = Stripe::Checkout::Session.list payment_intent: order.stripe_payment_intent_id
            checkout_line_items = Stripe::Checkout::Session.list_line_items stripe_checkout_session.first.id, expand: [ "data.price.product" ]

            stripe_checkout_session_line_items = checkout_line_items.map do |item|
                { name: item.description,
                quantity: item.quantity,
                image_url: item.price.product.images.first }
            end

            order.update(stripe_checkout_session_line_items: stripe_checkout_session_line_items)
        end
    end
end
