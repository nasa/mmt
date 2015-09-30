module Helpers
  module DateHelpers
    def today_string
      Time.now.utc.strftime("%Y-%m-%d")
    end
  end
end
