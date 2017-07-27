# Set of utility methods for UMM
class UmmUtilities
  class << self
    def convert_to_integer(string)
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
