module Cmr
  class UvgClient < BaseClient
    # Stubbed Endpoints
    def uvg_generate_stub(params)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:4000/generate_stub'
            else
              '/generate_stub'
            end

      post(url, params.to_json)
    end

    def uvg_augment_definitions_stub(params)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:4000/augment/definitions_stub'
            else
              '/augment/definitions_stub'
            end

      post(url, params.to_json)
    end

    def uvg_augment_keywords_stub(params)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:4000/augment/keywords_stub'
            else
              '/augment/keywords_stub'
            end

      post(url, params.to_json)
    end

    def uvg_augment_estimates_stub(params)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:4000/augment/estimates_stub'
            else
              '/augment/estimates_stub'
            end

      post(url, params.to_json)
    end

    ########
    # Not stubbed endpoints
    ########

    def uvg_generate(params, token)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:4000/generate'
            else
              '/generate'
            end

      post(url, params.to_json, token_header(token))
    end

    def uvg_augment_definitions(params)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:4000/augment/definitions'
            else
              '/augment/definitions'
            end

      post(url, params.to_json)
    end

    def uvg_augment_keywords(params)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:4000/augment/keywords'
            else
              '/augment/keywords'
            end

      post(url, params.to_json)
    end

    # not yet available
    # def uvg_augment_estimates(params)
    #   url = if Rails.env.development? || Rails.env.test?
    #           'http://localhost:4000/augment/estimates'
    #         else
    #           '/augment/estimates'
    #         end
    #
    #   post(url, params.to_json)
    # end
  end
end
