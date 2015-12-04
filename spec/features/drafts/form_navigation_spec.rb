# MMT-269

require 'rails_helper'

SUMMARY_PAGE_STRING = 'Quality Score:'

describe 'Draft form navigation' do
  before :each do
    login
    visit '/dashboard'
    choose 'new-collection'
    click_button 'Create Record'
  end

  context 'when viewing the Summary page' do
    it 'displays form titles' do
      expect(page).to have_content('Data Identification')
      expect(page).to have_content('Distribution Information')
    end
  end

  context 'when drilling down from the summary page' do
    Draft::DRAFT_FORMS.each do |f|
      form_title = f[:form_partial_name].titleize
      context "when clicking on #{form_title}" do
        before do
          within '.metadata' do
            click_link form_title
          end
        end

        it "displays the #{form_title} form" do
          expect(page).to have_content(form_title)
          expect(page).to_not have_content(SUMMARY_PAGE_STRING)
        end
      end
    end
  end

  context 'when on the first form page' do
    # Get to the first form
    before do
      click_link Draft::DRAFT_FORMS[0][:form_partial_name].titleize
    end

    context 'when choosing ' do
      Draft::DRAFT_FORMS.each do |f|
        next_form_title = Draft.get_next_form(f[:form_partial_name]).titleize
        context "#{next_form_title} from the first form selection drop down" do
          before do
            select next_form_title, from: 'next-section-top'
          end

          # Note - randomization causes test result order to not agree with DRAFT_FORMS order.
          it "displays the #{next_form_title} form" do
            expect(page).to have_content(next_form_title)
            expect(page).to_not have_content(SUMMARY_PAGE_STRING)
          end
        end
      end

      # Only test one form from the second navigation drop down
      this_form_title = 'Spatial Information'

      context "#{this_form_title} from the second form selection drop down" do
        before do
          select this_form_title, from: 'next-section-bottom'
        end

        it "displays the #{this_form_title} form" do
          expect(page).to have_content(this_form_title)
          expect(page).to_not have_content(SUMMARY_PAGE_STRING)
        end
      end
    end

    context 'when repeatedly pressing the "Save & Next" button' do
      Draft::DRAFT_FORMS.each do |f|
        next_form_title = Draft.get_next_form(f[:form_partial_name]).titleize

        context 'each press cycles you' do
          before do
            click_button('Save & Next', match: :first)
          end

          it 'displays a confirmation message' do
            expect(page).to have_content('Draft was successfully updated')
          end

          # Note - randomization causes test result order to not agree with DRAFT_FORMS order.
          it "to the correct page (#{next_form_title})" do
            expect(page).to have_content(next_form_title)
            expect(page).to_not have_content(SUMMARY_PAGE_STRING)
          end
        end
      end
    end

    context 'Clicking Save & Done' do
      before do
        select 'English', from: 'Metadata Language'
        click_button('Save & Done', match: :first)
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
        select 'English', from: 'Metadata Language'
        # There are multiple "cancel" links
        click_link('discard_changes', match: :first)
      end

      it 'returns you to the Summary page with edits discarded' do
        expect(page).to have_content(SUMMARY_PAGE_STRING)
      end
    end
  end
end
