# MMT-269

require 'rails_helper'

SUMMARY_PAGE_STRING = 'Quality Score ='
TEST_TITLE_STRING = 'test title'

describe 'Draft form navigation' do

  before :each do
    login
    visit '/dashboard'
    choose "type_new_collection"
    click_button "Create Record"
  end

  context 'when viewing the Summary page' do

    it 'displays form titles' do
      expect(page).to have_content("Data Identification")
      expect(page).to have_content("Distribution Information")
    end
  end

  context 'when drilling down from the summary page' do
    Draft::DRAFT_FORMS.each do |f|
      form_title = f[:form_partial_name].titleize()
      context "when clicking on #{form_title}" do
        before do
          click_link form_title
        end
        it "displays the #{form_title} form" do
          expect(page).to have_content(form_title)
          expect(page).to_not have_content(SUMMARY_PAGE_STRING)
        end
      end

    end
  end

  context 'when on the first form page' do
    before do # Get to the first form
      click_link Draft::DRAFT_FORMS[0][:form_partial_name].titleize()
    end

    context 'when choosing ' do
      Draft::DRAFT_FORMS.each do |f|
        next_form_title = Draft.get_next_form(f[:form_partial_name]).titleize()
        context "#{next_form_title} from the first form selection drop down" do
          before do
            within('.nav-top') do
              select next_form_title, :from=>"next_section"
            end
          end
          it "displays the #{next_form_title} form" do # Note - randomization causes test result order to not agree with DRAFT_FORMS order.
            expect(page).to have_content(next_form_title)
            expect(page).to_not have_content(SUMMARY_PAGE_STRING)
          end
        end
      end

      this_form_title = "Spatial Extent" # Only test one form from the second navigation drop down
      context "#{this_form_title} from the second form selection drop down" do
        before do
          within('.nav-bottom') do
            select this_form_title, :from=>"next_section"
          end
        end
        it "displays the #{this_form_title} form" do
          expect(page).to have_content(this_form_title)
          expect(page).to_not have_content(SUMMARY_PAGE_STRING)
        end
      end
    end

    context 'when repeatedly pressing the "Save & Next" button' do
      Draft::DRAFT_FORMS.each do |f|
        next_form_title = Draft.get_next_form(f[:form_partial_name]).titleize()
        context 'each press cycles you' do
          before do
            click_button("Save & Next", match: :first)
          end
          it "to the correct page (#{next_form_title})" do # Note - randomization causes test result order to not agree with DRAFT_FORMS order.
            expect(page).to have_content(next_form_title)
            expect(page).to_not have_content(SUMMARY_PAGE_STRING)
          end
        end
      end
    end

    context 'Clicking Save & Done' do
      before do
        fill_in 'Entry Title', with: TEST_TITLE_STRING
        click_button("Save & Done", match: :first)
      end
      it 'returns you to the Summary page with edits saved' do
        expect(page).to have_content(SUMMARY_PAGE_STRING)
        expect(page).to have_content(TEST_TITLE_STRING)
      end
    end

    context 'Clicking Cancel' do
      before do
        fill_in 'Entry Title', with: TEST_TITLE_STRING
        click_link("discard_changes", match: :first) # There are multiple "cancel" links
      end
      it 'returns you to the Summary page with edits discarded' do
        expect(page).to have_content(SUMMARY_PAGE_STRING)
        expect(page).to_not have_content(TEST_TITLE_STRING)
      end
    end

  end

end
