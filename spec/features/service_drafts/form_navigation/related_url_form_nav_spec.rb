require 'rails_helper'

describe 'Service Related URL Form Navigation', reset_provider: true, js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_service_draft_path(draft, 'related_url')
    end

    it 'displays the correct title and description' do
      within '.umm-form' do
        expect(page).to have_content('Related URL')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('Related URL')
      end
    end

    it 'has 3 required fields' do
      expect(page).to have_selector('label.eui-required-o', count: 3)
    end

    it 'has the correct value selected in the `Save & Jump To` dropdown' do
      within '.nav-top' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('related_url')
      end

      within '.nav-bottom' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('related_url')
      end
    end

    context 'When clicking `Previous` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Previous'
        end

        click_on 'Yes'
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Service Identification')
        end

        within '.umm-form' do
          expect(page).to have_content('Service Quality')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_identification')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_identification')
        end
      end
    end

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Next'
        end

        click_on 'Yes'
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Descriptive Keywords')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('descriptive_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('descriptive_keywords')
        end
      end
    end

    context 'When clicking `Save` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end

        click_on 'Yes'
      end

      it 'saves the draft and reloads the form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Related URL')
        end

        within '.umm-form' do
          expect(page).to have_content('Related URL')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('related_url')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('related_url')
        end
      end
    end

    context 'When selecting the next form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Descriptive Keywords', from: 'Save & Jump To:'
        end

        click_on 'Yes'
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Descriptive Keywords')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('descriptive_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('descriptive_keywords')
        end
      end
    end
  end

  context 'When viewing the form with stored values' do
    before do
      draft_service_related_url = {
        'RelatedURL': {
          'Description': 'Test related url',
          'URLContentType': 'DistributionURL',
          'Type': 'GET SERVICE',
          'Subtype': 'SOFTWARE PACKAGE',
          'URL': 'nasa.gov',
          'GetService': {
            'MimeType': 'application/json',
            'Protocol': 'HTTP',
            'FullName': 'Test Service',
            'DataID': 'Test data',
            'DataType': 'Test data type',
            'URI': ['Test URI 1', 'Test URI 2']
          }
        }
      }
      draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first, draft: draft_service_related_url)
      visit edit_service_draft_path(draft, 'related_url')
    end

    it 'displays the correct values in the form' do
      expect(page).to have_field('service_draft_draft_related_url_description', with: 'Test related url')
      expect(page).to have_field('service_draft_draft_related_url_url_content_type', with: 'DistributionURL')
      expect(page).to have_field('service_draft_draft_related_url_type', with: 'GET SERVICE')
      expect(page).to have_field('service_draft_draft_related_url_subtype', with: 'SOFTWARE PACKAGE')
      expect(page).to have_field('service_draft_draft_related_url_url', with: 'nasa.gov')
      expect(page).to have_field('service_draft_draft_related_url_get_service_mime_type', with: 'application/json')
      expect(page).to have_field('service_draft_draft_related_url_get_service_protocol', with: 'HTTP')
      expect(page).to have_field('service_draft_draft_related_url_get_service_full_name', with: 'Test Service')
      expect(page).to have_field('service_draft_draft_related_url_get_service_data_id', with: 'Test data')
      expect(page).to have_field('service_draft_draft_related_url_get_service_data_type', with: 'Test data type')
      expect(page).to have_field('service_draft_draft_related_url_get_service_uri_0', with: 'Test URI 1')
      expect(page).to have_field('service_draft_draft_related_url_get_service_uri_1', with: 'Test URI 2')
    end

    context 'When clicking `Previous` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Previous'
        end

        # TODO validation isn't working correctly
        click_on 'Yes'
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Service Identification')
        end

        within '.umm-form' do
          expect(page).to have_content('Service Quality')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_identification')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_identification')
        end
      end
    end

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Next'
        end

        # TODO validation isn't working correctly
        click_on 'Yes'
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Descriptive Keywords')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('descriptive_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('descriptive_keywords')
        end
      end
    end

    context 'When clicking `Save` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end

        # TODO validation isn't working correctly
        click_on 'Yes'
      end

      it 'saves the draft and reloads the form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Related URL')
        end

        within '.umm-form' do
          expect(page).to have_content('Related URL')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('related_url')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('related_url')
        end
      end

      it 'displays the correct values in the form' do
        expect(page).to have_field('service_draft_draft_related_url_description', with: 'Test related url')
        expect(page).to have_field('service_draft_draft_related_url_url_content_type', with: 'DistributionURL')
        expect(page).to have_field('service_draft_draft_related_url_type', with: 'GET SERVICE')
        expect(page).to have_field('service_draft_draft_related_url_subtype', with: 'SOFTWARE PACKAGE')
        expect(page).to have_field('service_draft_draft_related_url_url', with: 'nasa.gov')
        expect(page).to have_field('service_draft_draft_related_url_get_service_mime_type', with: 'application/json')
        expect(page).to have_field('service_draft_draft_related_url_get_service_protocol', with: 'HTTP')
        expect(page).to have_field('service_draft_draft_related_url_get_service_full_name', with: 'Test Service')
        expect(page).to have_field('service_draft_draft_related_url_get_service_data_id', with: 'Test data')
        expect(page).to have_field('service_draft_draft_related_url_get_service_data_type', with: 'Test data type')
        expect(page).to have_field('service_draft_draft_related_url_get_service_uri_0', with: 'Test URI 1')
        expect(page).to have_field('service_draft_draft_related_url_get_service_uri_1', with: 'Test URI 2')
      end
    end
  end
end
