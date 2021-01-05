class UmmC154To155 < ActiveRecord::Migration[5.2]
  def schema_enum
    ["ascii", "binary", "GRIB", "BUFR", "HDF4", "HDF5", "HDF-EOS4", "HDF-EOS5", "jpeg", "png", "tiff", "geotiff", "kml", "Not provided"]
  end

  def kms_enum
    ["UF", "JPEG2000", "BNA", "TIFF", "MOV", "ICI", "WKT", "ASCII Grid", "XML", "ODB", "VPF", "netCDF-4 classic", "PNG", "JSON-LD", "NBJ", "ASCII Raster", "LAZ", "SQLite", "TimeseriesML", "BMP", "Zarr", "IFC", "MDB", "DTA", "SIARD", "GMT", "ASCII", "HDF-EOS5", "SLPK", "SeaBASS", "CCSDS", "HTML", "IONEX", "AREA", "SYLK", "WaterML", "CEOS", "KML", "BIL", "miniSEED", "ODS", "ISI", "GRIDFloat", "BIP", "GTE", "FITS", "AVI", "RB5", "HDF5", "netCDF-3", "Excel", "ENVI", "GIF", "WKI", "COG","Word","Not Provided", "AMES", "BSQ", "Little-Endian", "Binary", "JSON", "EPS", "Geodatabase", "RData", "Parquet", "DBF", "SAS", "SAFE", "KMZ", "NIDS", "SEG-Y", "ICARTT", "DXF", "MAT", "YAML", "SDTS", "BigTIFF", "MP4", "CSV", "MSR", "SIGMET IRIS", "ArcInfo Interchange", "SPC", "HDF4", "CRD", "IWRF", "ADF", "JPEG", "DLG", "BUFR", "XTDR", "Grid", "netCDF-2", "Shapefile", "Text File", "GeoJSON", "ArcInfo Coverage", "RINEX", "ACCDB", "HDF-EOS4", "HGT", "AGF", "Open XML Spreadsheet", "SPSS", "PowerPoint", "GRIB2", "McIDAS", "HDF-EOS2", "GeoPackage", "netCDF-4", "LAS", "GeoTIFF", "GRIB1", "PDF", "PSD"]
  end

  def adjust_enum(enum)
    collection_drafts = CollectionDraft.where.not(draft: {})
    proposals = CollectionDraftProposal.where.not(draft: {})
    templates = CollectionTemplate.where.not(draft: {})
    records = collection_drafts + proposals + templates

    records.each do |record|
      draft = record.draft
      if draft['RelatedUrls'].present?
        draft['RelatedUrls'].each do |related_url|
          # move to the next related_url if there exists a GetData Format and that format is explicitly equivalent to a value in the old enum
          format = related_url.dig('GetData', 'Format')
          next unless format && !enum.include?(format)
          # delete the entire GetData key so as not to trigger conditionally required fields errors by only deleting the Format
          if enum.none? { |val| val.casecmp?(format) }
            related_url.delete('GetData')
            next
          end
          # At this point, the only situation that could occur is a typecase discrepancy
          enum.each { |val| related_url['GetData']['Format'] = val if val.casecmp?(format) }
        end
      end
      record.save
    end
  end

  def up
    adjust_enum(kms_enum)
  end

  def down
    adjust_enum(schema_enum)
  end
end
