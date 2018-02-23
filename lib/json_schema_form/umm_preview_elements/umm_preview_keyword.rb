# :nodoc:
class UmmPreviewKeyword < UmmPreviewText
  KEYWORD_LEVELS = [].freeze

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
