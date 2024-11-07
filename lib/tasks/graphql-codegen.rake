require "graphql/rake_task"

GraphQL::RakeTask.new(
    schema_name: "DairyFreeFoodSchema",
    directory: "./app/javascript/graphql",
    dependencies: [:environment]
)