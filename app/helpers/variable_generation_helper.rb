module VariableGenerationHelper
  def self.define_stats_method(name)
    define_method("#{name}_stats") do |statistics|

      "#{statistics.fetch(name, 0)}% of #{statistics.fetch('count', 0)}"
    end
  end

  define_stats_method 'long_names'
  define_stats_method 'definitions'
  define_stats_method 'science_keywords'

  def display_single_page_info
    if @variables.count > 0 && @variables.count <= 25
      "Showing <b>all #{@variables.count}</b> Generated Variables".html_safe
    end
  end

  def display_variables_title(operation, collection_id)
    operators = operation.split('_')
    operation_type = operators.shift

    title = if operation_type == 'augment'
              "Variables Augmented with #{operators.join(' ').titleize} for collection #{collection_id}"
            else
              "Naive Variables Generated for collection #{collection_id}"
            end
  end
end
