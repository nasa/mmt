module Helpers
  module DateHelpers
    def today_string
      Time.now.utc.to_s(:date)
    end
  end
end
