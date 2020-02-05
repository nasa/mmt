module Helpers
  module Instrumentation

    class PerformanceAggregation
      attr_reader :duration

      def initialize(key)
        @key = key
        @duration = 0
        @count = 0
      end

      def <<(duration)
        @last = duration
        @duration += duration
        @count += 1
      end

      def to_s
        duration_s = @duration / 1000.0
        average = duration_s / @count.to_f
        last = @last / 1000.0
        "| %9.3fs | %7.3fs | %7.3fs | %5d | %-45s |" % [duration_s, average, last, @count, @key]
      end

      def <=>(other)
        @duration <=> other.duration
      end
    end

    def self.record_performance(key, duration)
      @events ||= {}
      @events[key] ||= PerformanceAggregation.new(key)
      @events[key] << duration
      puts @events[key] if ENV['verbose_timing']
    end

    def self.report_performance
      @events ||= {}
      timings = @events.map(&:second).sort.reverse
      puts "\nInstrumented performance:\n"

      puts "| Total time |  Average |   Last   | Count | Activity                                      |"
      puts "|------------+----------+----------+-------+-----------------------------------------------|"

      puts timings.join("\n")
    end

    private

    def self.timing_to_str(key, time)
      "%9.3fs - #{key}" % (time / 1000.0)
    end
  end
end

ActiveSupport::Notifications.subscribe('mmt.performance') do |*args|
  event = ActiveSupport::Notifications::Event.new(*args)

  key = event.payload && event.payload[:activity] || event.name.gsub(/^mmt.performance\./, '')

  Helpers::Instrumentation.record_performance(key, event.duration)
end

ActiveSupport::Notifications.subscribe('process_action.action_controller') do |*args|
  event = ActiveSupport::Notifications::Event.new(*args)

  controller = event.payload[:controller]
  action = event.payload[:action]
  format = event.payload[:format] || 'all'
  format = 'all' if format == '*/*'
  key = "#{controller}##{action}.#{format}"

  Helpers::Instrumentation.record_performance(key, event.duration)
end

ActiveSupport::Notifications.subscribe('request.faraday') do |*args|
  event = ActiveSupport::Notifications::Event.new(*args)

  url         = event.payload[:url]
  http_method = event.payload[:method].to_s.upcase
  key         = "[#{url.host}:#{url.port}] #{http_method} #{url.request_uri}"

  Helpers::Instrumentation.record_performance(key, event.duration)
end

ActiveSupport::Notifications.subscribe('factory_bot.run_factory') do |*args|
  event = ActiveSupport::Notifications::Event.new(*args)

  key = "FactoryBot##{event.payload[:strategy]} (#{event.payload[:name]})"

  Helpers::Instrumentation.record_performance(key, event.duration)
end

ActiveSupport::Notifications.subscribe 'sql.active_record' do |*args|
  event = ActiveSupport::Notifications::Event.new(*args)

  Helpers::Instrumentation.record_performance(event.name, event.duration)
end

ActiveSupport::Notifications.subscribe 'render_template.action_view' do |*args|
  event = ActiveSupport::Notifications::Event.new(*args)

  template = event.payload[:identifier].sub(Rails.root.to_s, '')

  Helpers::Instrumentation.record_performance("Render View #{template}", event.duration)
end

ActiveSupport::Notifications.subscribe 'render_partial.action_view' do |*args|
  event = ActiveSupport::Notifications::Event.new(*args)

  template = event.payload[:identifier].sub(Rails.root.to_s, '')

  Helpers::Instrumentation.record_performance("Render Partial #{template}", event.duration)
end
