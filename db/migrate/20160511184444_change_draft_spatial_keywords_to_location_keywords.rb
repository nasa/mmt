class ChangeDraftSpatialKeywordsToLocationKeywords < ActiveRecord::Migration[4.2]
  def up
    Draft.find_each do |d|
      draft = d.draft
      if draft && draft['SpatialKeywords']
        spatial_keywords = draft.delete('SpatialKeywords')
        location_keywords = d.send :convert_location_keywords, spatial_keywords
        draft['LocationKeywords'] = location_keywords
        d.draft = draft
        d.save
      end
    end
  end

  def down
    Draft.find_each do |d|
      draft = d.draft
      if draft && draft['LocationKeywords']
        location_keywords = draft.delete('LocationKeywords')
        spatial_keywords = []
        location_keywords.each do |location_keyword|
          spatial_keywords << location_keyword.map { |_key, value| value }.join(' > ')
        end
        draft['SpatialKeywords'] = spatial_keywords
        d.draft = draft
        d.save
      end
    end
  end
end
