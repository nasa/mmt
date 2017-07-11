require 'rails_helper'

describe 'Data Centers preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end

      it 'does not display metadata' do
        expect(page).to have_content('There are no listed data centers for this collection.')
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)

        visit collection_draft_path(draft)
      end

      it 'displays the metadata' do
        within '.data-centers-cards' do
          within all('li.card')[0] do
            within '.card-header' do
              expect(page).to have_content('AARHUS-HYDRO')
              expect(page).to have_content('ARCHIVER')
            end
            within all('.card-body')[0] do
              within '.card-body-details' do
                expect(page).to have_content('Hydrogeophysics Group, Aarhus University')
                expect(page).to have_content('300 E Street Southwest')
                expect(page).to have_content('Room 203')
                expect(page).to have_content('Address line 3')
                expect(page).to have_content('Washington, DC 20546')
              end
              within '.card-body-aside' do
                expect(page).to have_content('9-6, M-F')
                expect(page).to have_link('Email', href: 'mailto:example@example.com')
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
              expect(page).to have_link('http://example.com/', href: 'http://example.com/')
            end
          end
          within all('li.card')[1] do
            within '.card-header' do
              expect(page).to have_content('ESA/ED')
              expect(page).to have_content('Multiple Roles ORIGINATOR DISTRIBUTOR')
            end
            within all('.card-body')[0] do
              within '.card-body-details' do
                expect(page).to have_content('Educational Office, Ecological Society of America')
                expect(page).to have_content('300 E Street Southwest')
                expect(page).to have_content('Room 203')
                expect(page).to have_content('Address line 3')
                expect(page).to have_content('Washington, DC 20546')
              end
              within '.card-body-aside' do
                expect(page).to have_content('10-2, M-W')
                expect(page).to have_link('Email', href: 'mailto:example@example.com')
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
              expect(page).to have_link('http://example.com/', href: 'http://example.com/')
            end
          end
        end
      end
    end
  end
end
