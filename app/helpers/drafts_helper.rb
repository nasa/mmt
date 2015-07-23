module DraftsHelper

  # iff data is present, display the data label and value on one line. Support using a leading "*" to bypass titleization for labels like "ISBN"
  def display_field(label, value)
    if value.blank?
      return ''
    else
      if label[0] == '*' # Do not titleize
        new_label= label[1..-1]
      else
        new_label = label.titleize
      end
      return "#{new_label}#{new_label.blank? ? '': ': '}#{value}</br>"
    end
  end


  # iff data is present, create and display a simple paragraph w/ header and data. Optional title parameter can be used in situations where auto-titleization is undesirable.
  def display_field_section_with_header(key_name, title = nil)
    if @draft_json[key_name].blank? # Display no output if field not populated
      return ''
    else
      title = key_name.titleize if title.nil?
      field = display_field('', @draft_json[key_name])
      return "<h4>#{title}</h4><p>#{field}</p>"
    end
  end

end
