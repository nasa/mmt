require 'rails_helper'

describe 'Draft form accordions', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when clicking on the header' do
    before do
      click_on 'Distribution Information'

      # Open the RelatedUrl fieldset accordion
      all('fieldset.accordion > div.accordion-header').first.click

      # Collapse the Related Url 1 accordion
      find('.multiple.related-urls > .multiple-item-0 > .accordion-header').click
    end

    it 'collapses the accordion' do
      expect(page).to have_css('.multiple-item-0.is-closed')
    end

    it 'hides the fields' do
      expect(page).to have_no_field('Description')
    end

    context 'when clicking on the header again' do
      before do
        # Open the Related Url 1 accordion
        find('.multiple.related-urls > .multiple-item-0.is-closed > .accordion-header').click
      end

      it 'opens the accordion' do
        expect(page).to have_no_css('.multiple-item-0.is-closed')
      end

      it 'shows the fields' do
        expect(page).to have_field('Description')
      end
    end
  end
end
