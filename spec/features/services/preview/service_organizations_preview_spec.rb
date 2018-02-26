require 'rails_helper'

describe 'Valid Service Service Organizations Preview', reset_provider: true do
  before do
    login
    ingest_response, _concept_response = publish_service_draft
    visit service_path(ingest_response['concept-id'])
  end

  context 'When examing the Service Organizations section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.service_organizations' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#service_service_organizations_preview' do
          expect(page).to have_css('h5', text: 'Service Organizations')

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
end
