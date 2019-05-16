require 'rails_helper'
require 'prime'

# time helper method executes a block and may return a result
# real purpose is to log the time spent executing a block, but
# sometimes it is also necessary to return something.   this test
# just provides code coverage of this helper method and ensures the
# expected return value.
describe 'Time Helper' do
  context '#executes_block' do
    let(:x) do
      helper.log_time_spent 'compute the first 5 prime elements' do
        Prime.first(5)
      end
    end
    context 'with return value' do
      it 'it returns [2, 3, 5, 7, 11]' do
        expect(x).to match_array([2, 3, 5, 7, 11])
      end
    end
  end
end
