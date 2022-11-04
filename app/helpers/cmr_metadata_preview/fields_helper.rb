module CmrMetadataPreview
  module FieldsHelper
    def order_subfields!(field_order, keywords)
      keywords.each_with_index do |keyword, index|
        new_keyword = {}
        field_order.each do |field|
          new_keyword[field] = keyword[field] unless keyword[field].nil?
        end
        keywords[index] = new_keyword
      end
    end
  end
end
