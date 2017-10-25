require 'rails_helper'

describe 'Echo Helper' do
  context '#echo_formatted_date' do
    context 'with valid date' do
      let(:date_string) { '2016-12-21T16:49:00+00:00' }
      let(:date_obj)    { DateTime.parse(date_string) }

      context 'with default format' do
        it 'returns the date using using the echo format' do
          expect(helper.echo_formatted_date(date_string)).to eql('Wednesday, December 21, 2016 at  4:49 pm')
        end
      end
    end

    context 'with invalid date' do
      it 'returns the provided string if no default is specified' do
        expect(helper.echo_formatted_date('2016-14-21T16:49:00+00:00')).to eql('2016-14-21T16:49:00+00:00')
      end

      it 'returns the default if specified' do
        expect(helper.echo_formatted_date('', default: 'Never Updated')).to eql('Never Updated')
      end
    end
  end
end
