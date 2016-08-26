require 'rails_helper'

describe 'Publishing revision of collection with non url encoded native id', js: true do
  context 'when finding a published collection with a non url encoded native id' do
    before do
      login
      user = User.first
      user.provider_id = 'LARC'
      user.available_providers << 'LARC'
      user.save

      click_on 'Find'
      click_on 'AE_5DSno'
    end

    context 'when editing the collection' do
      before do
        click_on 'Edit Record'

      end

      it 'creates a draft with a non url encoded native id' do
        draft = Draft.first
        page.document.synchronize do
          expect(draft.native_id).to eq('AMSR-E/Aqua & 5-Day, L3 Global Snow Water Equivalent EASE-Grids V001')
        end
      end

      context 'when publishing the revision then visiting the revisions page' do
        before do
          # add required data to publish
          within '.metadata' do
            click_on 'Organizations', match: :first
          end
          open_accordions
          (1..3).each do |n|
            # TODO this is not the ideal way to do this, but the entire form will be changed by the next ticket
            within "#draft_organizations_#{n} > .eui-accordion__header" do
              find('.remove').click
            end
          end
          within '#draft_organizations_0' do
            select 'AARHUS-HYDRO', from: 'Short Name'
          end
          within '.nav-top' do
            click_on 'Done'
          end

          within '.metadata' do
            click_on 'Data Identification'
          end
          click_on 'Expand All'
          select 'Level 3', from: 'ID'
          select 'Planned', from: 'Collection Progress'
          within '.nav-top' do
            click_on 'Done'
          end

          within '.metadata' do
            click_on 'Acquisition Information'
          end
          click_on 'Expand All'
          select 'Aircraft', from: 'Type'
          within '.nav-top' do
            click_on 'Done'
          end

          click_on 'Publish'
          wait_for_ajax

          click_on 'Revisions'
        end

        it 'has two revisions' do
          within 'tbody' do
            expect(page).to have_css('tr', count: 2)
          end
        end
      end
    end
  end
end
