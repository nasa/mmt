shared_examples_for 'Service Contacts Full Preview' do
  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_contacts' do
      expect(page).to have_css('.umm-preview-field-container', count: 2)

      within '.contact-group-cards' do
        # First card 'stack'
        within all('.card')[0] do
          # Header and badge
          within '.card-header' do
            expect(page).to have_content('Contact Group 1')
            expect(page).to have_content('Multiple Roles')
            expect(page).to have_content('SCIENCE CONTACT')
            expect(page).to have_content('TECHNICAL CONTACT')
          end

          # Front card; Group name, first address and contact mechanisms
          within all('.card-body')[0] do
            within '.card-body-details' do
              expect(page).to have_css('h6', text: draft['ContactGroups'][0]['GroupName'])
              # Capybara does not see the <br> in the address
              expect(page).to have_css('p', text: "300 E Street SouthwestRoom 203Address line 3Washington, DC 20546")
            end

            within '.card-body-aside' do
              expect(page).to have_css('h6', text: draft['ContactGroups'][0]['ContactInformation']['ServiceHours'])
              expect(page).to have_link(draft['ContactGroups'][0]['ContactInformation']['ContactMechanisms'][0]['Type'], href: "mailto:#{draft['ContactGroups'][0]['ContactInformation']['ContactMechanisms'][0]['Value']}")
              expect(page).to have_link(draft['ContactGroups'][0]['ContactInformation']['ContactMechanisms'][1]['Type'], href: "mailto:#{draft['ContactGroups'][0]['ContactInformation']['ContactMechanisms'][1]['Value']}")
            end
          end

          # Second card; second addess
          within all('.card-body')[1] do
            within '.card-body-details-full' do
              expect(page).to have_css('h6', text: 'Additional Address')
              # Capybara does not see the <br> in the address
              expect(page).to have_css('p', text: '8800 Greenbelt RoadGreenbelt, MD 20771')
            end
          end

          # Third card; contact instructions
          within all('.card-body')[2] do
            within '.card-body-details-full' do
              expect(page).to have_css('h6', text: 'Contact Details')
              expect(page).to have_css('p', text: draft['ContactGroups'][0]['ContactInformation']['ConctactInstruction'])
            end
          end

          online_resources = draft['ContactGroups'][0]['ContactInformation']['OnlineResources']
          # Fourth card; OnlineResource 1
          within all('.card-body')[3] do
            within '.card-body-details-full' do
              expect(page).to have_content(online_resources[0]['Name'])
              expect(page).to have_content(online_resources[0]['Description'])
              expect(page).to have_link(online_resources[0]['Linkage'])
              expect(page).to have_content(online_resources[0]['Protocol'])
              expect(page).to have_content(online_resources[0]['ApplicationProfile'])
              expect(page).to have_content(online_resources[0]['Function'])
            end
          end

          # Fifth card; OnlineResource 2
          within all('.card-body')[4] do
            within '.card-body-details-full' do
              expect(page).to have_content(online_resources[1]['Name'])
              expect(page).to have_content(online_resources[1]['Description'])
              expect(page).to have_link(online_resources[1]['Linkage'])
              expect(page).to have_content(online_resources[1]['Protocol'])
              expect(page).to have_content(online_resources[1]['ApplicationProfile'])
              expect(page).to have_content(online_resources[1]['Function'])
            end
          end

          # Sixth card; OnlineResource 3
          within all('.card-body')[5] do
            within '.card-body-details-full' do
              expect(page).to have_content(online_resources[2]['Name'])
              expect(page).to have_content(online_resources[2]['Description'])
              expect(page).to have_link(online_resources[2]['Linkage'])
            end
          end
        end

        # Second card 'stack'
        within all('.card')[1] do
          within '.card-header' do
            expect(page).to have_content('Contact Group 2')
            expect(page).to have_content('SERVICE PROVIDER CONTACT')
          end

          within '.card-body-details' do
            expect(page).to have_css('h6', text: draft['ContactGroups'][1]['GroupName'])
            expect(page).to have_css('p', text: 'This contact group does not have any addresses listed.')
          end

          within '.card-body-aside' do
            expect(page).to have_css('p', text: 'This contact group does not have any contact mechanisms listed.')
          end
        end
      end

      within '.contact-person-cards' do
        # First card 'stack'
        within all('.card')[0] do
          # Header and badge
          within '.card-header' do
            expect(page).to have_content('Contact Person 1')
            expect(page).to have_content('SERVICE PROVIDER')
          end

          # Front card; Group name, first address and contact mechanisms
          within all('.card-body')[0] do
            within '.card-body-details' do
              expect(page).to have_css('h6', text: "#{draft['ContactPersons'][0]['FirstName']} #{draft['ContactPersons'][0]['MiddleName']} #{draft['ContactPersons'][0]['LastName']}")
              # Capybara does not see the <br> in the address
              expect(page).to have_css('p', text: '300 E Street SouthwestRoom 203Address line 3Washington, DC 20546')
            end

            within '.card-body-aside' do
              expect(page).to have_css('h6', text: draft['ContactPersons'][0]['ContactInformation']['ServiceHours'])
              expect(page).to have_link(draft['ContactPersons'][0]['ContactInformation']['ContactMechanisms'][0]['Type'], href: "mailto:#{draft['ContactPersons'][0]['ContactInformation']['ContactMechanisms'][0]['Value']}")
              expect(page).to have_link(draft['ContactPersons'][0]['ContactInformation']['ContactMechanisms'][1]['Type'], href: "mailto:#{draft['ContactPersons'][0]['ContactInformation']['ContactMechanisms'][1]['Value']}")
            end
          end

          # Second card; second addess
          within all('.card-body')[1] do
            within '.card-body-details-full' do
              expect(page).to have_css('h6', text: 'Additional Address')
              # Capybara does not see the <br> in the address
              expect(page).to have_css('p', text: "8800 Greenbelt RoadGreenbelt, MD 20771")
            end
          end

          # Third card; contact instructions
          within all('.card-body')[2] do
            within '.card-body-details-full' do
              expect(page).to have_css('h6', text: 'Contact Details')
              expect(page).to have_css('p', text: draft['ContactPersons'][0]['ContactInformation']['ConctactInstruction'])
            end
          end

          online_resources = draft['ContactGroups'][0]['ContactInformation']['OnlineResources']
          # Fourth card; OnlineResource 1
          within all('.card-body')[3] do
            within '.card-body-details-full' do
              expect(page).to have_content(online_resources[0]['Name'])
              expect(page).to have_content(online_resources[0]['Description'])
              expect(page).to have_link(online_resources[0]['Linkage'])
              expect(page).to have_content(online_resources[0]['Protocol'])
              expect(page).to have_content(online_resources[0]['ApplicationProfile'])
              expect(page).to have_content(online_resources[0]['Function'])
            end
          end

          # Fifth card; OnlineResource 2
          within all('.card-body')[4] do
            within '.card-body-details-full' do
              expect(page).to have_content(online_resources[1]['Name'])
              expect(page).to have_content(online_resources[1]['Description'])
              expect(page).to have_link(online_resources[1]['Linkage'])
              expect(page).to have_content(online_resources[1]['Protocol'])
              expect(page).to have_content(online_resources[1]['ApplicationProfile'])
              expect(page).to have_content(online_resources[1]['Function'])
            end
          end

          # Sixth card; OnlineResource 3
          within all('.card-body')[5] do
            within '.card-body-details-full' do
              expect(page).to have_content(online_resources[2]['Name'])
              expect(page).to have_content(online_resources[2]['Description'])
              expect(page).to have_link(online_resources[2]['Linkage'])
            end
          end
        end

        # Second card 'stack'
        within all('.card')[1] do
          within '.card-header' do
            expect(page).to have_content('Contact Person 2')
            expect(page).to have_content('DEVELOPER')
          end

          within '.card-body-details' do
            expect(page).to have_css('h6', text: draft['ContactPersons'][1]['GroupName'])
            expect(page).to have_css('p', text: 'This contact person does not have any addresses listed.')
          end

          within '.card-body-aside' do
            expect(page).to have_css('p', text: 'This contact person does not have any contact mechanisms listed.')
          end
        end
      end
    end
  end
end