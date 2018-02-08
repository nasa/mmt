require 'rails_helper'

describe 'Science and Ancillary Keywords Form Navigation', reset_provider: true, js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_service_draft_path(draft, 'science_and_ancillary_keywords')
    end

    it 'displays the correct title and description' do
      within '.umm-form' do
        expect(page).to have_content('Science Keywords')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('Science and Ancillary Keywords')
      end
    end

    it 'has 0 required fields' do
      expect(page).to have_selector('label.eui-required-o', count: 0)
    end

    it 'has the correct value selected in the `Save & Jump To` dropdown' do
      within '.nav-top' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_and_ancillary_keywords')
      end

      within '.nav-bottom' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_and_ancillary_keywords')
      end
    end

    context 'When clicking `Previous` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Previous'
        end
      end

      it 'saves the draft and loads the previous form' do
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

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Next'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Service Keywords')
        end

        within '.umm-form' do
          expect(page).to have_content('Service Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_keywords')
        end
      end
    end

    context 'When clicking `Save` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end
      end

      it 'saves the draft and reloads the form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Science and Ancillary Keywords')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_and_ancillary_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_and_ancillary_keywords')
        end
      end
    end

    context 'When selecting the next form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Service Keywords', from: 'Save & Jump To:'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Service Keywords')
        end

        within '.umm-form' do
          expect(page).to have_content('Service Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_keywords')
        end
      end
    end
  end

  context 'When viewing the form with stored values' do
    before do
      draft_service_science_and_ancillary_keywords = {
        'ScienceKeywords': [
          {
            'Category': 'EARTH SCIENCE',
            'Topic': 'SOLID EARTH',
            'Term': 'ROCKS/MINERALS/CRYSTALS',
            'VariableLevel1': 'SEDIMENTARY ROCKS',
            'VariableLevel2': 'SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES',
            'VariableLevel3': 'LUMINESCENCE'
          }
        ],
        'AncillaryKeywords': ['Ancillary keyword 1', 'Ancillary keyword 2']
      }
      draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first, draft: draft_service_science_and_ancillary_keywords)
      visit edit_service_draft_path(draft, 'science_and_ancillary_keywords')
      click_on 'Expand All'
    end

    it 'displays the correct values in the form' do
      expect(page).to have_content 'EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES > LUMINESCENCE'
      expect(page).to have_field 'service_draft_draft_ancillary_keywords_0', with: 'Ancillary keyword 1'
      expect(page).to have_field 'service_draft_draft_ancillary_keywords_1', with: 'Ancillary keyword 2'
    end

    context 'When clicking `Previous` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Previous'
        end
      end

      it 'saves the draft and loads the previous form' do
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

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Next'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Service Keywords')
        end

        within '.umm-form' do
          expect(page).to have_content('Service Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_keywords')
        end
      end
    end

    context 'When clicking `Save` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end

        click_on 'Expand All'
      end

      it 'saves the draft and reloads the form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Service Drafts')
          expect(page).to have_content('Science and Ancillary Keywords')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_and_ancillary_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_and_ancillary_keywords')
        end
      end

      it 'displays the correct values in the form' do
        expect(page).to have_content 'EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES > LUMINESCENCE'
        expect(page).to have_field 'service_draft_draft_ancillary_keywords_0', with: 'Ancillary keyword 1'
        expect(page).to have_field 'service_draft_draft_ancillary_keywords_1', with: 'Ancillary keyword 2'
      end
    end
  end
end
