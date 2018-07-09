# UmmSetMultiItem is used for an array of simple values, but with
# a set number of items.
# number_of_items = 3:
# ["value1", "value2", "value3"]

# :nodoc:
class UmmSetMultiItem < UmmMultiItem
  def number_of_items
    parsed_json['numberItems']
  end

  def default_value
    Array.new(number_of_items)
  end

  def render_markup
    content_tag(:div, class: "multiple simple-multiple #{form_class}") do
      indexes = options.fetch('indexes', [])

      values = Array.wrap(element_value)
      values = [] if values.empty?
      values += Array.new(number_of_items)
      values[0..2].each_with_index do |value, index|
        concat(content_tag(:div, class: "multiple-item multiple-item-#{index}") do
          form_fragment['items'].each do |property|
            concat UmmForm.new(form_section_json: property, json_form: json_form, schema: schema, options: { 'indexes' => indexes + [index] }, key: full_key, field_value: value).render_markup
          end
        end)
      end
    end
  end
end
