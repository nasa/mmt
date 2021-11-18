describe 'Invalid picklists', js: true do
  before do
    login
    draft = create(:collection_draft_invalid_picklists, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when viewing the progress circles' do
    it 'displays an invalid icon for Metadata Language' do
      within '.metadata #metadata-information' do
        expect(page).to have_link('Metadata Language - Invalid')
      end
    end

    it 'displays an invalid icon for Data Language' do
      within '.metadata #collection-information' do
        expect(page).to have_link('Data Language - Invalid')
      end
    end

    it 'displays an invalid icon for Processing Level ID' do
      within '.metadata #data-identification' do
        expect(page).to have_link('Processing Level - Invalid')
      end
    end

    it 'displays an invalid icon for Data Centers' do
      within '.metadata #data-centers' do
        expect(page).to have_link('Data Centers - Invalid')
      end
    end

    it 'displays an invalid icon for Data Contacts' do
      within '.metadata #data-contacts' do
        expect(page).to have_link('Data Contacts - Invalid')
      end
    end

    it 'displays an invalid icon for Related URLs' do
      within '.metadata #related-urls' do
        expect(page).to have_link('Related URLs - Invalid')
      end
    end

    it 'displays an invalid icon for Spatial Extent' do
      within '.metadata #spatial-information' do
        expect(page).to have_link('Spatial Extent - Invalid')
      end
    end

    it 'displays an invalid icon for Platforms' do
      within '.metadata #acquisition-information' do
        expect(page).to have_link('Platforms - Invalid')
      end
    end

    it 'displays an invalid icon for Projects' do
      within '.metadata #acquisition-information' do
        expect(page).to have_link('Projects - Invalid')
      end
    end

    it 'displays an invalid icon for Temporal Keywords' do
      within '.metadata #temporal-information' do
        expect(page).to have_link('Temporal Keywords - Invalid')
      end
    end
  end

  context 'when viewing the Metadata Language field' do
    before do
      within '.metadata' do
        click_on 'Metadata Information'
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('Metadata Language value [english] does not match a valid selection option')
      end
    end

    it 'displays an inline error' do
      within '#metadata-language' do
        expect(page).to have_content('Metadata Language value [english] does not match a valid selection option')
      end
    end

    it 'displays an unselectable invalid option' do
      within '.metadata_language-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'english')
      end
    end
  end

  context 'when viewing the Data Language field' do
    before do
      within '.metadata' do
        click_on 'Collection Information'
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('Data Language value [english] does not match a valid selection option')
      end
    end

    it 'displays an inline error' do
      within '#collection-information' do
        expect(page).to have_content('Data Language value [english] does not match a valid selection option')
      end
    end

    it 'displays an unselectable invalid option' do
      within '.data_language-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'english')
      end
    end

    context 'when creating another error on the page' do
      before do
        fill_in 'Short Name', with: ''
      end

      it 'displays both summary errors' do
        within '.summary-errors' do
          expect(page).to have_content('Short Name is required')
          expect(page).to have_content('Data Language value [english] does not match a valid selection option')
        end
      end

      it 'displays both inline errors' do
        within '#collection-information' do
          expect(page).to have_content('Short Name is required')
          expect(page).to have_content('Data Language value [english] does not match a valid selection option')
        end
      end
    end
  end

  context 'when viewing the Processing Level Id field' do
    before do
      within '.metadata' do
        click_on 'Data Identification'
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('ID value [5] does not match a valid selection option')
      end
    end

    it 'displays an inline error' do
      within '#processing-level' do
        expect(page).to have_content('ID value [5] does not match a valid selection option')
      end
    end

    it 'displays an unselectable invalid option' do
      within '.id-select' do
        expect(page).to have_css('option[disabled][selected]', text: '5')
      end
    end
  end

  context 'when viewing the Data Centers fields' do
    before do
      within '.metadata' do
        click_on 'Data Centers', match: :first
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('Roles value [bad data center role] does not match a valid selection option')
        expect(page).to have_content('Short Name value [short_name] does not match a valid selection option')
        expect(page).to have_content('Type value [bad contact mechanism type] does not match a valid selection option')
        expect(page).to have_content('Country value [usa] does not match a valid selection option')
        expect(page).to have_content('State / Province value [maryland] does not match a valid selection option')
        expect(page).to have_content('URL Content Type value [badcontenttype] does not match a valid selection option')
        expect(page).to have_content('Type value [badurltype] does not match a valid selection option')
      end
    end

    it 'displays an inline error' do
      within '.data-centers' do
        expect(page).to have_content('Roles value [bad data center role] does not match a valid selection option')
        expect(page).to have_content('Short Name value [short_name] does not match a valid selection option')
      end
      within '.multiple.contact-mechanisms > .multiple-item-0' do
        expect(page).to have_content('Type value [bad contact mechanism type] does not match a valid selection option')
      end
      within '.multiple.addresses > .multiple-item-0' do
        expect(page).to have_content('Country value [usa] does not match a valid selection option')
      end
      within '.multiple.addresses > .multiple-item-1' do
        expect(page).to have_content('State / Province value [maryland] does not match a valid selection option')
      end
      within '.multiple.related-urls > .multiple-item-0' do
        expect(page).to have_content('URL Content Type value [badcontenttype] does not match a valid selection option')
      end
      within '.multiple.related-urls > .multiple-item-1' do
        expect(page).to have_content('Type value [badurltype] does not match a valid selection option')
      end
    end

    it 'displays an unselectable invalid option' do
      within '.data-center-roles-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'bad data center role')
      end
      within '.data-center-short-name-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'short_name')
      end
      within '.multiple.contact-mechanisms > .multiple-item-0 .contact-mechanism-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'bad contact mechanism type')
      end
      within '.multiple.addresses > .multiple-item-0 .country-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'usa')
      end
      within '.multiple.addresses > .multiple-item-1 .state-province-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'maryland')
      end
      within '.multiple.related-urls > .multiple-item-0' do
        expect(page).to have_css('option[disabled][selected]', text: 'badcontenttype')
      end
      within '.multiple.related-urls > .multiple-item-1' do
        expect(page).to have_css('option[disabled][selected]', text: 'badurltype')
      end
    end
  end

  context 'when viewing the Data Contacts Address field' do
    before do
      within '.metadata' do
        click_on 'Data Contacts', match: :first
      end

      wait_for_jQuery
      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('Roles value [bad non dc contact person role] does not match a valid selection option')
        expect(page).to have_content('Roles value [bad non dc contact group role] does not match a valid selection option')
        expect(page).to have_content('Roles value [bad data center contact person role] does not match a valid selection option')
        expect(page).to have_content('Roles value [bad data center contact group role] does not match a valid selection option')

        expect(page).to have_content('Short Name value [short_name] does not match a valid selection option')

        expect(page).to have_content('Type value [bad contact mechanism type] does not match a valid selection option')
        expect(page).to have_content('Country value [usa] does not match a valid selection option')
        expect(page).to have_content('State / Province value [maryland] does not match a valid selection option')

        expect(page).to have_content('URL Content Type value [badcontenttype] does not match a valid selection option')
        expect(page).to have_content('Type value [badurltype] does not match a valid selection option')
      end
    end

    it 'displays an inline error' do
      within '.multiple.data-contacts > .multiple-item-0' do
        expect(page).to have_content('Roles value [bad non dc contact person role] does not match a valid selection option')
        within '.multiple.contact-mechanisms > .multiple-item-0' do
          expect(page).to have_content('Type value [bad contact mechanism type] does not match a valid selection option')
        end
        within '.multiple.addresses > .multiple-item-0' do
          expect(page).to have_content('Country value [usa] does not match a valid selection option')
        end
        within '.multiple.addresses > .multiple-item-1' do
          expect(page).to have_content('State / Province value [maryland] does not match a valid selection option')
        end
        within '.multiple.related-urls > .multiple-item-0' do
          expect(page).to have_content('URL Content Type value [badcontenttype] does not match a valid selection option')
        end
        within '.multiple.related-urls > .multiple-item-1' do
          expect(page).to have_content('Type value [badurltype] does not match a valid selection option')
        end
      end
      within '.multiple.data-contacts > .multiple-item-1' do
        expect(page).to have_content('Roles value [bad non dc contact group role] does not match a valid selection option')
        within '.multiple.contact-mechanisms > .multiple-item-0' do
          expect(page).to have_content('Type value [bad contact mechanism type] does not match a valid selection option')
        end
        within '.multiple.addresses > .multiple-item-0' do
          expect(page).to have_content('Country value [usa] does not match a valid selection option')
        end
        within '.multiple.addresses > .multiple-item-1' do
          expect(page).to have_content('State / Province value [maryland] does not match a valid selection option')
        end
        within '.multiple.related-urls > .multiple-item-0' do
          expect(page).to have_content('URL Content Type value [badcontenttype] does not match a valid selection option')
        end
        within '.multiple.related-urls > .multiple-item-1' do
          expect(page).to have_content('Type value [badurltype] does not match a valid selection option')
        end
      end
      within '.multiple.data-contacts > .multiple-item-2' do
        expect(page).to have_content('Short Name value [short_name] does not match a valid selection option')
        expect(page).to have_content('Roles value [bad data center contact person role] does not match a valid selection option')
        within '.multiple.contact-mechanisms > .multiple-item-0' do
          expect(page).to have_content('Type value [bad contact mechanism type] does not match a valid selection option')
        end
        within '.multiple.addresses > .multiple-item-0' do
          expect(page).to have_content('Country value [usa] does not match a valid selection option')
        end
        within '.multiple.addresses > .multiple-item-1' do
          expect(page).to have_content('State / Province value [maryland] does not match a valid selection option')
        end
        within '.multiple.related-urls > .multiple-item-0' do
          expect(page).to have_content('URL Content Type value [badcontenttype] does not match a valid selection option')
        end
        within '.multiple.related-urls > .multiple-item-1' do
          expect(page).to have_content('Type value [badurltype] does not match a valid selection option')
        end
      end
      within '.multiple.data-contacts > .multiple-item-3' do
        expect(page).to have_content('Short Name value [short_name] does not match a valid selection option')
        expect(page).to have_content('Roles value [bad data center contact group role] does not match a valid selection option')
        within '.multiple.contact-mechanisms > .multiple-item-0' do
          expect(page).to have_content('Type value [bad contact mechanism type] does not match a valid selection option')
        end
        within '.multiple.addresses > .multiple-item-0' do
          expect(page).to have_content('Country value [usa] does not match a valid selection option')
        end
        within '.multiple.addresses > .multiple-item-1' do
          expect(page).to have_content('State / Province value [maryland] does not match a valid selection option')
        end
        within '.multiple.related-urls > .multiple-item-0' do
          expect(page).to have_content('URL Content Type value [badcontenttype] does not match a valid selection option')
        end
        within '.multiple.related-urls > .multiple-item-1' do
          expect(page).to have_content('Type value [badurltype] does not match a valid selection option')
        end
      end
    end

    it 'displays an unselectable invalid option' do
      within '.multiple.data-contacts > .multiple-item-0' do
        within '.data-contact-roles-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'bad non dc contact person role')
        end
        within '.multiple.contact-mechanisms > .multiple-item-0 .contact-mechanism-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'bad contact mechanism type')
        end
        within '.multiple.addresses > .multiple-item-0 .country-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'usa')
        end
        within '.multiple.addresses > .multiple-item-1 .state-province-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'maryland')
        end
        within '.multiple.related-urls > .multiple-item-0' do
          expect(page).to have_css('option[disabled][selected]', text: 'badcontenttype')
        end
        within '.multiple.related-urls > .multiple-item-1' do
          expect(page).to have_css('option[disabled][selected]', text: 'badurltype')
        end
      end
      within '.multiple.data-contacts > .multiple-item-1' do
        within '.data-contact-roles-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'bad non dc contact group role')
        end
        within '.multiple.contact-mechanisms > .multiple-item-0 .contact-mechanism-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'bad contact mechanism type')
        end
        within '.multiple.addresses > .multiple-item-0 .country-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'usa')
        end
        within '.multiple.addresses > .multiple-item-1 .state-province-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'maryland')
        end
        within '.multiple.related-urls > .multiple-item-0' do
          expect(page).to have_css('option[disabled][selected]', text: 'badcontenttype')
        end
        within '.multiple.related-urls > .multiple-item-1' do
          expect(page).to have_css('option[disabled][selected]', text: 'badurltype')
        end
      end
      within '.multiple.data-contacts > .multiple-item-2' do
        within '.data-center-short-name-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'short_name')
        end
        within '.data-contact-roles-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'bad data center contact person role')
        end
        within '.multiple.contact-mechanisms > .multiple-item-0 .contact-mechanism-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'bad contact mechanism type')
        end
        within '.multiple.addresses > .multiple-item-0 .country-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'usa')
        end
        within '.multiple.addresses > .multiple-item-1 .state-province-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'maryland')
        end
        within '.multiple.related-urls > .multiple-item-0' do
          expect(page).to have_css('option[disabled][selected]', text: 'badcontenttype')
        end
        within '.multiple.related-urls > .multiple-item-1' do
          expect(page).to have_css('option[disabled][selected]', text: 'badurltype')
        end
      end
      within '.multiple.data-contacts > .multiple-item-3' do
        within '.data-center-short-name-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'short_name')
        end
        within '.data-contact-roles-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'bad data center contact group role')
        end
        within '.multiple.contact-mechanisms > .multiple-item-0 .contact-mechanism-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'bad contact mechanism type')
        end
        within '.multiple.addresses > .multiple-item-0 .country-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'usa')
        end
        within '.multiple.addresses > .multiple-item-1 .state-province-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'maryland')
        end
        within '.multiple.related-urls > .multiple-item-0' do
          expect(page).to have_css('option[disabled][selected]', text: 'badcontenttype')
        end
        within '.multiple.related-urls > .multiple-item-1' do
          expect(page).to have_css('option[disabled][selected]', text: 'badurltype')
        end
      end
    end
  end

  context 'when viewing the Related URLs form' do
    before do
      within '.metadata' do
        click_on 'Related URLs', match: :first
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('URL Content Type value [badcontenttype] does not match a valid selection option')
        expect(page).to have_content('Unit value [badunit] does not match a valid selection option')
        expect(page).to have_content('Format value [badformat] does not match a valid selection option')
        expect(page).to have_content('Type value [badurltype] does not match a valid selection option')
        expect(page).to have_content('Subtype value [badurlsubtype] does not match a valid selection option')
      end
    end

    it 'displays an inline error' do
      within '.related-urls' do
        expect(page).to have_content('URL Content Type value [badcontenttype] does not match a valid selection option')
        expect(page).to have_content('Unit value [badunit] does not match a valid selection option')
        expect(page).to have_content('Format value [badformat] does not match a valid selection option')
        expect(page).to have_content('Type value [badurltype] does not match a valid selection option')
        expect(page).to have_content('Subtype value [badurlsubtype] does not match a valid selection option')
      end
    end

    it 'displays an unselectable invalid option' do
      within '.multiple.related-urls > .multiple-item-0 .related-url-content-type-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'badcontenttype')
      end
      within '.multiple.related-urls > .multiple-item-1' do
        expect(page).to have_css('option[disabled][selected]', text: 'badmimetype')
        expect(page).to have_css('option[disabled][selected]', text: 'badprotocol')
      end
      within '.multiple.related-urls > .multiple-item-2' do
        expect(page).to have_css('option[disabled][selected]', text: 'badunit')
        expect(page).to have_css('option[disabled][selected]', text: 'badformat')
      end
      within '.multiple.related-urls > .multiple-item-3 .related-url-type-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'badurltype')
      end
      within '.multiple.related-urls > .multiple-item-4 .related-url-subtype-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'badurlsubtype')
      end
    end
  end

  context 'when viewing the Platform and Project Short Name fields' do
    before do
      within '.metadata' do
        click_on 'Acquisition Information'
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('Short Name value [test 1 P ShortName] does not match a valid selection option')
        expect(page).to have_content('Short Name value [project shortname test] does not match a valid selection option')
      end
    end

    it 'displays Platforms inline error' do
      within '.platforms' do
        expect(page).to have_content('Short Name value [test 1 P ShortName] does not match a valid selection option')
      end
    end

    it 'displays Platforms unselectable invalid option' do
      within '.platform-short-name-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'test 1 P ShortName')
      end
    end

    it 'displays Projects inline error' do
      within '.projects' do
        expect(page).to have_content('Short Name value [project shortname test] does not match a valid selection option')
      end
    end

    it 'displays Projects unselectable invalid option' do
      within '.project-short-name-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'project shortname test')
      end
    end
  end

  context 'when viewing the Instrument Short Name field' do
    before do
      instrument_draft = create(:collection_draft_invalid_picklists_instruments, user: User.where(urs_uid: 'testuser').first)
      visit collection_draft_path(instrument_draft)

      within '.metadata' do
        click_on 'Acquisition Information'
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('Short Name value [Short Name] does not match a valid selection option')
      end
    end

    it 'displays an inline error' do
      within '.instruments' do
        expect(page).to have_content('Short Name value [Short Name] does not match a valid selection option')
      end
    end

    it 'displays an unselectable invalid option' do
      within all('.instrument-short-name-select').first do
        expect(page).to have_css('option[disabled][selected]', text: 'Short Name')
      end
    end
  end

  context 'when viewing the Instrument Child Short Name field' do
    before do
      instrument_draft = create(:collection_draft_invalid_picklists_instrument_children, user: User.where(urs_uid: 'testuser').first)
      visit collection_draft_path(instrument_draft)

      within '.metadata' do
        click_on 'Acquisition Information'
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('Short Name value [Short Name] does not match a valid selection option')
      end
    end

    it 'displays an inline error' do
      within '.instruments' do
        expect(page).to have_content('Short Name value [Short Name] does not match a valid selection option')
      end
    end

    it 'displays an unselectable invalid option' do
      within all('.instrument-children .instrument-short-name-select').first do
        expect(page).to have_css('option[disabled][selected]', text: 'Short Name')
      end
    end
  end

  context 'when viewing the Granule Spatial Representation field' do
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('Granule Spatial Representation value [cartesian] does not match a valid selection option')
      end
    end

    it 'displays an inline error' do
      within '.spatial-extent' do
        expect(page).to have_content('Granule Spatial Representation value [cartesian] does not match a valid selection option')
      end
    end

    it 'displays an unselectable invalid option' do
      within '.granule_spatial_representation-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'cartesian')
      end
    end
  end

  context 'when viewing the Temporal Keywords field' do
    context 'when the Temporal Keywords field has multiple invalid options' do
      before do
        within '.metadata' do
          click_on 'Temporal Information'
        end

        open_accordions
      end

      it 'displays a summary error' do
        within '.summary-errors' do
          expect(page).to have_content('Temporal Keywords values [Keyword 2, Keyword 1] do not match a valid selection option')
        end
      end

      it 'displays an inline error' do
        within '#temporal-keywords' do
          expect(page).to have_content('Temporal Keywords values [Keyword 2, Keyword 1] do not match a valid selection option')
        end
      end

      it 'displays an unselectable invalid option' do
        within '.temporal_keywords-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'Keyword 1')
          expect(page).to have_css('option[disabled][selected]', text: 'Keyword 2')
        end
      end
    end

    context 'when the Temporal Keywords field only has one invalid option' do
      before do
        draft = Draft.first
        draft_metadata = draft.draft
        draft_metadata['TemporalKeywords'] = ['Keyword 1']
        draft.draft = draft_metadata
        draft.save

        within '.metadata' do
          click_on 'Temporal Information'
        end

        open_accordions
      end

      it 'displays a summary error' do
        within '.summary-errors' do
          expect(page).to have_content('Temporal Keywords value [Keyword 1] does not match a valid selection option')
        end
      end

      it 'displays an inline error' do
        within '#temporal-keywords' do
          expect(page).to have_content('Temporal Keywords value [Keyword 1] does not match a valid selection option')
        end
      end

      it 'displays an unselectable invalid option' do
        within '.temporal_keywords-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'Keyword 1')
        end
      end
    end
  end
end
