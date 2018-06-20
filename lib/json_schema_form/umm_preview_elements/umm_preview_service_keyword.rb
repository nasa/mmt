# Provides the correct keyword levels to render a service keyword string

# :nodoc:
class UmmPreviewServiceKeyword < UmmPreviewKeyword
  KEYWORD_LEVELS = %w(
    ServiceCategory
    ServiceTopic
    ServiceTerm
    ServiceSpecificTerm
  ).freeze

  def initialize(data)
    super(data)
  end
end
