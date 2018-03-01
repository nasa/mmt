# render basic data in a <p> tag

# :nodoc:
class UmmPreviewText < UmmPreviewElement
  def render
    content_tag(:p, data)
  end
end
