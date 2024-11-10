class Types::OrderPageInputType < Types::BaseInputObject
    argument :price, String, required: true
    argument :quantity, Integer, required: false
end
