require 'rails_helper'

shared_examples_for 'Options Form' do
  it 'displays the form with values' do
    expect(page).to have_select('Subset Types', selected: ['Spatial'])
    expect(page).to have_select('Supported Projections', selected: ['Geographic'])
    expect(page).to have_select('Interpolation Types', selected: ['Bilinear Interpolation', 'Bicubic Interpolation'])
    expect(page).to have_select('Supported Formats', selected: ['HDF-EOS4', 'HDF-EOS5'])
  end
end
