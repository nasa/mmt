describe 'Valid Service Draft Service Information Preview' do
  let(:service_draft) { create(:full_service_draft, draft_entry_title: 'Volume mixing ratio of sum of peroxynitrates in air', draft_short_name: 'PNs_LIF', user: User.where(urs_uid: 'testuser').first) }
  let(:draft) { service_draft.draft }

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

    it 'displays the corrent status icon' do
      within '#service_information-progress' do
        within '.status' do
          expect(page).to have_content('Service Information is valid')
        end
      end
    end

    it 'displays the correct progress indicators for required fields' do
      within '#service_information-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-required.icon-green.name')
        expect(page).to have_css('.eui-icon.eui-required.icon-green.long-name')
        expect(page).to have_css('.eui-icon.eui-required.icon-green.type')
        expect(page).to have_css('.eui-icon.eui-required.icon-green.version')
        expect(page).to have_css('.eui-icon.eui-required.icon-green.description')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.service_information' do
        expect(page).to have_css('.umm-preview-field-container', count: 8)

        within '#service_draft_draft_name_preview' do
          expect(page).to have_css('h5', text: 'Name')
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_name'))

          expect(page).to have_css('p', text: draft['Name'])
        end

        within '#service_draft_draft_long_name_preview' do
          expect(page).to have_css('h5', text: 'Long Name')
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_long_name'))

          expect(page).to have_css('p', text: draft['LongName'])
        end

        within '#service_draft_draft_type_preview' do
          expect(page).to have_css('h5', text: 'Type')
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_type'))

          expect(page).to have_css('p', text: draft['Type'])
        end

        within '#service_draft_draft_version_preview' do
          expect(page).to have_css('h5', text: 'Version')
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_version'))

          expect(page).to have_css('p', text: draft['Version'])
        end

        within '#service_draft_draft_version_description_preview' do
          expect(page).to have_css('h5', text: 'Version Description')
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_version_description'))

          expect(page).to have_css('p', text: draft['VersionDescription'])
        end

        within '#service_draft_draft_last_updated_date_preview' do
          expect(page).to have_css('h5', text: 'Last Updated Date')
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_last_updated_date'))

          expect(page).to have_css('p', text: draft['LastUpdatedDate'])
        end

        within '#service_draft_draft_description_preview' do
          expect(page).to have_css('h5', text: 'Description')
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_description'))

          expect(page).to have_css('p', text: draft['Description'])
        end

        within '#service_draft_draft_url_preview' do
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_information', anchor: 'service_draft_draft_url'))

          within '.card-header' do
            expect(page).to have_css('h5', text: 'DistributionURL')
          end

          within '.card-body' do
            expect(page).to have_css('p', text: 'Description')
            expect(page).to have_link(nil, href: 'httpx://testurl.earthdata.nasa.gov')
            expect(page).to have_css('li', text: 'GET SERVICE')
            expect(page).to have_css('li', text: 'SUBSETTER')
          end
        end
      end
    end
  end
end
