module Helpers
  module AjaxHelpers

    def wait_for_ajax
      still_working = true
      while still_working
        if still_working = page.driver.network_traffic.collect(&:response_parts).any?(&:empty?)
          sleep 0.1
        end
      end
    end

  end
end
