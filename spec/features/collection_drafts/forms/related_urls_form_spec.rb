describe 'Related URLs information form', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when checking the accordion headers for required icons' do
    before do
      within '.metadata' do
        click_on 'Related URLs', match: :first
      end
    end

    it 'does not display required icons for accordions in Related URLs section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end
  end

  context 'when submitting the form' do
    before do
      within '.metadata' do
        click_on 'Related URLs', match: :first
      end

      open_accordions

      # Complete RelatedUrl fields
      add_related_urls

      within '.nav-top' do
        click_on 'Save'
      end
      # output_schema_validation Draft.first.draft
      open_accordions
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Updated Successfully!')
    end

    it 'populates the form with the values' do
      within '.multiple.related-urls > .multiple-item-0' do
        expect(page).to have_field('Description', with: 'Example Description')
        expect(page).to have_field('URL Content Type', with: 'CollectionURL')
        expect(page).to have_field('Type', with: 'DATA SET LANDING PAGE')
        expect(page).to have_field('URL', with: 'http://example.com')
      end

      within '.multiple.related-urls> .multiple-item-1' do
        expect(page).to have_field('Description', with: 'Example Description 2')
        expect(page).to have_field('URL Content Type', with: 'DistributionURL')
        expect(page).to have_field('Type', with: 'GET DATA')
        expect(page).to have_field('Subtype', with: 'DIRECT DOWNLOAD')
        expect(page).to have_field('URL', with: 'https://example.com/')

        expect(page).to have_field('Format', with: 'ascii')
        expect(page).to have_field('Size', with: '42.0')
        expect(page).to have_field('Unit', with: 'KB')
        expect(page).to have_field('Fees', with: '0')
        expect(page).to have_field('Checksum', with: 'testchecksum123')
      end
    end
  end
end
