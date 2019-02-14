module Cmr
  class UvgClient < BaseClient
    def uvg_generate(params)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:4000/generate'
            else
              '/generate'
            end

      post(url, params.to_json)
    end
  end
end
