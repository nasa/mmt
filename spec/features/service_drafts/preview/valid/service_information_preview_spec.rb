describe 'Valid Service Draft Service Information Preview' do
  let(:service_draft) { create(:full_service_draft, draft_entry_title: 'Volume mixing ratio of sum of peroxynitrates in air', draft_short_name: 'PNs_LIF', user: User.where(urs_uid: 'testuser').first) }
  let(:draft)         { service_draft.draft }

  before do
    login
  end

  context 'When examining the Service Information section' do
    let(:anchors) { %w[name-label long-name-label type-label version-label description-label] }

    before do
      visit service_draft_path(service_draft)
    end

    it 'displays the form title as an edit link' do
      within '#service_information-progress' do
        expect(page).to have_link('Service Information', href: edit_service_draft_path(service_draft, 'service_information'))
      end
    end

    it 'displays the correct status icon' do
      within '#service_information-progress' do
        within '.status' do
          expect(page).to have_content('Service Information is valid')
        end
      end
    end

    it 'displays the correct progress indicators for required fields' do
      within '#service_information-progress .progress-indicators' do
        anchors.each do |anchor|
          expect(page).to have_css(".eui-icon.eui-required.icon-green.#{anchor}")
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: anchor))
        end
      end
    end

    include_examples 'Service Information Full Preview' do
      let(:draft) { service_draft.draft }
    end

    it 'displays links to edit/update the data' do
      within '.umm-preview.service_information' do
        expect(page).to have_css('.umm-preview-field-container', count: 10)

        within '#service_draft_draft_name_preview' do
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_name'))
        end

        within '#service_draft_draft_long_name_preview' do
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_long_name'))
        end

        within '#service_draft_draft_type_preview' do
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_type'))
        end

        within '#service_draft_draft_version_preview' do
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_version'))
        end

        within '#service_draft_draft_version_description_preview' do
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_version_description'))
        end

        within '#service_draft_draft_last_updated_date_preview' do
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_last_updated_date'))
        end

        within '#service_draft_draft_description_preview' do
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_description'))
        end

        within '#service_draft_draft_url_preview' do
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_url'))
        end
      end
    end
  end

  context 'when examining the Service Information section with a url with no protocol' do
    before do
      service_draft.draft['URL']['URLValue'] = 'Not Provided'
      service_draft.save
      visit service_draft_path(service_draft)
    end

    it 'does not make a link for the invalid url' do
      within '#service_draft_draft_url_preview' do
        expect(page).to have_content('Not Provided')
        expect(page).to have_no_link('Not Provided')
      end
    end
  end
end
