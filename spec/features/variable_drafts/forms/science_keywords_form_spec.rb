require 'rails_helper'

describe 'Science Keywords Form', js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_variable_draft_path(draft, 'science_keywords')
    end

    it 'displays the correct title and description' do
      within '.umm-form' do
        expect(page).to have_content('Science Keywords')
        expect(page).to have_content('Controlled Science Keywords describing the measurements/variables.  The controlled vocabulary for Science Keywords is maintained in the Keyword Management System (KMS).')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variable Drafts')
        expect(page).to have_content('Science Keywords')
      end
    end

    it 'has 1 required fields' do
      expect(page).to have_selector('label.eui-required-o', count: 1)
    end

    it 'displays the nested item picker' do
      expect(page).to have_css('div.eui-nested-item-picker')
    end

    it 'does not list any selected science keywords' do
      within '.selected-science-keywords ul' do
        expect(page).to have_no_css('li')
      end
    end

    context 'When clicking `Previous` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Previous'
        end
      end

      it 'displays a modal with a prompt about saving invalid data' do
        expect(page).to have_content('This page has invalid data. Are you sure you want to save it and proceed?')
      end

      context 'when choosing not to proceed' do
        before do
          within '#invalid-draft-modal' do
            click_on 'No'
          end
        end

        it 'displays the correct error messages at the top of the page' do
          within '#umm-form-errors' do
            expect(page).to have_content('Science Keywords is required')
          end
        end

        it 'displays the correct error messages under the form elements' do
          within '#variable_draft_draft_science_keywords-error' do
            expect(page).to have_content('Science Keywords is required')
          end
        end
      end

      context 'When choosing to proceed' do
        before do
          within '#invalid-draft-modal' do
            click_on 'Yes'
          end
        end

        it 'saves the draft and loads the previous form' do
          within '.eui-banner--success' do
            expect(page).to have_content('Variable Draft Updated Successfully!')
          end

          within '.eui-breadcrumbs' do
            expect(page).to have_content('Variable Drafts')
            expect(page).to have_content('Variable Characteristics')
          end

          within '.umm-form' do
            expect(page).to have_content('Variable Characteristics')
          end

          within '.nav-top' do
            expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_characteristics')
          end

          within '.nav-bottom' do
            expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_characteristics')
          end
        end
      end
    end

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_on 'Next'
        end
      end

      it 'displays a modal with a prompt about saving invalid data' do
        expect(page).to have_content('This page has invalid data. Are you sure you want to save it and proceed?')
      end

      context 'when choosing not to proceed' do
        before do
          within '#invalid-draft-modal' do
            click_on 'No'
          end
        end

        it 'displays the correct error messages at the top of the page' do
          within '#umm-form-errors' do
            expect(page).to have_content('Science Keywords is required')
          end
        end

        it 'displays the correct error messages under the form elements' do
          within '#variable_draft_draft_science_keywords-error' do
            expect(page).to have_content('Science Keywords is required')
          end
        end
      end

      context 'When choosing to proceed' do
        before do
          within '#invalid-draft-modal' do
            click_on 'Yes'
          end

          it 'saves the draft and loads the next form' do
            within '.eui-banner--success' do
              expect(page).to have_content('Variable Draft Updated Successfully!')
            end

            within '.eui-breadcrumbs' do
              expect(page).to have_content('Variable Drafts')
              expect(page).to have_content('Service')
            end

            within '.umm-form' do
              expect(page).to have_content('Service')
            end

            within '.nav-top' do
              expect(find(:css, 'select[name=jump_to_section]').value).to eq('services')
            end

            within '.nav-bottom' do
              expect(find(:css, 'select[name=jump_to_section]').value).to eq('services')
            end
          end
        end
      end
    end

    context 'When clicking `Save` without making any changes' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end
      end

      it 'displays a modal with a prompt about saving invalid data' do
        expect(page).to have_content('This page has invalid data. Are you sure you want to save it and proceed?')
      end

      context 'when choosing not to proceed' do
        before do
          within '#invalid-draft-modal' do
            click_on 'No'
          end
        end

        it 'displays the correct error messages at the top of the page' do
          within '#umm-form-errors' do
            expect(page).to have_content('Science Keywords is required')
          end
        end

        it 'displays the correct error messages under the form elements' do
          within '#variable_draft_draft_science_keywords-error' do
            expect(page).to have_content('Science Keywords is required')
          end
        end
      end

      context 'When choosing to proceed' do
        before do
          within '#invalid-draft-modal' do
            click_on 'Yes'
          end

          it 'saves the draft and reloads the form' do
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
      end
    end

    context 'When selecting the previous form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Variable Characteristics', from: 'Save & Jump To:'
        end
      end

      it 'displays a modal with a prompt about saving invalid data' do
        expect(page).to have_content('This page has invalid data. Are you sure you want to save it and proceed?')
      end

      context 'when choosing not to proceed' do
        before do
          within '#invalid-draft-modal' do
            click_on 'No'
          end
        end

        it 'displays the correct error messages at the top of the page' do
          within '#umm-form-errors' do
            expect(page).to have_content('Science Keywords is required')
          end
        end

        it 'displays the correct error messages under the form elements' do
          within '#variable_draft_draft_science_keywords-error' do
            expect(page).to have_content('Science Keywords is required')
          end
        end
      end

      context 'When choosing to proceed' do
        before do
          within '#invalid-draft-modal' do
            click_on 'Yes'
          end

          it 'saves the draft and loads the previous form' do
            within '.eui-banner--success' do
              expect(page).to have_content('Variable Draft Updated Successfully!')
            end

            within '.eui-breadcrumbs' do
              expect(page).to have_content('Variable Drafts')
              expect(page).to have_content('Variable Characteristics')
            end

            within '.umm-form' do
              expect(page).to have_content('Variable Characteristics')
            end

            within '.nav-top' do
              expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_characteristics')
            end

            within '.nav-bottom' do
              expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_characteristics')
            end
          end
        end
      end
    end

    context 'When selecting the next form from the navigation dropdown' do
      before do
        within '.nav-top' do
          select 'Services', from: 'Save & Jump To:'
        end
      end

      it 'displays a modal with a prompt about saving invalid data' do
        expect(page).to have_content('This page has invalid data. Are you sure you want to save it and proceed?')
      end

      context 'when choosing not to proceed' do
        before do
          within '#invalid-draft-modal' do
            click_on 'No'
          end
        end

        it 'displays the correct error messages at the top of the page' do
          within '#umm-form-errors' do
            expect(page).to have_content('Science Keywords is required')
          end
        end

        it 'displays the correct error messages under the form elements' do
          within '#variable_draft_draft_science_keywords-error' do
            expect(page).to have_content('Science Keywords is required')
          end
        end
      end

      context 'When choosing to proceed' do
        before do
          within '#invalid-draft-modal' do
            click_on 'Yes'
          end

          it 'saves the draft and loads the next form' do
            within '.eui-banner--success' do
              expect(page).to have_content('Variable Draft Updated Successfully!')
            end

            within '.eui-breadcrumbs' do
              expect(page).to have_content('Variable Drafts')
              expect(page).to have_content('Service')
            end

            within '.umm-form' do
              expect(page).to have_content('Service')
            end

            within '.nav-top' do
              expect(find(:css, 'select[name=jump_to_section]').value).to eq('services')
            end

            within '.nav-bottom' do
              expect(find(:css, 'select[name=jump_to_section]').value).to eq('services')
            end
          end
        end
      end
    end
  end

  context 'When viewing the form with 1 stored value' do
    before do
      draft_science_keywords = [{
        'Category': 'EARTH SCIENCE SERVICES',
        'Topic': 'DATA ANALYSIS AND VISUALIZATION',
        'Term': 'GEOGRAPHIC INFORMATION SYSTEMS'
      }]
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first, draft: { 'ScienceKeywords': draft_science_keywords })
      visit edit_variable_draft_path(draft, 'science_keywords')
    end

    it 'displays one selected science keyword' do
      expect(page).to have_css('.selected-science-keywords ul > li', count: 1)
    end

    it 'displays the correct selected science keyword value' do
      within '.selected-science-keywords' do
        expect(page).to have_content('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS')
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

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Variable Characteristics')
        end

        within '.umm-form' do
          expect(page).to have_content('Variable Characteristics')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_characteristics')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_characteristics')
        end
      end
    end

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_on 'Next'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Services')
        end

        within '.umm-form' do
          expect(page).to have_content('Services')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('services')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('services')
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

      it 'displays the correct selected science keyword value' do
        within '.selected-science-keywords' do
          expect(page).to have_content('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS')
        end
      end
    end
  end

  context 'When viewing the form with 2 stored values' do
    before do
      draft_science_keywords = [{
        'Category': 'EARTH SCIENCE SERVICES',
        'Topic': 'DATA ANALYSIS AND VISUALIZATION',
        'Term': 'GEOGRAPHIC INFORMATION SYSTEMS'
      }, {
        'Category': 'EARTH SCIENCE',
        'Topic': 'ATMOSPHERE',
        'Term': 'ATMOSPHERIC TEMPERATURE'
      }]
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first, draft: { 'ScienceKeywords': draft_science_keywords})
      visit edit_variable_draft_path(draft, 'science_keywords')
    end

    it 'displays 2 selected science keywords' do
      expect(page).to have_css('.selected-science-keywords ul > li', count: 2)
    end

    it 'displays the correct selected science keyword values' do
      within '.selected-science-keywords' do
        expect(page).to have_content('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS')
        expect(page).to have_content('EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC TEMPERATURE')
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

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Variable Characteristics')
        end

        within '.umm-form' do
          expect(page).to have_content('Variable Characteristics')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_characteristics')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('variable_characteristics')
        end
      end
    end

    context 'When clicking `Next` without making any changes' do
      before do
        within '.nav-top' do
          click_on 'Next'
        end
      end

      it 'saves the draft and loads the next form' do
        within '.eui-banner--success' do
          expect(page).to have_content('Variable Draft Updated Successfully!')
        end

        within '.eui-breadcrumbs' do
          expect(page).to have_content('Variable Drafts')
          expect(page).to have_content('Services')
        end

        within '.umm-form' do
          expect(page).to have_content('Services')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('services')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('services')
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

      it 'displays the correct selected science keyword values' do
        within '.selected-science-keywords' do
          expect(page).to have_content('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS')
          expect(page).to have_content('EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC TEMPERATURE')
        end
      end
    end
  end
end
