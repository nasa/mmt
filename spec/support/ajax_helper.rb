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

    def wait_for_jQuery
      Timeout.timeout(25) do #Capybara.default_max_wait_time
        loop until finished_all_jQuery_requests?
      end
   end

   def finished_all_jQuery_requests?
      page.evaluate_script('jQuery.active').zero?
   end
  end
end
