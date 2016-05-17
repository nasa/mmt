# MMT-269

require 'rails_helper'

SUMMARY_PAGE_STRING = 'Quality Score:'

describe 'Draft form navigation', js: true do
  before do
    login
    draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when viewing the Summary page' do
    it 'displays form titles' do
      expect(page).to have_content('Data Identification')
      expect(page).to have_content('Distribution Information')
    end
  end

  context 'when drilling down from the summary page' do
    Draft::DRAFT_FORMS.each do |form|
      form_title = form.titleize
      context "when clicking on #{form_title}" do
        before do
          within '.metadata' do
            click_on form_title, match: :first
          end
        end

        it "displays the #{form_title} form" do
          within '.eui-breadcrumbs' do
            expect(page).to have_content(form_title)
          end
          expect(page).to_not have_content(SUMMARY_PAGE_STRING)
        end
      end
    end
  end

  Draft::DRAFT_FORMS.each do |form|
    next_form = Draft.get_next_form(form, 'Next').titleize

    context "when choosing #{next_form} from the form selection drop down" do
      before do
        if next_form == 'Metadata Information'
          click_on 'Data Identification'
        else
          click_on 'Metadata Information'
        end

        select next_form, from: 'next-section-top'
      end

      # Note - randomization causes test result order to not agree with DRAFT_FORMS order.
      it "displays the #{next_form} form" do
        expect(page).to have_content(next_form)
        expect(page).to_not have_content(SUMMARY_PAGE_STRING)
      end
    end
  end

  Draft::DRAFT_FORMS.size.times do |index|
    current_form = Draft::DRAFT_FORMS[index].titleize
    next_form = Draft.get_next_form(current_form.parameterize.underscore, 'Next').titleize

    context 'when pressing the Next button' do
      before do
        click_on current_form, match: :first

        within '.nav-top' do
          click_on 'Next'
        end

        next_form = Draft.get_next_form(current_form.parameterize.underscore, 'Next').titleize
        current_form = next_form
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Draft was successfully updated')
      end

      it "displays the correct page (#{next_form})" do
        within '.eui-breadcrumbs' do
          expect(page).to have_content(next_form)
        end
        expect(page).to_not have_content(SUMMARY_PAGE_STRING)
      end
    end
  end

  Draft::DRAFT_FORMS.size.times do |index|
    current_form = Draft::DRAFT_FORMS[index].titleize
    previous_form = Draft.get_next_form(current_form.parameterize.underscore, 'Previous').titleize

    context 'when pressing the Previous button' do
      before do
        click_on current_form, match: :first

        within '.nav-top' do
          click_on 'Previous'
        end

        previous_form = Draft.get_next_form(current_form.parameterize.underscore, 'Previous').titleize
        current_form = previous_form
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Draft was successfully updated')
      end

      it "displays the correct page (#{previous_form})" do
        within '.eui-breadcrumbs' do
          expect(page).to have_content(previous_form)
        end
        expect(page).to_not have_content(SUMMARY_PAGE_STRING)
      end
    end
  end

  context 'when on the first form page' do
    before do
      click_on 'Collection Information', match: :first
    end

    context 'Clicking Done' do
      before do
        within '.nav-top' do
          click_on 'Done'
        end
        # no data entered in required fields, so will have invalid data modal
        click_on 'Yes'
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Draft was successfully updated')
      end

      it 'returns you to the Summary page with edits saved' do
        expect(page).to have_content(SUMMARY_PAGE_STRING)
      end
    end

    context 'Clicking Cancel' do
      before do
        within '.nav-top' do
          # click_on 'Cancel' doesn't work
          find('.cancel').trigger('click')
        end
      end

      it 'returns you to the Summary page with edits discarded' do
        expect(page).to have_content(SUMMARY_PAGE_STRING)
      end
    end

    context 'Clicking Save' do
      before do
        fill_in 'Short Name', with: 'Test'
        fill_in 'Version', with: '23'
        fill_in 'Entry Title', with: 'New Test Draft Record'
        fill_in 'Abstract', with: 'Descriptive paragraph summarizing record methodology and findings.'

        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'stays on the same form' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('Collection Information')
        end
        expect(page).to have_no_content(SUMMARY_PAGE_STRING)
      end

      it 'displays save confirmation message' do
        expect(page).to have_content('Draft was successfully updated')
      end

      it 'displays the populated values in the form' do
        expect(page).to have_field('Short Name', with: 'Test')
        expect(page).to have_field('Version', with: '23')
        expect(page).to have_field('Entry Title', with: 'New Test Draft Record')
        expect(page).to have_field('Abstract', with: 'Descriptive paragraph summarizing record methodology and findings.')
      end

      it 'saves the data to the database' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('Test_23')
        end

        draft = Draft.first
        expect(draft.short_name).to eq('Test')
        expect(draft.entry_title).to eq('New Test Draft Record')
      end
    end
  end
end
