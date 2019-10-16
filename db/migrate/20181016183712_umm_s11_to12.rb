class UmmS11To12 < ActiveRecord::Migration[4.2]
  def up
    Draft.where(draft_type: 'ServiceDraft').find_each do |d|
      draft = d.draft

      # drop top level fields
      draft.delete 'OnlineAccessURLPatternMatch'
      draft.delete 'OnlineAccessURLPatternSubstitution'
      draft.delete 'Coverage'

      # remove Uuid and NonServiceOrganizationAffiliation from ContactGroups and ContactPersons
      if draft.key? 'ContactGroups' # array
        Array.wrap(draft['ContactGroups']).each do |group|
          remove_uuid_and_affiliation(group)
        end
      end

      if draft.key? 'ContactPersons' # array
        Array.wrap(draft['ContactPersons']).each do |person|
          remove_uuid_and_affiliation(person)
        end
      end

      if draft.key? 'ServiceOrganizations'
        service_organizations = Array.wrap(draft['ServiceOrganizations'])

        service_organizations.each do |service_org|
          if service_org.key? 'ContactGroups' # array
            Array.wrap(service_org['ContactGroups']).each do |group|
              remove_uuid_and_affiliation(group)
            end
          end

          if service_org.key? 'ContactPersons' # array
            Array.wrap(service_org['ContactPersons']).each do |person|
              remove_uuid_and_affiliation(person)
            end
          end
        end
      end

      # dupe supported projections and supported formats into input and output projections and formats
      if draft.key? 'ServiceOptions'
        service_options = draft['ServiceOptions']

        if service_options.key? 'SupportedProjections'
          supported_projections = service_options.delete('SupportedProjections')

          # SupportedProjectionType has been changed into an array of objects
          new_supported_projections = []
          Array.wrap(supported_projections).each do |projection|
            new_supported_projections << { 'ProjectionName' => projection }
          end

          service_options['SupportedInputProjections'] = new_supported_projections
          service_options['SupportedOutputProjections'] = new_supported_projections
        end

        if service_options.key? 'SupportedFormats'
          supported_formats = service_options.delete('SupportedFormats')
          # SupportedFormatTypeEnum has changed
          updated_supported_formats = Array.wrap(supported_formats).map do |format_val|
            new_val = change_supported_format_value(format_val)
            new_val.nil? ? format_val : new_val
          end

          service_options['SupportedInputFormats'] = updated_supported_formats
          service_options['SupportedOutputFormats'] = updated_supported_formats
        end
      end


      d.draft = draft
      d.save
    end
  end

  def remove_uuid_and_affiliation(contact)
    contact.delete('Uuid')
    contact.delete('NonServiceOrganizationAffiliation')
  end

  def change_supported_format_value(value)
    case value
    when 'HDF-EOS4'
      'HDF-EOS2'
    when 'netCDF-3'
      'NETCDF-3'
    when 'netCDF-4'
      'NETCDF-4'
    when 'GeoTIFF'
      'GEOTIFF'
    when 'image/png'
      'PNG'
    when 'image/tiff'
      'TIFF'
    when 'image/gif'
      'GIF'
    when 'image/png; mode=24bit'
      'PNG24'
    when 'image/jpeg'
      'JPEG'
    when 'image/vnd.wap.wbmp'
      'BMP'
    else
      nil
    end
  end
end
