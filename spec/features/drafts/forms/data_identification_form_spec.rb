#MMT-53

require 'rails_helper'

describe 'Data identification form', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      click_on 'Data Identification'

      # Entry Id
      within '.row.entry-id' do
        fill_in 'ID', with: '12345'
        fill_in 'Version', with: '1'
        fill_in 'Authority', with: 'Authority'
      end

      fill_in 'Entry Title', with: 'Draft Title'
      fill_in 'Abstract', with: 'This is a long description of the collection'
      fill_in 'Purpose', with: 'This is the purpose field'
      fill_in 'Data Language', with: 'English'

      # Data Dates
      add_dates

      # Organization
      within '.responsible-organization' do
        add_responsibilities('organization')
      end
      # Personnel
      within '.responsible-personnel' do
        add_responsibilities('personnel')
      end

      # Processing level
      within '.processing-level-fields' do
        fill_in 'ID', with: 'Level 1'
        fill_in 'Description', with: 'Level 1 Description'
      end

      # Resource Citation
      add_resource_citation

      select 'In work', from: 'Collection Progress'
      fill_in 'Quality', with: 'Metadata quality summary'
      fill_in 'Use Constraints', with: 'These are some use constraints'

      # Access Constraints
      within '.access-constraints' do
        fill_in 'Value', with: 'Access constraint value'
        fill_in 'Description', with: 'Access constraint description'
      end

      # Metadata Association
      add_metadata_association

      # Publication Reference
      add_publication_reference

      within '.nav-top' do
        click_on 'Save & Done'
      end
      open_accordions
    end

    it 'shows the draft preview page' do
      expect(page).to have_content('Draft Title')
    end

    # TODO MMT-293
    it 'shows the values in the draft preview page' do
      expect(page).to have_content('12345')
      expect(page).to have_content('1')
      expect(page).to have_content('Authority')
    end

    context 'when returning to the form' do
      before do
        click_on 'Data Identification'

        # Open all accordions
        script = "$('.multiple-item.is-closed').removeClass('is-closed');"
        page.evaluate_script script
      end

      it 'populates the form with the values' do
        within '.row.entry-id' do
          expect(page).to have_field('ID', with: '12345')
          expect(page).to have_field('Version', with: '1')
          expect(page).to have_field('Authority', with: 'Authority')
        end

        expect(page).to have_field('Entry Title', with: 'Draft Title')
        expect(page).to have_field('Abstract', with: 'This is a long description of the collection')
        expect(page).to have_field('Purpose', with: 'This is the purpose field')
        expect(page).to have_field('Data Language', with: 'English')


        # Data Lineage 1
        # Date 1
        date_1_prefix = 'draft_data_lineage_0_date_0_'
        expect(page).to have_field("#{date_1_prefix}type", with: 'CREATE')
        expect(page).to have_field("#{date_1_prefix}date", with: '2015-07-01')
        expect(page).to have_field("#{date_1_prefix}description", with: 'Create data')

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
        expect(page).to have_field("#{address_2_prefix}street_address_", with: '')
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
        expect(page).to have_field("#{related_url_1_prefix}content_type_type", with: 'Type')
        expect(page).to have_field("#{related_url_1_prefix}content_type_subtype", with: 'Subtype')
        # RelatedUrl 2
        related_url_2_prefix = "#{responsibility_1_prefix}party_related_url_1_"
        expect(page).to have_field("#{related_url_2_prefix}url_", with: 'http://example.com/1')

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
        expect(page).to have_field("#{address_2_prefix}street_address_", with: '')
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
        expect(page).to have_field("#{related_url_1_prefix}content_type_type", with: 'Type')
        expect(page).to have_field("#{related_url_1_prefix}content_type_subtype", with: 'Subtype')
        # RelatedUrl 2
        related_url_2_prefix = "#{responsibility_2_prefix}party_related_url_1_"
        expect(page).to have_field("#{related_url_2_prefix}url_", with: 'http://example.com/1')

        #### Date 2
        date_2_prefix = 'draft_data_lineage_0_date_1_'
        expect(page).to have_field("#{date_2_prefix}type", with: 'REVIEW')
        expect(page).to have_field("#{date_2_prefix}date", with: '2015-07-02')
        expect(page).to have_field("#{date_2_prefix}description", with: 'Reviewed data')

        # Responsibility 1
        responsibility_2_prefix = "#{date_2_prefix}responsibility_0_"
        expect(page).to have_field("#{responsibility_2_prefix}role", with: 'EDITOR')
        expect(page).to have_field("#{responsibility_2_prefix}party_organization_name_short_name", with: 'short_name')

        ########## Data Lineage 2
        date_1_prefix = 'draft_data_lineage_1_date_0_'
        expect(page).to have_field("#{date_1_prefix}type", with: 'CREATE')
        expect(page).to have_field("#{date_1_prefix}date", with: '2015-07-05')
        expect(page).to have_field("#{date_1_prefix}description", with: 'Create data')

        # Responsibility 1
        responsibility_1_prefix = "#{date_1_prefix}responsibility_0_"
        expect(page).to have_field("#{responsibility_1_prefix}role", with: 'USER')
        expect(page).to have_field("#{responsibility_1_prefix}party_organization_name_short_name", with: 'another_short_name')




        #### ResponsibleOrganization
        within '.row.responsible-organization' do
          within '.multiple.responsibility > .multiple-item-0' do
            expect(page).to have_field('Role', with: 'RESOURCEPROVIDER')
            expect(page).to have_field('Short Name', with: 'ORG_SHORT')
            expect(page).to have_field('Long Name', with: 'Organization Long Name')
            expect(page).to have_field('Service Hours', with: '9-5, M-F')
            expect(page).to have_field('Contact Instructions', with: 'Email only')
            within '.multiple.contact' do
              within '.multiple-item-0' do
                expect(page).to have_field('Type', with: 'Email')
                expect(page).to have_field('Value', with: 'example@example.com')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Type', with: 'Email')
                expect(page).to have_field('Value', with: 'example2@example.com')
              end
            end
            within '.multiple.address' do
              within '.multiple-item-0' do
                expect(page).to have_field('Street Address', with: '300 E Street Southwest')
                expect(page).to have_field('Street Address', with: 'Room 203')
                expect(page).to have_field('City', with: 'Washington')
                expect(page).to have_field('State / Province', with: 'DC')
                expect(page).to have_field('Postal Code', with: '20546')
                expect(page).to have_field('Country', with: 'United States')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Street Address', with: '8800 Greenbelt Road')
                expect(page).to have_field('City', with: 'Greenbelt')
                expect(page).to have_field('State / Province', with: 'MD')
                expect(page).to have_field('Postal Code', with: '20771')
                expect(page).to have_field('Country', with: 'United States')
              end
            end
            within '.multiple.related-url' do
              within '.multiple-item-0' do
                expect(page).to have_field('URL', with: 'http://example.com')
                expect(page).to have_field('URL', with: 'http://another-example.com')
                expect(page).to have_field('Description', with: 'Example Description')
                expect(page).to have_field('Protocol', with: 'FTP')
                expect(page).to have_field('Mime Type', with: 'text/html')
                expect(page).to have_field('Caption', with: 'Example Caption')
                expect(page).to have_field('Title', with: 'Example Title')
                expect(page).to have_field('Size', with: '42')
                expect(page).to have_field('Unit', with: 'MB')
                expect(page).to have_field('Type', with: 'Type')
                expect(page).to have_field('Subtype', with: 'Subtype')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('URL', with: 'http://example.com/1')
              end
            end

          end
          within '.multiple.responsibility > .multiple-item-1' do
            expect(page).to have_field('Role', with: 'OWNER')
            expect(page).to have_field('Short Name', with: 'ORG_SHORT')
            expect(page).to have_field('Long Name', with: 'Organization Long Name')
            expect(page).to have_field('Service Hours', with: '10-2, M-W')
            expect(page).to have_field('Contact Instructions', with: 'Email only')
            within '.multiple.contact' do
              within '.multiple-item-0' do
                expect(page).to have_field('Type', with: 'Email')
                expect(page).to have_field('Value', with: 'example@example.com')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Type', with: 'Email')
                expect(page).to have_field('Value', with: 'example2@example.com')
              end
            end
            within '.multiple.address' do
              within '.multiple-item-0' do
                expect(page).to have_field('Street Address', with: '300 E Street Southwest')
                expect(page).to have_field('Street Address', with: 'Room 203')
                expect(page).to have_field('City', with: 'Washington')
                expect(page).to have_field('State / Province', with: 'DC')
                expect(page).to have_field('Postal Code', with: '20546')
                expect(page).to have_field('Country', with: 'United States')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Street Address', with: '8800 Greenbelt Road')
                expect(page).to have_field('City', with: 'Greenbelt')
                expect(page).to have_field('State / Province', with: 'MD')
                expect(page).to have_field('Postal Code', with: '20771')
                expect(page).to have_field('Country', with: 'United States')
              end
            end
            within '.multiple.related-url' do
              within '.multiple-item-0' do
                expect(page).to have_field('URL', with: 'http://example.com')
                expect(page).to have_field('URL', with: 'http://another-example.com')
                expect(page).to have_field('Description', with: 'Example Description')
                expect(page).to have_field('Protocol', with: 'FTP')
                expect(page).to have_field('Mime Type', with: 'text/html')
                expect(page).to have_field('Caption', with: 'Example Caption')
                expect(page).to have_field('Title', with: 'Example Title')
                expect(page).to have_field('Size', with: '42')
                expect(page).to have_field('Unit', with: 'MB')
                expect(page).to have_field('Type', with: 'Type')
                expect(page).to have_field('Subtype', with: 'Subtype')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('URL', with: 'http://example.com/1')
              end
            end

          end
        end

        #### ResponsiblePersonnel
        within '.row.responsible-personnel' do
          within '.multiple.responsibility > .multiple-item-0' do
            expect(page).to have_field('Role', with: 'RESOURCEPROVIDER')
            expect(page).to have_field('First Name', with: 'First Name')
            expect(page).to have_field('Middle Name', with: 'Middle Name')
            expect(page).to have_field('Last Name', with: 'Last Name')
            expect(page).to have_field('Service Hours', with: '9-5, M-F')
            expect(page).to have_field('Contact Instructions', with: 'Email only')
            within '.multiple.contact' do
              within '.multiple-item-0' do
                expect(page).to have_field('Type', with: 'Email')
                expect(page).to have_field('Value', with: 'example@example.com')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Type', with: 'Email')
                expect(page).to have_field('Value', with: 'example2@example.com')
              end
            end
            within '.multiple.address' do
              within '.multiple-item-0' do
                expect(page).to have_field('Street Address', with: '300 E Street Southwest')
                expect(page).to have_field('Street Address', with: 'Room 203')
                expect(page).to have_field('City', with: 'Washington')
                expect(page).to have_field('State / Province', with: 'DC')
                expect(page).to have_field('Postal Code', with: '20546')
                expect(page).to have_field('Country', with: 'United States')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Street Address', with: '8800 Greenbelt Road')
                expect(page).to have_field('City', with: 'Greenbelt')
                expect(page).to have_field('State / Province', with: 'MD')
                expect(page).to have_field('Postal Code', with: '20771')
                expect(page).to have_field('Country', with: 'United States')
              end
            end
            within '.multiple.related-url' do
              within '.multiple-item-0' do
                expect(page).to have_field('URL', with: 'http://example.com')
                expect(page).to have_field('URL', with: 'http://another-example.com')
                expect(page).to have_field('Description', with: 'Example Description')
                expect(page).to have_field('Protocol', with: 'FTP')
                expect(page).to have_field('Mime Type', with: 'text/html')
                expect(page).to have_field('Caption', with: 'Example Caption')
                expect(page).to have_field('Title', with: 'Example Title')
                expect(page).to have_field('Size', with: '42')
                expect(page).to have_field('Unit', with: 'MB')
                expect(page).to have_field('Type', with: 'Type')
                expect(page).to have_field('Subtype', with: 'Subtype')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('URL', with: 'http://example.com/1')
              end
            end

          end
          within '.multiple.responsibility > .multiple-item-1' do
            expect(page).to have_field('Role', with: 'OWNER')
            expect(page).to have_field('First Name', with: 'First Name')
            expect(page).to have_field('Middle Name', with: 'Middle Name')
            expect(page).to have_field('Last Name', with: 'Last Name')
            expect(page).to have_field('Service Hours', with: '10-2, M-W')
            expect(page).to have_field('Contact Instructions', with: 'Email only')
            within '.multiple.contact' do
              within '.multiple-item-0' do
                expect(page).to have_field('Type', with: 'Email')
                expect(page).to have_field('Value', with: 'example@example.com')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Type', with: 'Email')
                expect(page).to have_field('Value', with: 'example2@example.com')
              end
            end
            within '.multiple.address' do
              within '.multiple-item-0' do
                expect(page).to have_field('Street Address', with: '300 E Street Southwest')
                expect(page).to have_field('Street Address', with: 'Room 203')
                expect(page).to have_field('City', with: 'Washington')
                expect(page).to have_field('State / Province', with: 'DC')
                expect(page).to have_field('Postal Code', with: '20546')
                expect(page).to have_field('Country', with: 'United States')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Street Address', with: '8800 Greenbelt Road')
                expect(page).to have_field('City', with: 'Greenbelt')
                expect(page).to have_field('State / Province', with: 'MD')
                expect(page).to have_field('Postal Code', with: '20771')
                expect(page).to have_field('Country', with: 'United States')
              end
            end
            within '.multiple.related-url' do
              within '.multiple-item-0' do
                expect(page).to have_field('URL', with: 'http://example.com')
                expect(page).to have_field('URL', with: 'http://another-example.com')
                expect(page).to have_field('Description', with: 'Example Description')
                expect(page).to have_field('Protocol', with: 'FTP')
                expect(page).to have_field('Mime Type', with: 'text/html')
                expect(page).to have_field('Caption', with: 'Example Caption')
                expect(page).to have_field('Title', with: 'Example Title')
                expect(page).to have_field('Size', with: '42')
                expect(page).to have_field('Unit', with: 'MB')
                expect(page).to have_field('Type', with: 'Type')
                expect(page).to have_field('Subtype', with: 'Subtype')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('URL', with: 'http://example.com/1')
              end
            end

          end
        end


        within '.processing-level-fields' do
          expect(page).to have_field('ID', with: 'Level 1')
          expect(page).to have_field('Description', with: 'Level 1 Description')
        end

        #### ResourceCitation
        within '.multiple.resource-citation' do
          within '.multiple-item-0' do
            expect(page).to have_field('Version', with: 'v1')
            expect(page).to have_field('Title', with: 'Citation title')
            expect(page).to have_field('Creator', with: 'Citation creator')
            expect(page).to have_field('Editor', with: 'Citation editor')
            expect(page).to have_field('Series Name', with: 'Citation series name')
            expect(page).to have_field('Release Date', with: '2015-07-01T00:00:00Z')
            expect(page).to have_field('Release Place', with: 'Citation release place')
            expect(page).to have_field('Publisher', with: 'Citation publisher')
            expect(page).to have_field('Issue Identification', with: 'Citation issue identification')
            expect(page).to have_field('Data Presentation Form', with: 'Citation data presentation form')
            expect(page).to have_field('Other Citation Details', with: 'Citation other details')
            expect(page).to have_field('DOI', with: 'Citation DOI')
            expect(page).to have_field('Authority', with: 'Citation DOI Authority')

            within '.related-url' do
              expect(page).to have_field("URL", with: 'http://example.com')
              expect(page).to have_field("URL", with: 'http://another-example.com')
              expect(page).to have_field("Description", with: 'Example Description')
              expect(page).to have_field("Protocol", with: 'FTP')
              expect(page).to have_field("Mime Type", with: 'text/html')
              expect(page).to have_field("Caption", with: 'Example Caption')
              expect(page).to have_field("Title", with: 'Example Title')
              expect(page).to have_field("Size", with: '42')
              expect(page).to have_field("Unit", with: 'MB')
              expect(page).to have_field("Type", with: 'Type')
              expect(page).to have_field("Subtype", with: 'Subtype')
            end
          end
          within '.multiple-item-1' do
            expect(page).to have_field('Version', with: 'v2')
            expect(page).to have_field('Title', with: 'Citation title 1')
            expect(page).to have_field('Creator', with: 'Citation creator 1')

            within '.related-url' do
              expect(page).to have_field("URL", with: 'http://example.com')
              expect(page).to have_field("URL", with: 'http://another-example.com')
              expect(page).to have_field("Description", with: 'Example Description')
              expect(page).to have_field("Protocol", with: 'FTP')
              expect(page).to have_field("Mime Type", with: 'text/html')
              expect(page).to have_field("Caption", with: 'Example Caption')
              expect(page).to have_field("Title", with: 'Example Title')
              expect(page).to have_field("Size", with: '42')
              expect(page).to have_field("Unit", with: 'MB')
              expect(page).to have_field("Type", with: 'Type')
              expect(page).to have_field("Subtype", with: 'Subtype')
            end
          end
        end

        expect(page).to have_field('Collection Progress', with: 'IN WORK')
        expect(page).to have_field('Quality', with: 'Metadata quality summary')
        expect(page).to have_field('Use Constraints', with: 'These are some use constraints')

        # Access constraints
        within '.row.access-constraints' do
          expect(page).to have_field('Value', with: 'Access constraint value')
          expect(page).to have_field('Description', with: 'Access constraint description')
        end


        ##### Metadata Association
        within '.multiple.metadata-association' do
          within '.multiple-item-0' do
            expect(page).to have_field('Type', with: 'SCIENCE ASSOCIATED')
            expect(page).to have_field('Description', with: 'Metadata association description')
            expect(page).to have_field('ID', with: '12345')
            expect(page).to have_field('Version', with: 'v1')
            expect(page).to have_field('Authority', with: 'Authority')
            expect(page).to have_field('Provider ID', with: 'LPDAAC_ECS')
          end
          within '.multiple-item-1' do
            expect(page).to have_field('Type', with: 'LARGER CITATION WORKS')
            expect(page).to have_field('ID', with: '123abc')
            expect(page).to have_field('Provider ID', with: 'ORNL_DAAC')
          end
        end


        #### PublicationReference
        within '.multiple.publication-reference' do
          within '.multiple-item-0' do
            expect(page).to have_field("draft_publication_reference_0_title", with: "Publication reference title") #Title
            expect(page).to have_field('Publisher', with: 'Publication reference publisher')
            expect(page).to have_field('DOI', with: 'Publication reference DOI')
            expect(page).to have_field('Authority', with: 'Publication reference authority')
            expect(page).to have_field('Author', with: 'Publication reference author')
            expect(page).to have_field('Publication Date', with: '2015-07-01T00:00:00Z')
            expect(page).to have_field('Series', with: 'Publication reference series')
            expect(page).to have_field('Edition', with: 'Publication reference edition')
            expect(page).to have_field('Volume', with: 'Publication reference volume')
            expect(page).to have_field('Issue', with: 'Publication reference issue')
            expect(page).to have_field('Report Number', with: 'Publication reference report number')
            expect(page).to have_field('Publication Place', with: 'Publication reference publication place')
            expect(page).to have_field('Pages', with: 'Publication reference pages')
            expect(page).to have_field('ISBN', with: '1234567890123')
            expect(page).to have_field('Other Reference Details', with: 'Publication reference details')
            within '.related-url' do
              expect(page).to have_field("URL", with: 'http://example.com')
              expect(page).to have_field("URL", with: 'http://another-example.com')
              expect(page).to have_field("Description", with: 'Example Description')
              expect(page).to have_field("Protocol", with: 'FTP')
              expect(page).to have_field("Mime Type", with: 'text/html')
              expect(page).to have_field("Caption", with: 'Example Caption')
              expect(page).to have_field("Title", with: 'Example Title')
              expect(page).to have_field("Size", with: '42')
              expect(page).to have_field("Unit", with: 'MB')
              expect(page).to have_field("Type", with: 'Type')
              expect(page).to have_field("Subtype", with: 'Subtype')
            end
          end
          within '.multiple-item-1' do
            expect(page).to have_field("draft_publication_reference_1_title", with: "Publication reference title 1") #Title
            expect(page).to have_field("ISBN", with: '9876543210987')
          end
        end

      end
    end
  end
end
