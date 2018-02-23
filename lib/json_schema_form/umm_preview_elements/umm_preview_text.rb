# :nodoc:
class UmmPreviewText
  include ActionView::Context
  include ActionView::Helpers::FormTagHelper
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::TextHelper
  include Rails.application.routes.url_helpers

  attr_accessor :data

  def initialize(data)
    @data = data
  end

  def render
    content_tag(:p, data)
  end
end
