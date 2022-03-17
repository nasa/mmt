shared_examples_for 'Variable Science Keywords Full Preview' do
  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.science_keywords' do
      expect(page).to have_css('.umm-preview-field-container', count: 1)
      
      within '#variable_draft_draft_science_keywords_preview, #variable_science_keywords_preview' do
        keyword_parts = page.all('ul.arrow-tag-group-list').first.all('li.arrow-tag-group-item')
        expect(keyword_parts[0]).to have_content('EARTH SCIENCE')
        expect(keyword_parts[1]).to have_content('SOLID EARTH')
        expect(keyword_parts[2]).to have_content('ROCKS/MINERALS/CRYSTALS')

        keyword_parts = page.all('ul.arrow-tag-group-list').last.all('li.arrow-tag-group-item')
        expect(keyword_parts[0]).to have_content('EARTH SCIENCE')
        expect(keyword_parts[1]).to have_content('ATMOSPHERE')
        expect(keyword_parts[2]).to have_content('ATMOSPHERIC TEMPERATURE')
      end
    end
  end
end
