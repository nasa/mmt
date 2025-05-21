module Helpers
  module DateHelpers
    def today_string
      Time.now.utc.to_fs(:date)
    end
  end
end
