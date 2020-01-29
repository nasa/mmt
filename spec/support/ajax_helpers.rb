module Helpers
  module AjaxHelpers
    # TODO: need to figure out if there is another way of doing wait_for_ajax,
    # it fails after switching to Selenium/Headless Chrome
    # currently just changed all wait_for_ajax calls to use wait_for_jQuery
    # def wait_for_ajax
    #   still_working = true
    #   while still_working
    #     if still_working = page.driver.network_traffic.collect(&:response_parts).any?(&:empty?)
    #       sleep 0.1
    #     end
    #   end
    # end
    # EDSC does:
    # def wait_for_xhr
    # ActiveSupport::Notifications.instrument "edsc.performance.wait_for_xhr" do
    #     synchronize(60) do
    #       expect(page.execute_script('try { return window.edsc.util.xhr.hasPending(); } catch { return false; }')).to be_false
    #     end
    #   end
    # end

    def wait_for_jQuery(secs = Capybara.default_max_wait_time)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::AjaxHelpers#wait_for_jQuery' do
        Timeout.timeout(secs) do
          loop until finished_all_jQuery_requests?
        end
      end
    end

    def finished_all_jQuery_requests?
      # puts "checking jQuery requests. no active calls? #{page.evaluate_script('jQuery.active').zero?}"
      page.execute_script('return !!window.jQuery && jQuery.active === 0')
    end
  end
end
