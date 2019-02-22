module VariableGenerationHelper
  # def long_name_stats(statistics)
  #   "#{(statistics.fetch('long_names', 0).to_f / statistics.fetch('count', 0).to_f) * 100}% (#{statistics.fetch('long_names', 0)} of #{statistics.fetch('count', 0)})"
  # end
  #
  # def definitions_stats(statistics)
  #   "#{(statistics.fetch('definitions', 0).to_f / statistics.fetch('count', 0).to_f) * 100}% (#{statistics.fetch('definitions', 0)} of #{statistics.fetch('count', 0)})"
  # end
  #
  # def science_keywords_stats(statistics)
  #   "#{(statistics.fetch('keywords', 0).to_f / statistics.fetch('count', 0).to_f) * 100}% (#{statistics.fetch('keywords', 0)} of #{statistics.fetch('count', 0)})"
  # end

  def self.define_stats_method(name)
    define_method("#{name}_stats") do |statistics|
      "#{((statistics.fetch(name, 0).to_f / statistics.fetch('count', 0).to_f) * 100).round}% (#{statistics.fetch(name, 0)} of #{statistics.fetch('count', 0)})"
    end
  end

  define_stats_method 'long_names'
  define_stats_method 'definitions'
  define_stats_method 'keywords'
end
