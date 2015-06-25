# MMT-9, MMT-22

require 'rails_helper'

describe 'Quick Find Pagination' do

  before :each do
    visit "/search"
  end
  it 'the user is on the search page' do
    expect(page).to have_content('Search Result')
  end

  context "and performing a quick find search that should return at least 10 pages of hits" do
    before do
      fill_in 'entry_id', with: ''
      click_on 'Find'
    end
    it 'displays expected pagination links' do
      expect(page).to have_link('page_to_first')
      expect(page).to have_link('page_to_prev')
      expect(page).to have_link('page_to_1')
      expect(page).to have_link('page_to_ellipses')
      expect(page).to have_link('page_to_next')
      expect(page).to have_link('page_to_last')
    end
    it 'starts on page 1' do
      # link 'page_to_1' has class 'active-page'
      expect(page.find('a#page_to_1')['class']).to include('active-page')
    end
    it 'pages directly to page 2' do
      click_link('page_to_2')
      expect(page.find('a#page_to_2')['class']).to include('active-page')
    end
    it 'pages directly to page 1' do
      click_link('page_to_1')
      expect(page.find('a#page_to_1')['class']).to include('active-page')
    end
    it 'pages to the last page' do
      click_link('page_to_last')
      expect(page.find('a#page_to_last')['class']).to include('active-page')
    end
    it 'pages to the prev page' do
      click_link('page_to_prev')
      #expect(page.find('a#page_to_???')['class']).to include('active-page')
    end
    it 'pages to the first page' do
      click_link('page_to_first')
      expect(page.find('a#page_to_1')['class']).to include('active-page')
    end
    it 'pages to the next page' do
      click_link('page_to_next')
      expect(page.find('a#page_to_2')['class']).to include('active-page')
    end
    it 'pages directly to page 5 then prev to 4 then next to 5, 6 then prev to 5' do
      click_link('page_to_5')
      expect(page.find('a#page_to_5')['class']).to include('active-page')
      click_link('page_to_prev')
      expect(page.find('a#page_to_4')['class']).to include('active-page')
      click_link('page_to_next')
      expect(page.find('a#page_to_5')['class']).to include('active-page')
      click_link('page_to_next')
      expect(page.find('a#page_to_6')['class']).to include('active-page')
      click_link('page_to_prev')
      expect(page.find('a#page_to_5')['class']).to include('active-page')
    end
  end

  # Need specific pagination tests for page counts of 2, 3, 4,
end
