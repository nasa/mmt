require 'rails_helper'

describe 'Valid Service Draft Service Organizations Preview' do
  let(:service_draft) { create(:full_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examing the Service Organizations section' do
    it 'displays the form title as an edit link' do
      within '#service_organizations-progress' do
        expect(page).to have_link('Service Organizations', href: edit_service_draft_path(service_draft, 'service_organizations'))
      end
    end
  end

  it 'displays the corrent status icon' do
    within '#service_organizations-progress' do
      within '.status' do
        expect(page).to have_content('Service Organizations is valid')
      end
    end
  end

  it 'displays the correct progress indicators for required fields' do
    within '#service_organizations-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-required.icon-green.service-organizations')
    end
  end

  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_organizations' do
      expect(page).to have_css('.umm-preview-field-container', count: 1)

      within '#service_draft_draft_service_organizations_preview' do
        expect(page).to have_css('h5', text: 'Service Organizations')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_organizations', anchor: 'service_draft_draft_service_organizations'))

        within '.service-organizations-cards' do
          within all('li.card')[0] do
            within '.card-header' do
              expect(page).to have_content('AARHUS-HYDRO')
              expect(page).to have_content('Multiple RolesDEVELOPERPUBLISHER')
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
              expect(page).to have_content('Related URL 1 Description')
              expect(page).to have_link('http://example.com/', href: 'http://example.com/')
              expect(page).to have_content('DATA SET LANDING PAGE')
            end
            within all('.card-body')[4] do
              expect(page).to have_content('Related URL 2 Description')
              expect(page).to have_link('https://example.com/', href: 'https://example.com/')
              expect(page).to have_content('GET SERVICEDIF')
            end
            within all('.card-body')[5] do
              expect(page).to have_content('Related URL 3 Description')
              expect(page).to have_link('https://search.earthdata.nasa.gov/', href: 'https://search.earthdata.nasa.gov/')
              expect(page).to have_content('GET DATAEARTHDATA SEARCH')
            end
          end
        end
      end
    end
  end
end
