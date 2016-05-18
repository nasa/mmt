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

    # using wait for ajax/jquery pattern from https://robots.thoughtbot.com/automatically-wait-for-ajax-with-capybara
    def wait_for_jquery
      Timeout.timeout(Capybara.default_max_wait_time) do
        loop until finished_all_jquery_requests?
      end
    end

    def finished_all_jquery_requests?
      page.evaluate_script('jQuery.active').zero?
    end
  end
end
