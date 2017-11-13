require 'rails_helper'

describe 'Bulk updates form validations', reset_provider: true, js: true do
  before :all do
    _ingest_response, @concept_response = publish_collection_draft
  end

  before do
    login

    visit new_bulk_updates_search_path
    select 'Entry Title', from: 'Search Field'
    fill_in 'query_text', with: @concept_response.body['EntryTitle']
    click_button 'Submit'

    # Select search results
    check 'checkall'
    click_on 'Next'
  end

  context 'when viewing the data centers form' do
    before do
      select 'Data Centers', from: 'Field to Update'
    end

    context 'when viewing the Find & Remove form' do
      before do
        select 'Find & Remove'
      end

      context 'when submitting an empty form' do
        before do
          click_on 'Preview'
        end

        it 'does not let the user submit the form without required fields' do
          expect(page).to have_css('#find_value_ShortName-error', text: 'This field is required.')
        end
      end

      context 'when leaving a required field with no text' do
        before do
          find('#find_value_ShortName').click
          find('#update_type').click
        end

        it 'displays a required field error' do
          expect(page).to have_css('#find_value_ShortName-error', text: 'This field is required.')
        end
      end
    end

    context 'when viewing the Find & Update form' do
      before do
        select 'Find & Update'
      end

      context 'when submitting an empty form' do
        before do
          click_on 'Preview'
        end

        it 'does not let the user submit the form without required fields' do
          expect(page).to have_css('#find_value_ShortName-error', text: 'This field is required.')
          expect(page).to have_css('#update_value_short_name-error', text: 'This field is required.')
        end
      end

      context 'when leaving a required field with no text' do
        before do
          find('#find_value_ShortName').click
          find('#update_type').click
        end

        it 'displays a required field error' do
          expect(page).to have_css('#find_value_ShortName-error', text: 'This field is required.')
        end
      end
    end
  end

  context 'when viewing the platforms form' do
    before do
      select 'Platforms', from: 'Field to Update'
    end

    context 'when viewing the Find & Remove form' do
      before do
        select 'Find & Remove'
      end

      context 'when submitting an empty form' do
        before do
          click_on 'Preview'
        end

        it 'does not let the user submit the form without required fields' do
          expect(page).to have_css('#find_value_ShortName-error', text: 'This field is required.')
        end
      end

      context 'when leaving a required field with no text' do
        before do
          find('#find_value_ShortName').click
          find('#update_type').click
        end

        it 'displays a required field error' do
          expect(page).to have_css('#find_value_ShortName-error', text: 'This field is required.')
        end
      end
    end

    context 'when viewing the Find & Update form' do
      before do
        select 'Find & Update'
      end

      context 'when submitting an empty form' do
        before do
          click_on 'Preview'
        end

        it 'does not let the user submit the form without required fields' do
          expect(page).to have_css('#find_value_ShortName-error', text: 'This field is required.')
          expect(page).to have_css('#update_value_short_name-error', text: 'This field is required.')
        end
      end

      context 'when leaving a required field with no text' do
        before do
          find('#find_value_ShortName').click
          find('#update_type').click
        end

        it 'displays a required field error' do
          expect(page).to have_css('#find_value_ShortName-error', text: 'This field is required.')
        end
      end
    end
  end

  context 'when viewing the science keywords form' do
    before do
      select 'Science Keywords', from: 'Field to Update'
    end

    context 'when viewing the Add to Existing form' do
      before do
        select 'Add to Existing'
        click_on 'Preview'
      end

      it 'does not let the user submit the form without required fields' do
        expect(page).to have_css('#science_keyword_value-error', text: 'A valid science keyword must be specified.')
      end
    end

    context 'when viewing the clear all and replace form' do
      before do
        select 'Clear All & Replace'
        click_on 'Preview'
      end

      it 'does not let the user submit the form without required fields' do
        expect(page).to have_css('#science_keyword_value-error', text: 'A valid science keyword must be specified.')
      end
    end

    context 'when viewing the Find & Remove form' do
      before do
        select 'Find & Remove'
      end

      context 'when submitting an empty form' do
        before do
          click_on 'Preview'
        end

        it 'does not let the user submit the form without required fields' do
          expect(page).to have_css('#science_keyword_find-error', text: 'At least one keyword level must be specified.')
        end
      end

      context 'when leaving a required field with no selection' do
        before do
          select 'EARTH SCIENCE SERVICES', from: 'Category'
          select 'Select a Category', from: 'Category'
        end

        it 'displays a required field error' do
          expect(page).to have_css('#science_keyword_find-error', text: 'At least one keyword level must be specified.')
        end
      end
    end

    context 'when viewing the Find & Replace form' do
      before do
        select 'Find & Replace'
      end

      context 'when submitting an empty form' do
        before do
          click_on 'Preview'
        end

        it 'does not let the user submit the form without required fields' do
          expect(page).to have_css('#science_keyword_find-error', text: 'At least one keyword level must be specified.')
          expect(page).to have_css('#science_keyword_value-error', text: 'A valid science keyword must be specified.')
        end
      end

      context 'when leaving a required field with no selection' do
        before do
          select 'EARTH SCIENCE SERVICES', from: 'Category'
          select 'Select a Category', from: 'Category'
        end

        it 'displays a required field error' do
          expect(page).to have_css('#science_keyword_find-error', text: 'At least one keyword level must be specified.')
        end
      end
    end
  end

  context 'when viewing the location keywords form' do
    before do
      select 'Location Keywords', from: 'Field to Update'
    end

    context 'when viewing the Add to Existing form' do
      before do
        select 'Add to Existing'
        click_on 'Preview'
      end

      it 'does not let the user submit the form without required fields' do
        expect(page).to have_css('#location_keyword_value-error', text: 'A valid location keyword must be specified.')
      end
    end

    context 'when viewing the clear all and replace form' do
      before do
        select 'Clear All & Replace'
        click_on 'Preview'
      end

      it 'does not let the user submit the form without required fields' do
        expect(page).to have_css('#location_keyword_value-error', text: 'A valid location keyword must be specified.')
      end
    end

    context 'when viewing the Find & Remove form' do
      before do
        select 'Find & Remove'
      end

      context 'when submitting an empty form' do
        before do
          click_on 'Preview'
        end

        it 'does not let the user submit the form without required fields' do
          expect(page).to have_css('#location_keyword_find-error', text: 'At least one keyword level must be specified.')
        end
      end

      context 'when leaving a required field with no text' do
        before do
          find('#location_category').click
          find('#type').click
        end

        it 'displays a required field error' do
          expect(page).to have_css('#location_keyword_find-error', text: 'At least one keyword level must be specified.')
        end
      end
    end

    context 'when viewing the Find & Replace form' do
      before do
        select 'Find & Replace'
      end

      context 'when submitting an empty form' do
        before do
          click_on 'Preview'
        end

        it 'does not let the user submit the form without required fields' do
          expect(page).to have_css('#location_keyword_find-error', text: 'At least one keyword level must be specified.')
          expect(page).to have_css('#location_keyword_value-error', text: 'A valid location keyword must be specified.')
        end
      end

      context 'when leaving a required field with no text' do
        before do
          find('#location_category').click
          find('#type').click
        end

        it 'displays a required field error' do
          expect(page).to have_css('#location_keyword_find-error', text: 'At least one keyword level must be specified.')
        end
      end
    end
  end
end
