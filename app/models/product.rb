class Product < ApplicationRecord
    validates_presence_of(
        :stripe_product_id,
        :stripe_price_unit_amount,
        :stripe_description,
        :stripe_images,
        :stripe_name,
        :stripe_default_price_id
    )
end
