require 'rails_helper'

describe 'Header' do
  before do
    login
  end

  context 'when viewing the header' do
    context 'from the Manage Collections page' do
      before do
        visit manage_collections_path
      end

      it 'has "Manage Collections" as the underlined current header link' do
        within 'main header' do
          expect(page).to have_css('h2.current', text: 'Manage Collections')
        end
      end
    end

    context 'from the Manage Variables page' do
      before do
        visit manage_variables_path
      end

      it 'has "Manage Variables" as the underlined current header link' do
        within 'main header' do
          expect(page).to have_css('h2.current', text: 'Manage Variables')
        end
      end
    end

    context 'from the Manage Cmr page' do
      before do
        visit manage_cmr_path
      end

      it 'has "Manage CMR" as the underlined current header link' do
        within 'main header' do
          expect(page).to have_css('h2.current', text: 'Manage CMR')
        end
      end
    end

    context 'when clicking the profile link' do
      before do
        visit manage_collections_path
        click_on 'profile-link'
      end

      it 'displays the User Info Dropdown Menu with the correct links' do
        within '#login-info' do
          expect(page).to have_link('Change Provider')
          expect(page).to have_link("User's Guide", href: 'https://wiki.earthdata.nasa.gov/display/CMR/Metadata+Management+Tool+%28MMT%29+User%27s+Guide')
          expect(find_link("User's Guide")[:target]).to eq('_blank')
          expect(page).to have_link('Logout', href: logout_path)
        end
      end
    end
  end
end
