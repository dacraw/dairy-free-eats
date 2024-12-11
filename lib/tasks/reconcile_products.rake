require "rake/task"

task :reconcile_products do
    Rake::Task["environment"].invoke

    active_stripe_products = Stripe::Product.list active: true, expand: [ "data.default_price" ]

    active_stripe_products.each do |stripe_product|
        stripe_product_id = stripe_product.id

        existing_local_product = Product.find_by_stripe_product_id stripe_product.id

        if existing_local_product.present?
            existing_local_product.update(
                stripe_default_price_id: stripe_product.default_price.id,
                stripe_price_unit_amount: stripe_product.default_price.unit_amount,
                stripe_description: stripe_product.description,
                stripe_images: stripe_product.images,
                stripe_name: stripe_product.name,
            )
        else
            Product.create(
                stripe_product_id: stripe_product.id,
                stripe_default_price_id: stripe_product.default_price.id,
                stripe_price_unit_amount: stripe_product.default_price.unit_amount,
                stripe_description: stripe_product.description,
                stripe_images: stripe_product.images,
                stripe_name: stripe_product.name,
            )
        end
    end
end
