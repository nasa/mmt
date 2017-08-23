require 'rails_helper'

describe 'Groups breadcrumbs and header' do
  before :all do
    @group = create_group(
      name: 'Breadcrumbs Test Group 01',
      description: 'test group',
      provider_id: 'MMT_2'
    )
  end

  before do
    login

    visit group_path(@group['concept_id'])
  end

  context 'when viewing the breadcrumbs' do
    it 'displays Blank Name' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Groups')
        expect(page).to have_content('Breadcrumbs Test Group 01')
      end
    end
  end

  context 'when viewing the header' do
    it 'has "Manage CMR" as the underlined current header link' do
      within 'main header' do
        expect(page).to have_css('h2.current', text: 'Manage CMR')
      end
    end
  end
end
