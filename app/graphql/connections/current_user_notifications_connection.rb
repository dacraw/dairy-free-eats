module Connections
    class CurrentUserNotificationsConnection < GraphQL::Pagination::Connection
        def nodes
            results.slice(0, page_size)
        end

        def cursor_for(item)
            Base64.encode64(item.id.to_s).chomp
        end

        def has_next_page
            results.size > page_size
        end

        def page_size
            @first_value || max_page_size
        end

        def results
            @_results ||= begin
                @items = @items.where("id < ?", Base64.decode64(@after_value)) if @after_value.present?

                @items.limit(page_size + 1)
            end
        end
    end
end
