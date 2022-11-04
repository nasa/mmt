require "erb"
include ERB::Util

module CmrMetadataPreview
  module CmrMetadataPreviewHelper

    # This function will perform a recursive traversal of a Hash object and html_escape each value along the way.
    def sanitize_metadata(metadata)
      deep_transform_values_in_object!(metadata) { |v| v.kind_of?(String) ? html_escape(v) : v}
    end

    def display_entry_title(collection)
      collection['EntryTitle'] || 'Entry Title Not Provided'
    end

    def display_short_name(collection)
      collection['ShortName'] || '<Blank Short Name>'
    end

    def display_entry_id(metadata, type)
      # short_name and version
      short_name = if type.include? 'collection'
                     display_short_name(metadata)
                   elsif type.include? 'variable'
                     metadata['Name'] || '<Blank Name>'
                   end

      version = metadata.fetch('Version', '')
      version = "_#{version}" unless version.empty?

      short_name + version
    end

    # Change json keys like 'FileSize' to acceptable html class names like 'file-size'
    def name_to_class(key)
      if key == 'URLs'
        'urls'
      else
        key.to_s.underscore.dasherize
      end
    end

    def name_to_title(name)
      is_id = name.end_with?('Id') && name.size > 2 ? ' Id' : ''

      if name == 'URLs'
        'URLs'
      elsif name == 'RelatedUrls'
        'Related URLs'
      elsif name == 'RelatedURLs'
        'Related URLs'
      elsif name == 'DOI'
        'DOI'
      elsif name == 'AssociatedDOIs'
        'Associated DOIs'
      else
        name.underscore.titleize + is_id
      end
    end

    # Used to derive the displayed string of a select type control from the value stored in json
    def map_value_onto_display_string(str, options)
      options_hash = Hash[options.map { |key, value| [value, key] }]
      options_hash[str]
    end

    def format_url(url)
      unless url.match(/^(http|https|ftp)\:\/\//)
        url = 'http://' + url
      end
      url
    end

    def blank_url?(url)
      url =~ /^not(\s+|\%20)provided/i ? true : false
    end

    def map_itemprop_date(type)
      itemprop = nil
      if type == 'CREATE'
        itemprop = 'dateCreated'
      elsif type == 'UPDATE'
        itemprop = 'dateModified'
      end
      itemprop
    end

    def display_list_item_with_link(label: '', url: '', description: '', schema_org_parameters: {}, url_options: {}, li_options: {})
      concat(content_tag(:li, nil, li_options) do
        concat(content_tag(:span, "#{label}: ", class: 'list-item-label'))

        url_options[:href] = url
        concat(content_tag(:a, url_options) do
          concat(url)
          unless schema_org_parameters.blank?
            schema_org_parameters.collect do |param|
              content = param[:content]
              concat(content_tag(:meta, nil, param)) if !content.blank? && content != 'Not provided'
            end
          end
        end)

        concat(content_tag(:span, ", #{description}", class: 'url-list-item-description')) unless description.blank?
      end)
    end

    # Returns true for a collection if it is a 'NASA collection' where that is
    # presently interpreted to mean that it is in the NASA bucket in KMS
    def nasa?(collection)
      data_centers = collection['DataCenters']
      return false unless data_centers
      data_centers.each do |data_center|
        # NSIDC catches the fact that NSIDC appears to have created separate DAAC
        # entries based on projects, but they are not in the NASA bucket in KMS.
        # MSFC, ASF, LP_DAAC, and SEDAC appear to have one entry each outside the NASA/* paths
        # ORNL has a series of entries preceded by DOE/, which are not currently
        # considered NASA collections

        # At the time of writing this regex, the team decided that we should understand how
        # often this has to be changed to accomplish its mission.  If we are changing it too
        # often, we should rethink how we are trying to solve this problem.
        # Updated: 08-09-2019: /^(NASA.*|ASF|LP DAAC|SEDAC|MSFC|ORNL_DAAC)$/ captures all entries in the KMS NASA bucket.
        return true if data_center['ShortName'].present? && data_center['ShortName'].match?(/^(NASA.*|ASF|LP DAAC|SEDAC|MSFC|ORNL_DAAC)$/)
      end
      return false
    end

    private

    # These methods are copied from rails 6, once we move to rails 6 they can be called directly on the Hash object.
    def transform_values!(object)
      return enum_for(:transform_values!) { size } unless block_given?
      object.each do |key, value|
        object[key] = yield(value)
      end
    end unless method_defined? :transform_values!

    def deep_transform_values_in_object!(object, &block)
      case object
      when Hash
        transform_values!(object) { |value| deep_transform_values_in_object!(value, &block) }
      when Array
        object.map! { |e| deep_transform_values_in_object!(e, &block) }
      else
        yield(object)
      end
    end

  end
end
