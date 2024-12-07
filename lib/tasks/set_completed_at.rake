require "rake/task"

task :set_completed_at do
    Rake::Task["environment"].invoke

    # find any completed orders
    # set completed_at equal to updated_at
    Order.completed.in_batches of: 10 do |batch|
        batch.each do |order|
            order.update(completed_at: order.updated_at)
        end
    end
end
