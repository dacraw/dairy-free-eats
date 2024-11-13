# Preview all emails at http://localhost:3000/rails/mailers/order_mailer
class OrderMailerPreview < ActionMailer::Preview
    def order_received
        OrderMailer.with(order: Order.last).order_received
    end
end
