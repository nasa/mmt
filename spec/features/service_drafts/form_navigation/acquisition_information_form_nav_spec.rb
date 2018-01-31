require 'rails_helper'

describe 'Acquisition Information Form Navigation', reset_provider: true, js: true do
  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
      visit edit_service_draft_path(draft, 'acquisition_information')
      click_on 'Expand All'
    end

    it 'displays the correct prompt value for all select elements' do
      within '.umm-form' do
        # TODO uncomment after adding controlled keywords to platforms/instruments
        # expect(page).to have_select('service_draft_draft_platforms_0_short_name', selected: 'Select a Short Name')
        # expect(page).to have_select('service_draft_draft_platforms_0_instruments_0_short_name', selected: 'Select a Short Name')
      end
    end

    it 'displays the correct title and description' do
      within '.umm-form' do
        # expect(page).to have_content('Acquisition Information')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('Acquisition Information')
      end
    end

    it 'has 0 required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end

    it 'has the correct value selected in the `Save & Jump To` dropdown' do
      within '.nav-top' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('acquisition_information')
      end

      within '.nav-bottom' do
        expect(find(:css, 'select[name=jump_to_section]').value).to eq('acquisition_information')
      end
    end

    # context 'When clicking `Previous` without making any changes' do
    #   before do
    #     within '.nav-top' do
    #       click_button 'Previous'
    #     end
    #   end
    #
    #   it 'saves the draft and loads the previous form' do
    #     within '.eui-banner--success' do
    #       expect(page).to have_content('Service Draft Updated Successfully!')
    #     end
    #
    #     within '.eui-breadcrumbs' do
    #       expect(page).to have_content('Service Drafts')
    #       expect(page).to have_content('Descriptive Keywords')
    #     end
    #
    #     within '.umm-form' do
    #       expect(page).to have_content('Descriptive Keywords')
    #     end
    #
    #     within '.nav-top' do
    #       expect(find(:css, 'select[name=jump_to_section]').value).to eq('descriptive_keywords')
    #     end
    #
    #     within '.nav-bottom' do
    #       expect(find(:css, 'select[name=jump_to_section]').value).to eq('descriptive_keywords')
    #     end
    #   end
    # end

    # context 'When clicking `Next` without making any changes' do
    #   before do
    #     within '.nav-top' do
    #       click_button 'Next'
    #     end
    #   end
    #
    #   it 'saves the draft and loads the next form' do
    #     within '.eui-banner--success' do
    #       expect(page).to have_content('Service Draft Updated Successfully!')
    #     end
    #
    #     within '.eui-breadcrumbs' do
    #       expect(page).to have_content('Service Drafts')
    #       expect(page).to have_content('Service Organizations')
    #     end
    #
    #     within '.umm-form' do
    #       expect(page).to have_content('Service Organizations')
    #     end
    #
    #     within '.nav-top' do
    #       expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_organizations')
    #     end
    #
    #     within '.nav-bottom' do
    #       expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_organizations')
    #     end
    #   end
    # end

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
          expect(page).to have_content('Acquisition Information')
        end

        within '.umm-form' do
          expect(page).to have_content('Platforms')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('acquisition_information')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('acquisition_information')
        end
      end
    end

    # context 'When selecting the next form from the navigation dropdown' do
    #   before do
    #     within '.nav-top' do
    #       select 'Service Organizations', from: 'Save & Jump To:'
    #     end
    #
    #     click_on 'Yes'
    #   end
    #
    #   it 'saves the draft and loads the next form' do
    #     within '.eui-banner--success' do
    #       expect(page).to have_content('Service Draft Updated Successfully!')
    #     end
    #
    #     within '.eui-breadcrumbs' do
    #       expect(page).to have_content('Service Drafts')
    #       expect(page).to have_content('Service Organizations')
    #     end
    #
    #     within '.umm-form' do
    #       expect(page).to have_content('Service Organizations')
    #     end
    #
    #     within '.nav-top' do
    #       expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_organizations')
    #     end
    #
    #     within '.nav-bottom' do
    #       expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_organizations')
    #     end
    #   end
    # end
  end

  context 'When viewing the form with stored values' do
    before do
      draft_descriptive_keywords = {
        'Platforms': [
          {
            'ShortName': 'Platform 1 Short Name',
            'LongName': 'Platform 1 Long Name',
            'Instruments': [
              {
                'ShortName': 'Instrument 1 Short Name',
                'LongName': 'Instrument 1 Long Name'
              },
              {
                'ShortName': 'Instrument 2 Short Name',
                'LongName': 'Instrument 2 Long Name'
              }
            ]
          },
          {
            'ShortName': 'Platform 2 Short Name',
            'LongName': 'Platform 2 Long Name',
            'Instruments': [
              {
                'ShortName': 'Instrument 3 Short Name'
              }
            ]
          }
        ]
      }
      draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first, draft: draft_descriptive_keywords)
      visit edit_service_draft_path(draft, 'acquisition_information')
      click_on 'Expand All'
    end

    it 'displays the correct values in the form' do
      expect(page).to have_field('service_draft_draft_platforms_0_short_name', with: 'Platform 1 Short Name')
      expect(page).to have_field('service_draft_draft_platforms_0_long_name', with: 'Platform 1 Long Name')
      expect(page).to have_field('service_draft_draft_platforms_0_instruments_0_short_name', with: 'Instrument 1 Short Name')
      expect(page).to have_field('service_draft_draft_platforms_0_instruments_0_long_name', with: 'Instrument 1 Long Name')
      expect(page).to have_field('service_draft_draft_platforms_0_instruments_1_short_name', with: 'Instrument 2 Short Name')
      expect(page).to have_field('service_draft_draft_platforms_0_instruments_1_long_name', with: 'Instrument 2 Long Name')

      expect(page).to have_field('service_draft_draft_platforms_1_short_name', with: 'Platform 2 Short Name')
      expect(page).to have_field('service_draft_draft_platforms_1_long_name', with: 'Platform 2 Long Name')
      expect(page).to have_field('service_draft_draft_platforms_1_instruments_0_short_name', with: 'Instrument 3 Short Name')
    end

    # context 'When clicking `Previous` without making any changes' do
    #   before do
    #     within '.nav-top' do
    #       click_button 'Previous'
    #     end
    #   end
    #
    #   it 'saves the draft and loads the previous form' do
    #     within '.eui-banner--success' do
    #       expect(page).to have_content('Service Draft Updated Successfully!')
    #     end
    #
    #     within '.eui-breadcrumbs' do
    #       expect(page).to have_content('Service Drafts')
    #       expect(page).to have_content('Descriptive Keywords')
    #     end
    #
    #     within '.umm-form' do
    #       expect(page).to have_content('Descriptive Keywords')
    #     end
    #
    #     within '.nav-top' do
    #       expect(find(:css, 'select[name=jump_to_section]').value).to eq('descriptive_keywords')
    #     end
    #
    #     within '.nav-bottom' do
    #       expect(find(:css, 'select[name=jump_to_section]').value).to eq('descriptive_keywords')
    #     end
    #   end
    # end

    # context 'When clicking `Next` without making any changes' do
    #   before do
    #     within '.nav-top' do
    #       click_button 'Next'
    #     end
    #   end
    #
    #   it 'saves the draft and loads the next form' do
    #     within '.eui-banner--success' do
    #       expect(page).to have_content('Service Draft Updated Successfully!')
    #     end
    #
    #     within '.eui-breadcrumbs' do
    #       expect(page).to have_content('Service Drafts')
    #       expect(page).to have_content('Service Organizations')
    #     end
    #
    #     within '.umm-form' do
    #       expect(page).to have_content('Service Organizations')
    #     end
    #
    #     within '.nav-top' do
    #       expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_organizations')
    #     end
    #
    #     within '.nav-bottom' do
    #       expect(find(:css, 'select[name=jump_to_section]').value).to eq('service_organizations')
    #     end
    #   end
    # end

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
          expect(page).to have_content('Acquisition Information')
        end

        within '.umm-form' do
          expect(page).to have_content('Platforms')
        end

        within '.nav-top' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('acquisition_information')
        end

        within '.nav-bottom' do
          expect(find(:css, 'select[name=jump_to_section]').value).to eq('acquisition_information')
        end
      end

      it 'displays the correct values in the form' do
        expect(page).to have_field('service_draft_draft_platforms_0_short_name', with: 'Platform 1 Short Name')
        expect(page).to have_field('service_draft_draft_platforms_0_long_name', with: 'Platform 1 Long Name')
        expect(page).to have_field('service_draft_draft_platforms_0_instruments_0_short_name', with: 'Instrument 1 Short Name')
        expect(page).to have_field('service_draft_draft_platforms_0_instruments_0_long_name', with: 'Instrument 1 Long Name')
        expect(page).to have_field('service_draft_draft_platforms_0_instruments_1_short_name', with: 'Instrument 2 Short Name')
        expect(page).to have_field('service_draft_draft_platforms_0_instruments_1_long_name', with: 'Instrument 2 Long Name')

        expect(page).to have_field('service_draft_draft_platforms_1_short_name', with: 'Platform 2 Short Name')
        expect(page).to have_field('service_draft_draft_platforms_1_long_name', with: 'Platform 2 Long Name')
        expect(page).to have_field('service_draft_draft_platforms_1_instruments_0_short_name', with: 'Instrument 3 Short Name')
      end
    end
  end
end
