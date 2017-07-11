require 'rails_helper'

describe 'Data Contacts preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end

      it 'does not display metadata' do
        expect(page).to have_content('There are no listed data contacts for this collection.')
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)

        visit collection_draft_path(draft)
      end

      it 'displays the metadata' do
        within '.data-contacts-cards' do
          within all('li.card')[0] do
            within '.card-header' do
              expect(page).to have_content('First Name')
              expect(page).to have_content('Multiple Roles Science Contact Technical Contact')
            end
            within all('.card-body')[0] do
              within '.card-body-details' do
                expect(page).to have_content('First Name Last Name')
                expect(page).to have_content('Famous University')
                expect(page).to have_content('300 E Street Southwest')
                expect(page).to have_content('Room 203')
                expect(page).to have_content('Address line 3')
                expect(page).to have_content('Washington, DC 20546')
              end
              within '.card-body-aside' do
                expect(page).to have_content('10-2, M-W')
                expect(page).to have_link('Email', href: 'mailto:example1@example.com')
                expect(page).to have_link('Email', href: 'mailto:example2@example.com')
              end
            end
            within all('.card-body')[1] do
              expect(page).to have_content('Additional Address')
              expect(page).to have_content('8800 Greenbelt Road')
              expect(page).to have_content('Greenbelt, MD 20771')
            end
            within all('.card-body')[2] do
              expect(page).to have_content('Contact Details')
              expect(page).to have_content('Email only')
            end
            within all('.card-body')[3] do
              expect(page).to have_content('Related URL 1 Description')
              expect(page).to have_link('http://example.com/', href: 'http://example.com/')
              expect(page).to have_content('Home Page')
            end
          end
          within all('li.card')[1] do
            within '.card-header' do
              expect(page).to have_content('Group Name')
              expect(page).to have_content('Multiple Roles User Services Science Software Development')
            end
            within all('.card-body')[0] do
              within '.card-body-details' do
                expect(page).to have_content('Group Name')
                expect(page).to have_content('Famous University')
                expect(page).to have_content('300 E Street Southwest')
                expect(page).to have_content('Room 203')
                expect(page).to have_content('Address line 3')
                expect(page).to have_content('Washington, DC 20546')
              end
              within '.card-body-aside' do
                expect(page).to have_content('9-5, M-F')
                expect(page).to have_link('Email', href: 'mailto:example3@example.com')
                expect(page).to have_link('Email', href: 'mailto:example4@example.com')
              end
            end
            within all('.card-body')[1] do
              expect(page).to have_content('Additional Address')
              expect(page).to have_content('8800 Greenbelt Road')
              expect(page).to have_content('Greenbelt, MD 20771')
            end
            within all('.card-body')[2] do
              expect(page).to have_content('Contact Details')
              expect(page).to have_content('Email only')
            end
            within all('.card-body')[3] do
              expect(page).to have_content('Related URL 1 Description')
              expect(page).to have_link('http://example.com/', href: 'http://example.com/')
              expect(page).to have_content('Home Page')
            end
          end
          within all('li.card')[2] do
            within '.card-header' do
              expect(page).to have_content('First Name 3')
              expect(page).to have_content('Multiple Roles Investigator Metadata Author')
            end
            within all('.card-body')[0] do
              within '.card-body-details' do
                expect(page).to have_content('First Name 3 Last Name 3')
                expect(page).to have_content('ESA/ED')
                expect(page).to have_content('300 E Street Southwest')
                expect(page).to have_content('Room 203')
                expect(page).to have_content('Address line 3')
                expect(page).to have_content('Washington, DC 20546')
              end
              within '.card-body-aside' do
                expect(page).to have_content('1-4, M-W')
                expect(page).to have_link('Email', href: 'mailto:example5@example.com')
                expect(page).to have_link('Email', href: 'mailto:example6@example.com')
              end
            end
            within all('.card-body')[1] do
              expect(page).to have_content('Additional Address')
              expect(page).to have_content('8800 Greenbelt Road')
              expect(page).to have_content('Greenbelt, MD 20771')
            end
            within all('.card-body')[2] do
              expect(page).to have_content('Contact Details')
              expect(page).to have_content('Email only')
            end
            within all('.card-body')[3] do
              expect(page).to have_content('Related URL 1 Description')
              expect(page).to have_link('http://example.com/', href: 'http://example.com/')
              expect(page).to have_content('Home Page')
            end
          end
          within all('li.card')[3] do
            within '.card-header' do
              expect(page).to have_content('Group Name 2')
              expect(page).to have_content('User Services')
            end
            within all('.card-body')[0] do
              within '.card-body-details' do
                expect(page).to have_content('Group Name 2')
                expect(page).to have_content('ESA/ED')
                expect(page).to have_content('300 E Street Southwest')
                expect(page).to have_content('Room 203')
                expect(page).to have_content('Address line 3')
                expect(page).to have_content('Washington, DC 20546')
              end
              within '.card-body-aside' do
                expect(page).to have_content('9-5, M-F')
                expect(page).to have_link('Email', href: 'mailto:example7@example.com')
                expect(page).to have_link('Email', href: 'mailto:example8@example.com')
              end
            end
            within all('.card-body')[1] do
              expect(page).to have_content('Additional Address')
              expect(page).to have_content('8800 Greenbelt Road')
              expect(page).to have_content('Greenbelt, MD 20771')
            end
            within all('.card-body')[2] do
              expect(page).to have_content('Contact Details')
              expect(page).to have_content('Email only')
            end
            within all('.card-body')[3] do
              expect(page).to have_content('Related URL 1 Description')
              expect(page).to have_link('http://example.com/', href: 'http://example.com/')
              expect(page).to have_content('Home Page')
            end
          end
        end
      end
    end
  end
end
