require 'rails_helper'

describe 'Data Contacts preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
        visit draft_path(draft)
      end

      it 'does not display metadata' do
        expect(page).to have_content('There are no listed data contacts for this collection.')
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)

        visit draft_path(draft)
      end

      it 'displays the metadata' do
        within '.data-contacts-cards' do
          within all('li.card')[0] do
            within '.card-header' do
              expect(page).to have_content('First Name')
              expect(page).to have_content('Multiple Roles')
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
              expect(page).to have_link('http://example.com', href: 'http://example.com')
              expect(page).to have_link('http://another-example.com', href: 'http://another-example.com')
              expect(page).to have_link('http://example.com/1', href: 'http://example.com/1')
            end
          end
          within all('li.card')[1] do
            within '.card-header' do
              expect(page).to have_content('Group Name')
              expect(page).to have_content('Multiple Roles')
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
              expect(page).to have_link('http://example.com', href: 'http://example.com')
              expect(page).to have_link('http://another-example.com', href: 'http://another-example.com')
              expect(page).to have_link('http://example.com/1', href: 'http://example.com/1')
            end
          end
          within all('li.card')[2] do
            within '.card-header' do
              expect(page).to have_content('First Name 3')
              expect(page).to have_content('Multiple Roles')
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
              expect(page).to have_link('http://example.com', href: 'http://example.com')
              expect(page).to have_link('http://another-example.com', href: 'http://another-example.com')
              expect(page).to have_link('http://example.com/1', href: 'http://example.com/1')
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
              expect(page).to have_link('http://example.com', href: 'http://example.com')
              expect(page).to have_link('http://another-example.com', href: 'http://another-example.com')
              expect(page).to have_link('http://example.com/1', href: 'http://example.com/1')
            end
          end
        end
      end
    end

    context 'when Data Contacts metadata has incomplete information' do
      before do
        login
        draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
      end

      context 'when Data Contacts metadata has no name or address' do
        before do
          draft = Draft.first
          draft.draft['ContactPersons'] = [{'ContactInformation'=>{'ContactMechanisms'=>[{'Type'=>'Direct Line', 'Value'=>'555-1212'}, {'Type'=>'Email', 'Value'=>'example@example.com'}]}}]
          draft.save

          visit draft_path(draft)
        end

        it 'does not display name information in the card header' do
          within '.data-contacts-cards' do
            expect(page.find('.card-header').text).to eq('')
          end
        end

        it 'displays the other entered metadata' do
          within '.data-contacts-cards .card-body.active .card-body-aside' do
            expect(page).to have_content('555-1212')
            expect(page).to have_link('Email', href: 'mailto:example@example.com')
          end
        end
      end

      context 'when Data Contacts metadata has Role information only' do
        before do
          draft = Draft.first
          draft.draft['ContactPersons'] = [{"Roles"=>["Science Contact"]}]
          draft.save

          visit draft_path(draft)
        end

        it 'displays the owner badge on the data contact preview card' do
          within '.data-contacts-cards .card-header' do
            expect(page).to have_css('.card-header-badge')
            expect(page).to have_content('Science Contact')
          end
        end

        it 'displays the no addresses and no contacts added messages' do
          within '.data-contacts-cards .card-body-details' do
            expect(page).to have_content('This contact does not have any addresses listed.')
          end
          within '.data-contacts-cards .card-body-aside' do
            expect(page).to have_content('This contact does not have any contact mechanisms listed.')
          end
        end
      end
    end
  end
end
