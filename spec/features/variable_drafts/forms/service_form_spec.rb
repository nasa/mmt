require 'rails_helper'

describe 'Service Form', reset_provider: true, js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_variable_draft_path(draft, 'service')
    end

    it 'displays the correct title and description' do
      expect(page).to have_content('Services')
      expect(page).to have_content('The service information of a variable.')
    end

    it 'displays a button to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Service')
    end

    it 'has no required fields' do
      expect(page).not_to have_selector('label.eui-required-o')
    end

    it 'has the correct value selected in the `Save & Jump To` dropdown' do
      within '.nav-top' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('service')
      end

      within '.nav-bottom' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('service')
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
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
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
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Set')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('set')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('set')
        end
      end
    end

    context 'When clicking `Save` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Service')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service')
        end
      end
    end

    context 'When selecting the previous form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Science Keywords', from: 'Save & Jump To:'
        end
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Science Keywords')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end
      end
    end

    context 'When selecting the next form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Set', from: 'Save & Jump To:'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Set')
        end

        within '.umm-form' do
          expect(page).to have_content('Set')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('set')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('set')
        end
      end
    end
  end

  context 'When viewing the form with 1 stored value' do
    before do
      draft_fill_values = [{
        'ServiceType': %w[ESI WCS],
        'Visualizable': true,
        'Subsettable': false
      }]
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first, draft: { 'Service': draft_fill_values })
      visit edit_variable_draft_path(draft, 'service')
    end

    it 'displays one populated form' do
      expect(page).to have_css('.multiple-item', count: 1)
    end

    it 'displays the correct values in the form' do
      expect(page).to have_select('variable_draft_draft_service_0_service_type', selected: %w[ESI WCS])

      expect(page).to have_checked_field('variable_draft_draft_service_0_visualizable_true')
      expect(page).to have_checked_field('variable_draft_draft_service_0_subsettable_false')
    end

    context 'When clicking `Previous` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Previous'
        end
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
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
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Set')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('set')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('set')
        end
      end
    end

    context 'When clicking `Save` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Service')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service')
        end
      end
    end
  end

  context 'When viewing the form with 2 stored values' do
    before do
      draft_fill_values = [{
        'ServiceType': %w[WMS],
        'Visualizable': false,
        'Subsettable': false
      }, {
        'ServiceType': %w[OPeNDAP],
        'Visualizable': true,
        'Subsettable': true
      }]
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first, draft: { 'Service': draft_fill_values })
      visit edit_variable_draft_path(draft, 'service')
    end

    it 'displays two populated form' do
      expect(page).to have_css('.multiple-item', count: 2)
    end

    it 'displays the correct values in the form' do
      expect(page).to have_select('variable_draft_draft_service_0_service_type', selected: %w[WMS])
      expect(page).to have_checked_field('variable_draft_draft_service_0_visualizable_false')
      expect(page).to have_checked_field('variable_draft_draft_service_0_subsettable_false')

      expect(page).to have_select('variable_draft_draft_service_1_service_type', selected: %w[OPeNDAP])
      expect(page).to have_checked_field('variable_draft_draft_service_1_visualizable_true')
      expect(page).to have_checked_field('variable_draft_draft_service_1_subsettable_true')
    end

    context 'When clicking `Previous` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Previous'
        end
      end

      it 'saves the draft and loads the previous form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Science Keywords')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('science_keywords')
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
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Set')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('set')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('set')
        end
      end
    end

    context 'When clicking `Save` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.umm-form' do
          expect(page).to have_content('Service')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('service')
        end
      end
    end
  end
end
