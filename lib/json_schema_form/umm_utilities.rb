module JsonSchemaForm
  # Set of utility methods for UMM
  class UmmUtilities
    class << self
      def convert_to_integer(string)
        return string if string.is_a?(Integer)
        unless string.empty?
          stripped_string = string.delete(',')

          begin
            integer = Integer(stripped_string)
          rescue
            integer = string
          end

          integer
        end
      end

      def convert_to_number(string)
        return string if string.is_a?(Float)
        unless string.empty?
          stripped_string = string.delete(',')

          begin
            number = Float(stripped_string)
          rescue
            number = string
          end

          number
        end
      end
    end
  end
end
