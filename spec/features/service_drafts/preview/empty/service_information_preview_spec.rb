describe 'Empty Service Draft Service Information Preview' do
  let(:service_draft) { create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examining the Service Information section' do
    it 'displays the form title as an edit link' do
      within '#service_information-progress' do
        expect(page).to have_link('Service Information', href: edit_service_draft_path(service_draft, 'service_information'))
      end
    end
  end

  it 'displays the corrent status icon' do
    within '#service_information-progress' do
      within '.status' do
        expect(page).to have_content('Service Information is incomplete')
      end
    end
  end

  it 'displays the correct progress indicators for required fields' do
    within '#service_information-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-required-o.icon-green.name')
      expect(page).to have_css('.eui-icon.eui-required-o.icon-green.long-name')
      expect(page).to have_css('.eui-icon.eui-required-o.icon-green.type')
      expect(page).to have_css('.eui-icon.eui-required-o.icon-green.version')
      expect(page).to have_css('.eui-icon.eui-required-o.icon-green.description')
    end
  end

  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_information' do
      expect(page).to have_css('.umm-preview-field-container', count: 8)

      within '#service_draft_draft_name_preview' do
        expect(page).to have_css('h5', text: 'Name')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_name'))

        expect(page).to have_css('p', text: 'No value for Name provided.')
      end

      within '#service_draft_draft_long_name_preview' do
        expect(page).to have_css('h5', text: 'Long Name')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_long_name'))

        expect(page).to have_css('p', text: 'No value for Long Name provided.')
      end

      within '#service_draft_draft_type_preview' do
        expect(page).to have_css('h5', text: 'Type')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_type'))

        expect(page).to have_css('p', text: 'No value for Type provided.')
      end

      within '#service_draft_draft_version_preview' do
        expect(page).to have_css('h5', text: 'Version')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_version'))

        expect(page).to have_css('p', text: 'No value for Version provided.')
      end

      within '#service_draft_draft_description_preview' do
        expect(page).to have_css('h5', text: 'Description')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_description'))

        expect(page).to have_css('p', text: 'No value for Description provided.')
      end

      within '#service_draft_draft_version_description_preview' do
        expect(page).to have_css('h5', text: 'Version Description')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_version_description'))

        expect(page).to have_css('p', text: 'No value for Version Description provided.')
      end

      within '#service_draft_draft_last_updated_date_preview' do
        expect(page).to have_css('h5', text: 'Last Updated Date')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_last_updated_date'))

        expect(page).to have_css('p', text: 'No value for Last Updated Date provided.')
      end

      within '#service_draft_draft_url_preview' do
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_url'))

        expect(page).to have_css('p', text: 'No value for URL provided')
      end
    end
  end
end
