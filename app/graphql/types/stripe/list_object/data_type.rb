# frozen_string_literal: true

class Types:: Stripe::ListObject::DataType < Types::BaseUnion
  description "Types that may be returned by the Stripe::ListObject, e.g. Stripe::Product.list"

  possible_types Types::Stripe::ProductType, Types::Stripe::LineItemType

  def self.resolve_type(object, context)
    case object
    when Stripe::Product
      Types::Stripe::ProductType
    when Stripe::LineItem
      Types::Stripe::LineItemType
    end
  end
end
