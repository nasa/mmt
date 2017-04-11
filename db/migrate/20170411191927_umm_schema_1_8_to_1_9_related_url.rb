class UmmSchema18To19RelatedUrl < ActiveRecord::Migration
  def up
    Draft.find_each do |d|
      draft = d.draft

      # Change Related URLs
      if draft && draft.key?('RelatedUrls')
        # draft['Platforms'].each do |platform|
        #   next unless platform.key?('Instruments')
        #
        #   platform['Instruments'].each do |instrument|
        #     next unless instrument.key?('Sensors')
        #
        #     instrument['ComposedOf'] = instrument.delete('Sensors')
        #   end
        # end
      end

      d.draft = draft
      d.save
    end
  end
end
