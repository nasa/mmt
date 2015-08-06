# MMT-288 MMT-295

require 'rails_helper'

init_store = [] # Will be populated to contain {locator=> value_string} hashes

describe 'Metadata Information form', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      click_on 'Metadata Information'

      mmt_fill_in init_store, 'Metadata Language', with: 'English'

      select 'DIF', from: 'Metadata Standard Name'
      mmt_fill_in init_store, 'Metadata Standard Version', with: '10'

      add_metadata_dates_values(init_store)

      within '.nav-top' do
        click_on 'Save & Done'
      end
    end

    it 'shows the draft preview page' do
      expect(page).to have_content('<Untitled Collection Record> DRAFT RECORD')
    end

    # TODO MMT-295
    it "shows pre-entered values in the draft preview page" do
      check_page_for_display_of_values(page, init_store, {})
    end

    context 'when returning to the form' do
      before do
        click_on 'Metadata Information'

        # Open all accordions
        script = "$('.multiple-item.is-closed').removeClass('is-closed');"
        page.evaluate_script script
      end

      it 'populates the form with the values' do
        expect(page).to have_field('Metadata Language', with: 'English')
        expect(page).to have_field('Metadata Standard Name', with: 'DIF')
        expect(page).to have_field('Metadata Standard Version', with: '10')

        # crazy nested fields are too complex for within '' statements, use the crazy complex field IDs instead
        # Metadata Lineage 1
        # Date 1
        date_1_prefix = 'draft_metadata_lineage_0_date_0_'
        expect(page).to have_field("#{date_1_prefix}type", with: 'CREATE')
        expect(page).to have_field("#{date_1_prefix}date", with: '2015-07-01')
        expect(page).to have_field("#{date_1_prefix}description", with: 'Create metadata')

        # Responsibility 1
        responsibility_1_prefix = "#{date_1_prefix}responsibility_0_"
        expect(page).to have_field("#{responsibility_1_prefix}role", with: 'RESOURCEPROVIDER')
        expect(page).to have_field("#{responsibility_1_prefix}party_organization_name_short_name", with: 'ORG_SHORT')
        expect(page).to have_field("#{responsibility_1_prefix}party_organization_name_long_name", with: 'Organization Long Name')

        expect(page).to have_field("#{responsibility_1_prefix}party_service_hours", with: '9-5, M-F')
        expect(page).to have_field("#{responsibility_1_prefix}party_contact_instructions", with: 'Email only')

        # Contact 1
        contact_1_prefix = "#{responsibility_1_prefix}party_contact_0_"
        expect(page).to have_field("#{contact_1_prefix}type", with: 'Email')
        expect(page).to have_field("#{contact_1_prefix}value", with: 'example@example.com')
        # Contact 2
        contact_2_prefix = "#{responsibility_1_prefix}party_contact_1_"
        expect(page).to have_field("#{contact_2_prefix}type", with: 'Email')
        expect(page).to have_field("#{contact_2_prefix}value", with: 'example2@example.com')

        # Address 1
        address_1_prefix = "#{responsibility_1_prefix}party_address_0_"
        expect(page).to have_field("#{address_1_prefix}street_address_", with: '300 E Street Southwest')
        expect(page).to have_field("#{address_1_prefix}street_address_", with: 'Room 203')
        expect(page).to have_field("#{address_1_prefix}city", with: 'Washington')
        expect(page).to have_field("#{address_1_prefix}state_province", with: 'DC')
        expect(page).to have_field("#{address_1_prefix}postal_code", with: '20546')
        expect(page).to have_field("#{address_1_prefix}country", with: 'United States')
        # Address 2
        address_2_prefix = "#{responsibility_1_prefix}party_address_1_"
        expect(page).to have_field("#{address_2_prefix}street_address_", with: '8800 Greenbelt Road')
        expect(page).to have_field("#{address_2_prefix}city", with: 'Greenbelt')
        expect(page).to have_field("#{address_2_prefix}state_province", with: 'MD')
        expect(page).to have_field("#{address_2_prefix}postal_code", with: '20771')
        expect(page).to have_field("#{address_2_prefix}country", with: 'United States')

        # RelatedUrl 1
        related_url_1_prefix = "#{responsibility_1_prefix}party_related_url_0_"
        expect(page).to have_field("#{related_url_1_prefix}url_", with: 'http://example.com')
        expect(page).to have_field("#{related_url_1_prefix}url_", with: 'http://another-example.com')
        expect(page).to have_field("#{related_url_1_prefix}description", with: 'Example Description')
        expect(page).to have_field("#{related_url_1_prefix}protocol", with: 'FTP')
        expect(page).to have_field("#{related_url_1_prefix}mime_type", with: 'text/html')
        expect(page).to have_field("#{related_url_1_prefix}caption", with: 'Example Caption')
        expect(page).to have_field("#{related_url_1_prefix}title", with: 'Example Title')
        expect(page).to have_field("#{related_url_1_prefix}file_size_size", with: '42')
        expect(page).to have_field("#{related_url_1_prefix}file_size_unit", with: 'MB')
        expect(page).to have_field("#{related_url_1_prefix}content_type_type", with: 'Text')
        expect(page).to have_field("#{related_url_1_prefix}content_type_subtype", with: 'Subtext')
        # RelatedUrl 2
        related_url_2_prefix = "#{responsibility_1_prefix}party_related_url_1_"
        expect(page).to have_field("#{related_url_2_prefix}url_", with: 'http://example.com/1')
        expect(page).to have_field("#{related_url_2_prefix}url_", with: 'http://another-example.com/1')
        expect(page).to have_field("#{related_url_2_prefix}description", with: 'Example Description 1')
        expect(page).to have_field("#{related_url_2_prefix}protocol", with: 'SSH')
        expect(page).to have_field("#{related_url_2_prefix}mime_type", with: 'text/json')
        expect(page).to have_field("#{related_url_2_prefix}caption", with: 'Example Caption 1')
        expect(page).to have_field("#{related_url_2_prefix}title", with: 'Example Title 1')
        expect(page).to have_field("#{related_url_2_prefix}file_size_size", with: '4.2')
        expect(page).to have_field("#{related_url_2_prefix}file_size_unit", with: 'GB')
        expect(page).to have_field("#{related_url_2_prefix}content_type_type", with: 'Text 1')
        expect(page).to have_field("#{related_url_2_prefix}content_type_subtype", with: 'Subtext 1')

        # Responsibility 2
        responsibility_2_prefix = "#{date_1_prefix}responsibility_1_"
        expect(page).to have_field("#{responsibility_2_prefix}role", with: 'OWNER')
        expect(page).to have_field("#{responsibility_2_prefix}party_person_first_name", with: 'First Name')
        expect(page).to have_field("#{responsibility_2_prefix}party_person_middle_name", with: 'Middle Name')
        expect(page).to have_field("#{responsibility_2_prefix}party_person_last_name", with: 'Last Name')

        expect(page).to have_field("#{responsibility_2_prefix}party_service_hours", with: '10-2, M-W')
        expect(page).to have_field("#{responsibility_2_prefix}party_contact_instructions", with: 'Email only')

        # Contact 1
        contact_1_prefix = "#{responsibility_2_prefix}party_contact_0_"
        expect(page).to have_field("#{contact_1_prefix}type", with: 'Email')
        expect(page).to have_field("#{contact_1_prefix}value", with: 'example@example.com')
        # Contact 2
        contact_2_prefix = "#{responsibility_2_prefix}party_contact_1_"
        expect(page).to have_field("#{contact_2_prefix}type", with: 'Email')
        expect(page).to have_field("#{contact_2_prefix}value", with: 'example2@example.com')

        # Address 1
        address_1_prefix = "#{responsibility_2_prefix}party_address_0_"
        expect(page).to have_field("#{address_1_prefix}street_address_", with: '300 E Street Southwest')
        expect(page).to have_field("#{address_1_prefix}street_address_", with: 'Room 203')
        expect(page).to have_field("#{address_1_prefix}city", with: 'Washington')
        expect(page).to have_field("#{address_1_prefix}state_province", with: 'DC')
        expect(page).to have_field("#{address_1_prefix}postal_code", with: '20546')
        expect(page).to have_field("#{address_1_prefix}country", with: 'United States')
        # Address 2
        address_2_prefix = "#{responsibility_2_prefix}party_address_1_"
        expect(page).to have_field("#{address_2_prefix}street_address_", with: '8800 Greenbelt Road')
        expect(page).to have_field("#{address_2_prefix}city", with: 'Greenbelt')
        expect(page).to have_field("#{address_2_prefix}state_province", with: 'MD')
        expect(page).to have_field("#{address_2_prefix}postal_code", with: '20771')
        expect(page).to have_field("#{address_2_prefix}country", with: 'United States')

        # RelatedUrl 1
        related_url_1_prefix = "#{responsibility_2_prefix}party_related_url_0_"
        expect(page).to have_field("#{related_url_1_prefix}url_", with: 'http://example.com')
        expect(page).to have_field("#{related_url_1_prefix}url_", with: 'http://another-example.com')
        expect(page).to have_field("#{related_url_1_prefix}description", with: 'Example Description')
        expect(page).to have_field("#{related_url_1_prefix}protocol", with: 'FTP')
        expect(page).to have_field("#{related_url_1_prefix}mime_type", with: 'text/html')
        expect(page).to have_field("#{related_url_1_prefix}caption", with: 'Example Caption')
        expect(page).to have_field("#{related_url_1_prefix}title", with: 'Example Title')
        expect(page).to have_field("#{related_url_1_prefix}file_size_size", with: '42')
        expect(page).to have_field("#{related_url_1_prefix}file_size_unit", with: 'MB')
        expect(page).to have_field("#{related_url_1_prefix}content_type_type", with: 'Text')
        expect(page).to have_field("#{related_url_1_prefix}content_type_subtype", with: 'Subtext')
        # RelatedUrl 2
        related_url_2_prefix = "#{responsibility_2_prefix}party_related_url_1_"
        expect(page).to have_field("#{related_url_2_prefix}url_", with: 'http://example.com/1')
        expect(page).to have_field("#{related_url_2_prefix}url_", with: 'http://another-example.com/1')
        expect(page).to have_field("#{related_url_2_prefix}description", with: 'Example Description 1')
        expect(page).to have_field("#{related_url_2_prefix}protocol", with: 'SSH')
        expect(page).to have_field("#{related_url_2_prefix}mime_type", with: 'text/json')
        expect(page).to have_field("#{related_url_2_prefix}caption", with: 'Example Caption 1')
        expect(page).to have_field("#{related_url_2_prefix}title", with: 'Example Title 1')
        expect(page).to have_field("#{related_url_2_prefix}file_size_size", with: '4.2')
        expect(page).to have_field("#{related_url_2_prefix}file_size_unit", with: 'GB')
        expect(page).to have_field("#{related_url_2_prefix}content_type_type", with: 'Text 1')
        expect(page).to have_field("#{related_url_2_prefix}content_type_subtype", with: 'Subtext 1')

        #### Date 2
        date_2_prefix = 'draft_metadata_lineage_0_date_1_'
        expect(page).to have_field("#{date_2_prefix}type", with: 'REVIEW')
        expect(page).to have_field("#{date_2_prefix}date", with: '2015-07-02')
        expect(page).to have_field("#{date_2_prefix}description", with: 'Reviewed metadata')

        # Responsibility 1
        responsibility_2_prefix = "#{date_2_prefix}responsibility_0_"
        expect(page).to have_field("#{responsibility_2_prefix}role", with: 'EDITOR')
        expect(page).to have_field("#{responsibility_2_prefix}party_organization_name_short_name", with: 'short_name')

        ########## Metadata Lineage 2
        date_1_prefix = 'draft_metadata_lineage_1_date_0_'
        expect(page).to have_field("#{date_1_prefix}type", with: 'CREATE')
        expect(page).to have_field("#{date_1_prefix}date", with: '2015-07-05')
        expect(page).to have_field("#{date_1_prefix}description", with: 'Create metadata')

        # Responsibility 1
        responsibility_1_prefix = "#{date_1_prefix}responsibility_0_"
        expect(page).to have_field("#{responsibility_1_prefix}role", with: 'USER')
        expect(page).to have_field("#{responsibility_1_prefix}party_organization_name_short_name", with: 'another_short_name')
      end

    end
  end
end
