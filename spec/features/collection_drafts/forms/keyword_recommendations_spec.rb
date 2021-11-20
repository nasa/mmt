describe 'GKR Science Keyword Recommendations', js: true do
  before do
    login
  end

  context 'when the draft does not have an abstract' do
    before do
      @draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    end

    context 'when visiting the descriptive keywords form' do
      before do
        VCR.use_cassette('gkr/initial_keyword_recommendations', record: :none) do
          visit edit_collection_draft_path(@draft, form: 'descriptive_keywords')
        end

        click_on 'Expand All'
      end

      it 'does not display any keyword recommendations' do
        within '.selected-science-keywords' do
          expect(page).to have_no_css('.eui-info-box')
          expect(page).to have_no_css('.eui-badge--sm.recommended-science-keywords', text: 'RECOMMENDED')

          expect(page).to have_no_content('Recommended Keywords')
          expect(page).to have_no_content('Based on your Abstract, the MMT automatically suggests recommended keywords RECOMMENDED for your collection. To associate a recommended keyword to your collection, click the blue + icon next to the keyword. Once associated to the collection, the keyword will display a green check . To remove a keyword once it’s been associated, click the red X icon next to the keyword.')
        end
      end
    end
  end

  context 'when the draft has an abstract and keyword recommendations have not been viewed' do
    before do
      @draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
    end

    context 'when visiting the descriptive keywords form directly' do
      before do
        VCR.use_cassette('gkr/initial_keyword_recommendations', record: :none) do
          visit edit_collection_draft_path(@draft, form: 'descriptive_keywords')
        end

        click_on 'Expand All'
      end

      it 'displays the already selected keywords' do
        expect(page).to have_content('EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC TEMPERATURE > SURFACE TEMPERATURE > MAXIMUM/MINIMUM TEMPERATURE > 24 HOUR MAXIMUM TEMPERATURE')
        expect(page).to have_content('EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES > LUMINESCENCE')
      end

      it 'displays the keyword recommendations' do
        within '.selected-science-keywords' do
          within '.eui-info-box' do
            expect(page).to have_content('Recommended Keywords')
            expect(page).to have_content('Based on your Abstract, the MMT automatically suggests recommended keywords RECOMMENDED for your collection. To associate a recommended keyword to your collection, click the blue + icon next to the keyword. Once associated to the collection, the keyword will display a green check . To remove a keyword once it’s been associated, click the red X icon next to the keyword.')
          end

          expect(page).to have_content('EARTH SCIENCE > OCEANS > SALINITY/DENSITY RECOMMENDED')
          expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN TEMPERATURE RECOMMENDED')
          expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN OPTICS RECOMMENDED')
          expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN CHEMISTRY RECOMMENDED')

          expect(page).to have_css('.eui-badge--sm.recommended-science-keywords', text: 'RECOMMENDED', count: 5)
        end
      end

      context 'when adding some recommendations then saving the form' do
        before do
          within '.selected-science-keywords ul' do
            find('li:nth-child(6) a.accept-recommendation').click
            find('li:nth-child(5) a.accept-recommendation').click
          end

          within '.nav-top' do
            VCR.use_cassette('gkr/initial_keyword_recommendations', record: :none) do
              click_on 'Save'
            end
          end

          click_on 'Expand All'
        end
        it 'displays the correct selected keywords' do
          within '.selected-science-keywords' do
            expect(page).to have_content('EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC TEMPERATURE > SURFACE TEMPERATURE > MAXIMUM/MINIMUM TEMPERATURE > 24 HOUR MAXIMUM TEMPERATURE')
            expect(page).to have_content('EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES > LUMINESCENCE')
            expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN OPTICS')
            expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN CHEMISTRY')
          end
        end

        it 'does not display any recommendations' do
          within '.selected-science-keywords' do
            expect(page).to have_no_css('.eui-info-box')
            expect(page).to have_no_css('.eui-badge--sm.recommended-science-keywords', text: 'RECOMMENDED')

            expect(page).to have_no_content('Recommended Keywords')
            expect(page).to have_no_content('Based on your Abstract, the MMT automatically adds recommended keywords RECOMMENDED to your collection. If the recommended keywords are not relevant, you can remove them from the collection. This will help us make better recommendations in the future.')

            expect(page).to have_no_content('EARTH SCIENCE > OCEANS > SALINITY/DENSITY RECOMMENDED')
            expect(page).to have_no_content('EARTH SCIENCE > OCEANS > OCEAN TEMPERATURE RECOMMENDED')
          end
        end
      end
    end

    context 'when visiting the form by clicking on the progress circle icon with the Science Keyword anchor that opens the accordion' do
      before do
        visit collection_draft_path(@draft)

        within '.metadata #descriptive-keywords .meta-info' do
          VCR.use_cassette('gkr/initial_keyword_recommendations', record: :none) do
            click_on "Science Keywords - Required field complete"
          end
        end
      end

      it 'displays the already selected keywords' do
        expect(page).to have_content('EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC TEMPERATURE > SURFACE TEMPERATURE > MAXIMUM/MINIMUM TEMPERATURE > 24 HOUR MAXIMUM TEMPERATURE')
        expect(page).to have_content('EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES > LUMINESCENCE')
      end

      it 'displays the keyword recommendations' do
        within '.selected-science-keywords' do
          within '.eui-info-box' do
            expect(page).to have_content('Recommended Keywords')
            expect(page).to have_content('Based on your Abstract, the MMT automatically suggests recommended keywords RECOMMENDED for your collection. To associate a recommended keyword to your collection, click the blue + icon next to the keyword. Once associated to the collection, the keyword will display a green check . To remove a keyword once it’s been associated, click the red X icon next to the keyword.')
          end

          expect(page).to have_content('EARTH SCIENCE > OCEANS > SALINITY/DENSITY RECOMMENDED')
          expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN TEMPERATURE RECOMMENDED')
          expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN OPTICS RECOMMENDED')
          expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN CHEMISTRY RECOMMENDED')

          expect(page).to have_css('.eui-badge--sm.recommended-science-keywords', text: 'RECOMMENDED', count: 5)
        end
      end

      context 'when adding some recommendations then saving the form' do
        before do
          within '.selected-science-keywords ul' do
            find('li:nth-child(6) a.accept-recommendation').click
            find('li:nth-child(5) a.accept-recommendation').click
          end

          within '.nav-top' do
            VCR.use_cassette('gkr/initial_keyword_recommendations', record: :none) do
              click_on 'Save'
            end
          end

          click_on 'Expand All'
        end

        it 'displays the correct selected keywords' do
          within '.selected-science-keywords' do
            expect(page).to have_content('EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC TEMPERATURE > SURFACE TEMPERATURE > MAXIMUM/MINIMUM TEMPERATURE > 24 HOUR MAXIMUM TEMPERATURE')
            expect(page).to have_content('EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES > LUMINESCENCE')
            expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN OPTICS')
            expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN CHEMISTRY')
          end
        end

        it 'does not display any recommendations' do
          within '.selected-science-keywords' do
            expect(page).to have_no_css('.eui-info-box')
            expect(page).to have_no_css('.eui-badge--sm.recommended-science-keywords', text: 'RECOMMENDED')

            expect(page).to have_no_content('Recommended Keywords')
            expect(page).to have_no_content('Based on your Abstract, the MMT automatically suggests recommended keywords RECOMMENDED for your collection. To associate a recommended keyword to your collection, click the blue + icon next to the keyword. Once associated to the collection, the keyword will display a green check . To remove a keyword once it’s been associated, click the red X icon next to the keyword.')

            expect(page).to have_no_content('EARTH SCIENCE > OCEANS > SALINITY/DENSITY RECOMMENDED')
            expect(page).to have_no_content('EARTH SCIENCE > OCEANS > OCEAN TEMPERATURE RECOMMENDED')
          end
        end
      end
    end
  end

  context 'when keyword recommendations match some previously selected science keyword values' do
    before do
      draft = create(:collection_draft_some_keywords_that_match_recommendations, user: User.where(urs_uid: 'testuser').first)

      VCR.use_cassette('gkr/initial_keyword_recommendations', record: :none) do
        visit edit_collection_draft_path(draft, form: 'descriptive_keywords')
      end

      click_on 'Expand All'
    end

    it 'displays the previously selected keywords' do
      expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN OPTICS')
      expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN TEMPERATURE')
    end

    it 'displays the keyword recommendations' do
      within '.selected-science-keywords' do
        within '.eui-info-box' do
          expect(page).to have_content('Recommended Keywords')
          expect(page).to have_content('Based on your Abstract, the MMT automatically suggests recommended keywords RECOMMENDED for your collection. To associate a recommended keyword to your collection, click the blue + icon next to the keyword. Once associated to the collection, the keyword will display a green check . To remove a keyword once it’s been associated, click the red X icon next to the keyword.')
        end

        expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN OPTICS RECOMMENDED')
        expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN CHEMISTRY RECOMMENDED')

        expect(page).to have_css('.eui-badge--sm.recommended-science-keywords', text: 'RECOMMENDED', count: 3)
      end
    end
  end

  context 'when keyword recommendations match all previously selected science keyword values' do
    before do
      draft = create(:collection_draft_all_keywords_that_match_recommendations, user: User.where(urs_uid: 'testuser').first)

      VCR.use_cassette('gkr/initial_keyword_recommendations', record: :none) do
        visit edit_collection_draft_path(draft, form: 'descriptive_keywords')
      end

      click_on 'Expand All'
    end

    it 'displays the previously selected keywords' do
      expect(page).to have_content('EARTH SCIENCE > OCEANS > SALINITY/DENSITY')
      expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN TEMPERATURE')
      expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN OPTICS')
      expect(page).to have_content('EARTH SCIENCE > OCEANS > OCEAN CHEMISTRY')
    end

    it 'displays the keyword recommendations' do
      within '.selected-science-keywords' do
        expect(page).to have_no_css('.eui-info-box')
        expect(page).to have_no_css('.eui-badge--sm.recommended-science-keywords', text: 'RECOMMENDED')

        expect(page).to have_no_content('Recommended Keywords')
        expect(page).to have_no_content('Based on your Abstract, the MMT automatically suggests recommended keywords RECOMMENDED for your collection. To associate a recommended keyword to your collection, click the blue + icon next to the keyword. Once associated to the collection, the keyword will display a green check . To remove a keyword once it’s been associated, click the red X icon next to the keyword.')
      end
    end
  end

  context 'when there are no keywords that were recommended' do
    before do
      draft = create(:collection_draft_that_will_not_generate_keyword_recommendations, user: User.where(urs_uid: 'testuser').first)

      VCR.use_cassette('gkr/empty_keyword_recommendations', record: :none) do
        visit edit_collection_draft_path(draft, form: 'descriptive_keywords')
      end

      click_on 'Expand All'
    end

    it 'does not display any keyword recommendations' do
      within '.selected-science-keywords' do
        expect(page).to have_no_css('.eui-info-box')
        expect(page).to have_no_css('.eui-badge--sm.recommended-science-keywords', text: 'RECOMMENDED')

        expect(page).to have_no_content('Recommended Keywords')
        expect(page).to have_no_content('Based on your Abstract, the MMT automatically suggests recommended keywords RECOMMENDED for your collection. To associate a recommended keyword to your collection, click the blue + icon next to the keyword. Once associated to the collection, the keyword will display a green check . To remove a keyword once it’s been associated, click the red X icon next to the keyword.')
      end
    end
  end
end
