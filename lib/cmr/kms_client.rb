require 'csv'
module Cmr
  class KmsClient < BaseClient
    def get_kms_keywords(keyword_scheme)
      url = "/kms/concepts/concept_scheme/#{keyword_scheme}/?format=csv"
      response = Rails.cache.fetch("#{keyword_scheme}", expires_in: 60.seconds) do
        get(url)
      end
      parsed_csv = CSV.parse(response.body, encoding: 'utf-8')
      result = process(parsed_csv, keyword_scheme)
      result
    end

    def process(parsed_csv, keyword_scheme)
      parsed_csv.shift # removes first line
      if (keyword_scheme == 'providers')
        parsed_csv.map! do |element|
          element = element[4, 7]
        end
      end
      result = {}
      headers = parsed_csv.shift
      result['headers'] = headers
      result['keywords'] = parsed_csv
      result
    end
  end
end