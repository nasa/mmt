# :nodoc:
class UmmPreviewKeyword
  include ActionView::Context
  include ActionView::Helpers::FormTagHelper
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::TextHelper

  KEYWORD_LEVELS = [].freeze

  attr_accessor :data

  def initialize(data)
    @data = data
  end

  def render
    capture do
      data.each do |keyword|
        concat(content_tag(:ul, class: 'arrow-tag-group-list') do
          self.class::KEYWORD_LEVELS.each do |level|
            unless keyword[level].blank?
              concat content_tag(:li, keyword[level], itemprop: 'keyword', class: 'arrow-tag-group-item')
            end
          end
        end)
      end
    end
  end
end
