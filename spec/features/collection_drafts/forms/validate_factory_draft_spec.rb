# This test validates that a draft from the draft factory validates on each form.

require 'rails_helper'

include DraftsHelper

debug = false

validation_element_display_selector_string = '.validation-error'
validation_summary_display_selector_string = '#summary-errors'

describe 'Data validation on each form for the factory draft', js: true do
  before do
    login
    draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
    # sleep 1
    visit collection_draft_path(draft)
  end

  CollectionDraft.forms.each do |form|
    form_name = titleize_form_name(form)

    context "when on the #{form_name} Form" do
      before do
        within 'section.metadata' do
          click_on form_name, match: :first
        end
        open_accordions unless form_name == 'Collection Information'
      end

      it 'validation produces no false positives' do
        # Loop through each validate field...
        if debug
          # This probably is not as efficient (39 seconds vs 6 on my machine) but gives you more information
          page.all(:css, '.validate').each do |element|
            puts element[:id]
            element.trigger('blur')
            expect(page).not_to have_selector(validation_element_display_selector_string)
          end
        else
          script = "$('.validate').each(function(element ) { element.blur;  }); "
          page.execute_script(script)
        end

        # There should be no errors.
        expect(page).not_to have_selector(validation_element_display_selector_string)

        within '.nav-top' do
          click_on 'Done'
        end

        expect(page).not_to have_selector(validation_element_display_selector_string)
        expect(page).not_to have_selector(validation_summary_display_selector_string)
      end
    end
  end
end
