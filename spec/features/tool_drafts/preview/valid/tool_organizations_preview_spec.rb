describe 'Valid Tool Draft Tool Organizations Preview' do
  let(:tool_draft) { create(:full_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examining the Tool Organizations sections' do

    context 'when examining the metadata preview section' do
      it 'displays the stored values correctly within the preview' do
        within '.umm-preview.tool_organizations' do
          expect(page).to have_css('h4', text: 'Tool Organizations')

          expect(page).to have_css('.umm-preview-field-container', count: 1)

          within '#tool_draft_draft_organizations_preview' do
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_organizations', anchor: 'tool_draft_draft_organizations'))

            within 'ul.tool-organizations-cards' do
              within 'li.card:nth-child(1)' do
                within '.card-header' do
                  expect(page).to have_content('UCAR/NCAR/EOL/CEOPDM')
                  expect(page).to have_content('Multiple Roles')
                  expect(page).to have_content('SERVICE PROVIDER')
                  expect(page).to have_content('DEVELOPER')
                end

                within '.card-body' do
                  within '.card-body-details' do
                    expect(page).to have_content('CEOP Data Management, Earth Observing Laboratory, National Center for Atmospheric Research, University Corporation for Atmospheric Research')
                    expect(page).to have_content('http://www.eol.ucar.edu/projects/ceop/dm/')
                  end
                end
              end

              within 'li.card:nth-child(2)' do
                within '.card-header' do
                  expect(page).to have_content('AARHUS-HYDRO')
                  expect(page).to have_content('PUBLISHER')
                end

                within '.card-body' do
                  within '.card-body-details' do
                    expect(page).to have_content('Hydrogeophysics Group, Aarhus University')
                  end
                end
              end
            end
          end
        end
      end
    end
  end
end
