# :nodoc:
class DraftsController < ManageMetadataController
  include ManageMetadataHelper
  
  RESULTS_PER_PAGE = 25

  def parse_schema(filename)
    # Load the requested schema file from the schema directory
    schema_file = JSON.parse(File.read(File.join(Rails.root, 'lib', 'assets', 'schemas', filename)))

    # Fetch all references in the schema
    fetch_references(schema_file, schema_file)
  end

  def fetch_references(schema_file, property)
    # Loop through each key in the current hash element
    property.each do |_key, element|
      # Skip this element if it's not a hash, no $ref will exist
      next unless element.is_a?(Hash)

      # If we have a reference to follow
      if element.key?('$ref')
        file, path = element['$ref'].split('#')

        # Fetch the reference from the file that it's defined to be in
        referenced_property = if file.blank?
                                # This is an internal reference (lives within the file we're parsing)
                                schema_file['definitions'][path.split('/').last]
                              else
                                # Fetch the reference from an external file
                                referenced_schema = parse_schema(file)
                                referenced_schema['definitions'][path.split('/').last]
                              end

        # Merge the retrieved reference into the schema
        element.merge!(referenced_property)

        # Remove the $ref key so we don't attempt to parse it again
        element.delete('$ref')
      end

      # Keep diggin'
      fetch_references(schema_file, element)
    end

    schema_file
  end

end
