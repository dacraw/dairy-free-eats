# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2024_12_11_213644) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "notifications", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "message", null: false
    t.string "path"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "order_messages", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.bigint "user_id", null: false
    t.text "body"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_order_messages_on_order_id"
    t.index ["user_id"], name: "index_order_messages_on_user_id"
  end

  create_table "orders", force: :cascade do |t|
    t.bigint "user_id"
    t.integer "status", null: false
    t.string "stripe_payment_intent_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.json "stripe_checkout_session_line_items"
    t.text "guest_email"
    t.datetime "completed_at"
    t.integer "amount_total"
    t.index ["user_id"], name: "index_orders_on_user_id"
  end

  create_table "products", force: :cascade do |t|
    t.string "stripe_product_id", null: false
    t.integer "stripe_price_unit_amount", null: false
    t.string "stripe_description", null: false
    t.string "stripe_images", default: [], array: true
    t.string "stripe_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "stripe_default_price_id", null: false
    t.index ["stripe_default_price_id"], name: "index_products_on_stripe_default_price_id", unique: true
    t.index ["stripe_name"], name: "index_products_on_stripe_name", unique: true
    t.index ["stripe_product_id"], name: "index_products_on_stripe_product_id", unique: true
  end

  create_table "sessions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "ip_address"
    t.string "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email_address", null: false
    t.string "stripe_customer_id"
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "admin", default: false
    t.index ["email_address"], name: "index_users_on_email_address", unique: true
  end

  add_foreign_key "notifications", "users"
  add_foreign_key "order_messages", "orders"
  add_foreign_key "order_messages", "users"
  add_foreign_key "orders", "users"
  add_foreign_key "sessions", "users"
end
