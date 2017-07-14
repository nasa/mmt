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
  end
end
