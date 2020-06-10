describe 'Valid Tool Draft Tool Contacts Preview' do
  let(:tool_draft) { create(:full_tool_draft, user: User.where(urs_uid: 'testuser').first) }
  let(:draft) { tool_draft.draft }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examining the Tool Contacts sections' do
    context 'when examining the progress circles section' do
      it 'displays the form title as an edit link' do
        within '#tool_contacts-progress' do
          expect(page).to have_link('Tool Contacts', href: edit_tool_draft_path(tool_draft, 'tool_contacts'))
        end
      end

      it 'displays the correct status icon' do
        within '#tool_contacts-progress' do
          within '.status' do
            expect(page).to have_css('.eui-icon.icon-green.eui-check', text: 'Tool Contacts is valid')
          end
        end
      end

      it 'displays the correct progress indicators for non required fields' do
        within '#tool_contacts-progress .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.contact-groups')
          expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.contact-persons')
        end
      end
    end

    context 'when examining the metadata preview section' do
      it 'displays the stored values correctly within the preview' do
        within '.umm-preview.tool_contacts' do
          expect(page).to have_css('h4', text: 'Tool Contacts')

          expect(page).to have_css('.umm-preview-field-container', count: 2)

          within '#tool_draft_draft_contact_groups_preview' do
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_contacts', anchor: 'tool_draft_draft_contact_groups'))

            within 'ul.contact-group-cards' do
              # First card 'stack'
              within 'li.card:nth-child(1)' do
                within '.card-header' do
                  expect(page).to have_content('Contact Group 1')
                  expect(page).to have_content('Multiple Roles')
                  expect(page).to have_content('SERVICE PROVIDER')
                  expect(page).to have_content('PUBLISHER')
                end

                # Front card; Group name, first address and contact mechanisms
                within all('.card-body')[0] do
                  within '.card-body-details' do
                    expect(page).to have_css('h6', text: draft['ContactGroups'][0]['GroupName'])
                    # Capybara does not see the <br> in the address
                    expect(page).to have_css('p', text: '300 E Street SouthwestRoom 203Address line 3Washington, DC 20546')
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
              end

              # Second card 'stack'
              within 'li.card:nth-child(2)' do
                within '.card-header' do
                  expect(page).to have_content('Contact Group 2')
                  expect(page).to have_content('SERVICE PROVIDER')
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
          end

          within '#tool_draft_draft_contact_persons_preview' do
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_contacts', anchor: 'tool_draft_draft_contact_persons'))

            within 'ul.contact-person-cards' do
              # First card 'stack'
              within 'li.card:nth-child(1)' do
                within '.card-header' do
                  expect(page).to have_content('Contact Person 1')
                  expect(page).to have_content('Multiple Roles')
                  expect(page).to have_content('DEVELOPER')
                  expect(page).to have_content('SERVICE PROVIDER')
                end

                # Front card; Group name, first address and contact mechanisms
                within all('.card-body')[0] do
                  within '.card-body-details' do
                    expect(page).to have_css('h6', text: "#{draft['ContactPersons'][0]['FirstName']} #{draft['ContactPersons'][0]['MiddleName']} #{draft['ContactPersons'][0]['LastName']}")
                    # Capybara does not see the <br> in the address
                    expect(page).to have_css('p', text: '47914 252nd StreetSioux Falls, SD 57198-0001')
                  end

                  within '.card-body-aside' do
                    expect(page).to have_css('h6', text: draft['ContactPersons'][0]['ContactInformation']['ServiceHours'])
                    expect(page).to have_link(draft['ContactPersons'][0]['ContactInformation']['ContactMechanisms'][0]['Type'], href: "mailto:#{draft['ContactPersons'][0]['ContactInformation']['ContactMechanisms'][0]['Value']}")
                    expect(page).to have_content(draft['ContactPersons'][0]['ContactInformation']['ContactMechanisms'][1]['Value'])
                  end
                end
              end

              # Second card 'stack'
              within 'li.card:nth-child(2)' do
                within '.card-header' do
                  expect(page).to have_content('Contact Person 2')
                  expect(page).to have_content('DEVELOPER')
                end

                within '.card-body-details' do
                  expect(page).to have_css('h6', text: draft['ContactPersons'][1]['LastName'])
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
    end
  end
end
