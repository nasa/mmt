# MMT-268

require 'rails_helper'

describe 'Search Result Pagination' do
  before do
    visit '/search'
    fill_in 'entry_id', with: ''
    click_on 'Find'
    # Get page_count from invisible field. To be used to test handling of last_page
    @page_count = page.all("input[@id='page_count']", :visible => false).first.value.to_i
    # Values to verify page 1, first row
    @page_1_id_1 = 'C1000000719-EDF_OPS'
    @page_1_title_1 = '100m Digital Elevation Model Data V001'
    @page_1_date_1 = '2000-10-22'
    # Values to verify page 2, first row
    @page_2_id_1 = 'C1000000127-DEV07'
    @page_2_title_1 = 'AMSR-E Predicted Orbital Events (1-week) V001'
    @page_2_date_1 = '2006-11-01'
  end

  context 'when viewing search results with multiple pages' do
    it 'displays expected pagination links' do
      expect(page).to have_link('page_to_first')
      expect(page).to have_link('page_to_prev')
      expect(page).to have_link('page_to_1')
      expect(page).to have_link('page_to_ellipses')
      expect(page).to have_link('page_to_next')
      expect(page).to have_link('page_to_last')
    end


    it 'starts on page 1' do
      expect(page).to have_content(@page_1_id_1)
      expect(page).to have_content(@page_1_title_1)
      expect(page).to have_content(@page_1_date_1)
      expect(page).to have_css('#page_to_1.active-page')
    end

    context 'when clicking on the next link' do
      before do
        click_link('page_to_next')
      end

      it 'displays the next page' do
        expect(page).to have_content(@page_2_id_1)
        expect(page).to have_content(@page_2_title_1)
        expect(page).to have_content(@page_2_date_1)
        expect(page).to have_css('#page_to_2.active-page')
      end
    end

    context 'when clicking on the previous link' do
      before do
        click_link('page_to_next')
        expect(page).to have_content(@page_2_id_1)
        expect(page).to have_content(@page_2_title_1)
        expect(page).to have_content(@page_2_date_1)
        expect(page).to have_css('#page_to_2.active-page')
        click_link('page_to_prev')
      end

      it 'displays the previous page' do
        expect(page).to have_content(@page_1_id_1)
        expect(page).to have_content(@page_1_title_1)
        expect(page).to have_content(@page_1_date_1)
        expect(page).to have_css('#page_to_1.active-page')
      end
    end

    context 'when clicking on the first page link' do
      before do
        click_link('page_to_next')
        expect(page).to have_content(@page_2_id_1)
        expect(page).to have_content(@page_2_title_1)
        expect(page).to have_content(@page_2_date_1)
        expect(page).to have_css('#page_to_2.active-page')
        click_link('page_to_first')
      end

      it 'displays the first page' do
        expect(page).to have_content(@page_1_id_1)
        expect(page).to have_content(@page_1_title_1)
        expect(page).to have_content(@page_1_date_1)
        expect(page).to have_css('#page_to_1.active-page')
      end
    end

    context 'when clicking on the last page link' do
      before do
        click_link('page_to_last')
      end

      it 'displays the last page' do
        expect(page).to have_css("#page_to_#{@page_count}.active-page")
      end
    end

    context 'when clicking on a specific page link' do
      before do
        click_link('page_to_3')
      end

      it 'displays the new page' do
        expect(page).to have_css('#page_to_3.active-page')
      end
    end
  end

  # Need specific pagination tests for page counts of 2, 3, 4,

end