module Helpers
  module AjaxHelpers
    # TODO: need to figure out if there is another way of doing this
    # currently just changed all wait_for_ajax calls to use wait_for_jQuery

    # def wait_for_ajax
    #   still_working = true
    #   while still_working
    #     if still_working = page.driver.network_traffic.collect(&:response_parts).any?(&:empty?)
    #       sleep 0.1
    #     end
    #   end
    # end

    def wait_for_jQuery(secs = Capybara.default_max_wait_time)
      Timeout.timeout(secs) do
        loop until finished_all_jQuery_requests?
      end
    end

    def finished_all_jQuery_requests?
      page.evaluate_script('jQuery.active').zero?
    end
  end
end
