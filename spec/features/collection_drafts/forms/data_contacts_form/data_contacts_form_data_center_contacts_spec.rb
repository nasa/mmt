describe 'Data Contacts form filling in Data Center Contacts' do
  before do
    login
  end

  context 'when creating Data Center Contacts', js: true do
    context 'when the Data Center has already been added to the draft' do
      let(:data_center_short_name) { 'AARHUS-HYDRO' }

      # controlled keywords source has an extra trailing space at the end. however,
      # Selenium/Headless Chrome will either not render or not read the extra space
      let(:data_center_long_name) { 'Hydrogeophysics Group, Aarhus University ' }
      let(:data_center_long_name_without_space) { 'Hydrogeophysics Group, Aarhus University' }

      before do
        draft = create(:collection_draft_all_required_fields, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end

      it 'displays the Data Center on the preview page' do
        within '#metadata-preview' do
        expect(page).to have_content(data_center_short_name)
        expect(page).to have_content(data_center_long_name_without_space)
          end
      end

      context 'when choosing Data Center Contact Person' do
        before do
          within '#data-contacts .meta-info' do
            click_link 'Data Contacts', match: :first
          end

          select 'Data Center Contact Person', from: 'Data Contact Type'
        end

        it 'does not display the Non Data Center Affiliation field' do
          expect(page).to have_no_field 'Non Data Center Affiliation'
        end

        context 'when filling out the form' do
          before do
            add_data_center(data_center_short_name)
            select 'Investigator', from: 'Role'
            select 'Technical Contact', from: 'Role'
            add_person

            add_contact_information(type: 'data_contact', single: false, button_type: 'Data Center Contact Person')
          end

          context 'when clicking Save to submit the form' do
            before do
              within '.nav-top' do
                click_on 'Save'

                wait_for_jQuery
              end
            end

            it 'populates the form with the values' do
              open_accordions

              within '.multiple.data-contacts > .multiple-item-0' do
                expect(page).to have_select('Short Name', selected: data_center_short_name)
                expect(page).to have_field('Long Name', with: data_center_long_name)
                expect(page).to have_select('Role', selected: ['Investigator', 'Technical Contact'])
                expect(page).to have_field('First Name', with: 'First Name')
                expect(page).to have_field('Middle Name', with: 'Middle Name')
                expect(page).to have_field('Last Name', with: 'Last Name')
                expect(page).to have_field('Service Hours', with: '9-5, M-F')
                expect(page).to have_field('Contact Instructions', with: 'Email only')

                within '.multiple.contact-mechanisms' do
                  within '.multiple-item-0' do
                    expect(page).to have_field('Type', with: 'Email')
                    expect(page).to have_field('Value', with: 'example@example.com')
                  end
                  within '.multiple-item-1' do
                    expect(page).to have_field('Type', with: 'Email')
                    expect(page).to have_field('Value', with: 'example2@example.com')
                  end
                end

                within '.multiple.addresses > .multiple-item-0' do
                  expect(page).to have_field('Street Address - Line 1', with: '300 E Street Southwest')
                  expect(page).to have_field('Street Address - Line 2', with: 'Room 203')
                  expect(page).to have_field('Street Address - Line 3', with: 'Address line 3')
                  expect(page).to have_field('City', with: 'Washington')
                  expect(page).to have_field('State / Province', with: 'District of Columbia')
                  expect(page).to have_field('Postal Code', with: '20546')
                  expect(page).to have_field('Country', with: 'United States')
                end

                within '.multiple.addresses > .multiple-item-1' do
                  expect(page).to have_field('Street Address - Line 1', with: '8800 Greenbelt Road')
                  expect(page).to have_field('City', with: 'Greenbelt')
                  expect(page).to have_field('State / Province', with: 'Maryland')
                  expect(page).to have_field('Postal Code', with: '20771')
                  expect(page).to have_field('Country', with: 'United States')
                end

                within '.multiple.related-urls > .multiple-item-0' do
                  expect(page).to have_field('Description', with: 'Example Description')
                  expect(page).to have_field('URL Content Type', with: 'DataContactURL')
                  expect(page).to have_field('Type', with: 'HOME PAGE')
                  expect(page).to have_field('URL', with: 'http://example.com')
                end
              end
            end
          end

          context 'when clicking Done to submit the form' do
            before do
              within '.nav-top' do
                click_on 'Done'
              end
              expect(page).to have_content('Metadata Fields')

            end

            it 'displays a confirmation message' do
              expect(page).to have_content('Collection Draft Updated Successfully!')
            end

            it 'displays the Data Center Contact Person on the preview page' do
              within '#metadata-preview' do
                expect(page).to have_content('First Name')
                expect(page).to have_content('Last Name')
                expect(page).to have_content('Technical Contact')
                expect(page).to have_content('Investigator')
                expect(page).to have_content(data_center_short_name)
              end
            end

            it 'still displays the Data Center on the preview page' do
              within '#metadata-preview' do
                expect(page).to have_content(data_center_short_name)
                expect(page).to have_content(data_center_long_name_without_space)
              end
            end

            it 'saves the data center contact person in the right structure in the schema' do
              d = Draft.first
              data_center = d.draft['DataCenters'].first
              expect(data_center['ShortName']).to eq(data_center_short_name)
              expect(data_center['LongName']).to eq(data_center_long_name)
              expect(data_center['ContactPersons'].blank?).to be false

              dc_contact_person = data_center['ContactPersons'].first
              expect(dc_contact_person['FirstName']).to eq('First Name')
              expect(dc_contact_person['MiddleName']).to eq('Middle Name')
              expect(dc_contact_person['LastName']).to eq('Last Name')
            end
          end
        end
      end

      context 'when choosing Data Center Contact Group' do
        before do
          within '#data-contacts .meta-info' do
            click_link 'Data Contacts', match: :first
          end

          select 'Data Center Contact Group', from: 'Data Contact Type'
        end

        it 'does not display the Non Data Center Affiliation field' do
          expect(page).to have_no_field 'Non Data Center Affiliation'
        end

        context 'when filling out the form' do
          before do
            add_data_center(data_center_short_name)
            select 'Data Center Contact', from: 'Role'
            select 'User Services', from: 'Role'
            fill_in 'Group Name', with: 'DC Contact Group Name'

            add_contact_information(type: 'data_contact', single: false, button_type: 'Data Center Contact Group')
          end

          context 'when clicking Save to submit the form' do
            before do
              within '.nav-top' do
                click_on 'Save'

                wait_for_jQuery
              end
            end

            it 'populates the form with the values' do
              open_accordions

              within '.multiple.data-contacts > .multiple-item-0' do
                expect(page).to have_select('Short Name', selected: data_center_short_name)
                expect(page).to have_field('Long Name', with: data_center_long_name)
                expect(page).to have_select('Role', selected: ['Data Center Contact', 'User Services'])
                expect(page).to have_field('Group Name', with: 'DC Contact Group Name')
                expect(page).to have_field('Service Hours', with: '9-5, M-F')
                expect(page).to have_field('Contact Instructions', with: 'Email only')

                within '.multiple.contact-mechanisms' do
                  within '.multiple-item-0' do
                    expect(page).to have_field('Type', with: 'Email')
                    expect(page).to have_field('Value', with: 'example@example.com')
                  end
                  within '.multiple-item-1' do
                    expect(page).to have_field('Type', with: 'Email')
                    expect(page).to have_field('Value', with: 'example2@example.com')
                  end
                end

                within '.multiple.addresses > .multiple-item-0' do
                  expect(page).to have_field('Street Address - Line 1', with: '300 E Street Southwest')
                  expect(page).to have_field('Street Address - Line 2', with: 'Room 203')
                  expect(page).to have_field('Street Address - Line 3', with: 'Address line 3')
                  expect(page).to have_field('City', with: 'Washington')
                  expect(page).to have_field('State / Province', with: 'District of Columbia')
                  expect(page).to have_field('Postal Code', with: '20546')
                  expect(page).to have_field('Country', with: 'United States')
                end

                within '.multiple.addresses > .multiple-item-1' do
                  expect(page).to have_field('Street Address - Line 1', with: '8800 Greenbelt Road')
                  expect(page).to have_field('City', with: 'Greenbelt')
                  expect(page).to have_field('State / Province', with: 'Maryland')
                  expect(page).to have_field('Postal Code', with: '20771')
                  expect(page).to have_field('Country', with: 'United States')
                end

                within '.multiple.related-urls > .multiple-item-0' do
                  expect(page).to have_field('Description', with: 'Example Description')
                  expect(page).to have_field('URL Content Type', with: 'DataContactURL')
                  expect(page).to have_field('Type', with: 'HOME PAGE')
                  expect(page).to have_field('URL', with: 'http://example.com')
                end
              end
            end
          end

          context 'when clicking Done to submit the form' do
            before do
              within '.nav-top' do
                click_on 'Done'
              end

            end

            it 'displays a confirmation message' do
              expect(page).to have_content('Collection Draft Updated Successfully!')
            end

            it 'displays the Contact Group on the preview' do
              within '#metadata-preview' do
                expect(page).to have_content('DC Contact Group Name')
                expect(page).to have_content('Data Center Contact')
                expect(page).to have_content('User Services')
                expect(page).to have_content(data_center_short_name)
              end
            end

            it 'still displays the Data Center on the preview page' do
              within '#metadata-preview' do
                expect(page).to have_content(data_center_short_name)
                expect(page).to have_content(data_center_long_name_without_space)
              end
            end

            it 'saves the data in the right structure in the schema' do
              d = Draft.first
              data_center = d.draft['DataCenters'].first
              expect(data_center['ShortName']).to eq(data_center_short_name)
              expect(data_center['LongName']).to eq(data_center_long_name)
              expect(data_center['ContactGroups'].blank?).to be false

              dc_contact_group = data_center['ContactGroups'].first
              expect(dc_contact_group['GroupName']).to eq('DC Contact Group Name')
            end
          end
        end
      end
    end

    context 'when the Data Center has not yet been added to the draft' do
      data_center_short_name = 'ESA/ED'
      data_center_long_name = 'Educational Office, Ecological Society of America'

      before do
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)

      end


      it 'has no Data Centers in the schema' do
        d = Draft.first
        expect(d.draft['DataCenters'].blank?).to be true
      end

      context 'when choosing Data Center Contact Person' do
        before do
          within '#data-contacts .meta-info' do
            click_link 'Data Contacts', match: :first
          end

          select 'Data Center Contact Person', from: 'Data Contact Type'
        end

        context 'when filling out the form' do
          before do
            add_data_center(data_center_short_name)
            select 'Investigator', from: 'Role'
            select 'Technical Contact', from: 'Role'
            add_person
            add_contact_information(type: 'data_contact', single: false, button_type: 'Data Center Contact Person')
          end

          context 'when clicking Save to submit the form' do
            before do
              within '.nav-top' do
                click_on 'Save'
              end

              expect(page).to have_content('Data Contacts')
            end

            it 'populates the form with the values' do
              open_accordions

              within '.multiple.data-contacts > .multiple-item-0' do
                expect(page).to have_select('Short Name', selected: data_center_short_name)
                expect(page).to have_field('Long Name', with: data_center_long_name)
                expect(page).to have_select('Role', selected: ['Investigator', 'Technical Contact'])
                expect(page).to have_field('First Name', with: 'First Name')
                expect(page).to have_field('Middle Name', with: 'Middle Name')
                expect(page).to have_field('Last Name', with: 'Last Name')
                expect(page).to have_field('Service Hours', with: '9-5, M-F')
                expect(page).to have_field('Contact Instructions', with: 'Email only')

                within '.multiple.contact-mechanisms' do
                  within '.multiple-item-0' do
                    expect(page).to have_field('Type', with: 'Email')
                    expect(page).to have_field('Value', with: 'example@example.com')
                  end
                  within '.multiple-item-1' do
                    expect(page).to have_field('Type', with: 'Email')
                    expect(page).to have_field('Value', with: 'example2@example.com')
                  end
                end

                within '.multiple.addresses > .multiple-item-0' do
                  expect(page).to have_field('Street Address - Line 1', with: '300 E Street Southwest')
                  expect(page).to have_field('Street Address - Line 2', with: 'Room 203')
                  expect(page).to have_field('Street Address - Line 3', with: 'Address line 3')
                  expect(page).to have_field('City', with: 'Washington')
                  expect(page).to have_field('State / Province', with: 'District of Columbia')
                  expect(page).to have_field('Postal Code', with: '20546')
                  expect(page).to have_field('Country', with: 'United States')
                end

                within '.multiple.addresses > .multiple-item-1' do
                  expect(page).to have_field('Street Address - Line 1', with: '8800 Greenbelt Road')
                  expect(page).to have_field('City', with: 'Greenbelt')
                  expect(page).to have_field('State / Province', with: 'Maryland')
                  expect(page).to have_field('Postal Code', with: '20771')
                  expect(page).to have_field('Country', with: 'United States')
                end

                within '.multiple.related-urls > .multiple-item-0' do
                  expect(page).to have_field('Description', with: 'Example Description')
                  expect(page).to have_field('URL Content Type', with: 'DataContactURL')
                  expect(page).to have_field('Type', with: 'HOME PAGE')
                  expect(page).to have_field('URL', with: 'http://www.esa.org/education/')
                end
              end
            end
          end

          context 'when clicking Done to submit the form' do
            before do
              within '.nav-top' do
                click_on 'Done'
              end

              expect(page).to have_content('Metadata Fields')
            end

            it 'displays a confirmation message' do
              expect(page).to have_content('Collection Draft Updated Successfully!')
            end

            it 'displays the Data Center Contact Person on the preview page' do
              within '#metadata-preview' do
                expect(page).to have_content('First Name')
                expect(page).to have_content('Last Name')
                expect(page).to have_content('Technical Contact')
                expect(page).to have_content('Investigator')
                expect(page).to have_content(data_center_short_name)
              end
            end

            it 'displays the newly added Data Center on the preview page' do
              within '#metadata-preview' do
                expect(page).to have_content(data_center_short_name)
                expect(page).to have_content(data_center_long_name)
              end
            end

            it 'saves the contact under a new data center in the schema' do
              d = Draft.first
              expect(d.draft['DataCenters'].blank?).to be false

              data_center = d.draft['DataCenters'].first
              expect(data_center['ShortName']).to eq(data_center_short_name)
              expect(data_center['LongName']).to eq(data_center_long_name)
              expect(data_center['ContactPersons'].blank?).to be false

              dc_contact_person = data_center['ContactPersons'].first
              expect(dc_contact_person['FirstName']).to eq('First Name')
              expect(dc_contact_person['MiddleName']).to eq('Middle Name')
              expect(dc_contact_person['LastName']).to eq('Last Name')
            end
          end
        end
      end

      context 'when choosing Data Center Contact Group' do
        before do
          within '#data-contacts .meta-info' do
            click_link 'Data Contacts', match: :first
          end

          select 'Data Center Contact Group', from: 'Data Contact Type'
        end

        context 'when filling out the form' do
          before do
            add_data_center(data_center_short_name)
            select 'Data Center Contact', from: 'Role'
            select 'User Services', from: 'Role'
            fill_in 'Group Name', with: 'DC Contact Group Name'

            add_contact_information(type: 'data_contact', single: false, button_type: 'Data Center Contact Group')
          end

          context 'when clicking Save to submit the form' do
            before do
              within '.nav-top' do
                click_on 'Save'

                wait_for_jQuery
              end

              expect(page).to have_content('Data Contacts')
            end

            it 'populates the form with the values' do
              open_accordions

              within '.multiple.data-contacts > .multiple-item-0' do
                expect(page).to have_select('Short Name', selected: data_center_short_name)
                expect(page).to have_field('Long Name', with: data_center_long_name)
                expect(page).to have_select('Role', selected: ['Data Center Contact', 'User Services'])
                expect(page).to have_field('Group Name', with: 'DC Contact Group Name')
                expect(page).to have_field('Service Hours', with: '9-5, M-F')
                expect(page).to have_field('Contact Instructions', with: 'Email only')

                within '.multiple.contact-mechanisms' do
                  within '.multiple-item-0' do
                    expect(page).to have_field('Type', with: 'Email')
                    expect(page).to have_field('Value', with: 'example@example.com')
                  end
                  within '.multiple-item-1' do
                    expect(page).to have_field('Type', with: 'Email')
                    expect(page).to have_field('Value', with: 'example2@example.com')
                  end
                end

                within '.multiple.addresses > .multiple-item-0' do
                  expect(page).to have_field('Street Address - Line 1', with: '300 E Street Southwest')
                  expect(page).to have_field('Street Address - Line 2', with: 'Room 203')
                  expect(page).to have_field('Street Address - Line 3', with: 'Address line 3')
                  expect(page).to have_field('City', with: 'Washington')
                  expect(page).to have_field('State / Province', with: 'District of Columbia')
                  expect(page).to have_field('Postal Code', with: '20546')
                  expect(page).to have_field('Country', with: 'United States')
                end

                within '.multiple.addresses > .multiple-item-1' do
                  expect(page).to have_field('Street Address - Line 1', with: '8800 Greenbelt Road')
                  expect(page).to have_field('City', with: 'Greenbelt')
                  expect(page).to have_field('State / Province', with: 'Maryland')
                  expect(page).to have_field('Postal Code', with: '20771')
                  expect(page).to have_field('Country', with: 'United States')
                end

                within '.multiple.related-urls > .multiple-item-0' do
                  expect(page).to have_field('Description', with: 'Example Description')
                  expect(page).to have_field('URL Content Type', with: 'DataContactURL')
                  expect(page).to have_field('Type', with: 'HOME PAGE')
                  expect(page).to have_field('URL', with: 'http://www.esa.org/education/')
                end
              end
            end
          end

          context 'when clicking Done to submit the form' do
            before do
              within '.nav-top' do
                click_on 'Done'
              end

            end

            it 'displays a confirmation message' do
              expect(page).to have_content('Collection Draft Updated Successfully!')
            end

            it 'displays the Contact Group on the preview' do
              within '#metadata-preview' do
                expect(page).to have_content('DC Contact Group Name')
                expect(page).to have_content('Data Center Contact')
                expect(page).to have_content('User Services')
                expect(page).to have_content(data_center_short_name)
              end
            end

            it 'displays the newly created Data Center on the preview page' do
              within '#metadata-preview' do
                expect(page).to have_content(data_center_short_name)
                expect(page).to have_content(data_center_long_name)
              end
            end

            it 'saves the contact group under a new data center in the schema' do
              d = Draft.first
              expect(d.draft['DataCenters'].blank?).to be false

              data_center = d.draft['DataCenters'].first
              expect(data_center['ShortName']).to eq(data_center_short_name)
              expect(data_center['LongName']).to eq(data_center_long_name)
              expect(data_center['ContactGroups'].blank?).to be false

              dc_contact_group = data_center['ContactGroups'].first
              expect(dc_contact_group['GroupName']).to eq('DC Contact Group Name')
            end
          end
        end
      end
    end
  end
end
