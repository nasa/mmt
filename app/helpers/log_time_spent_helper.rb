module LogTimeSpentHelper
  # Simple method to time a block and log its elapsed time in logs
  def log_time_spent(name, &block)
    start = Time.new
    Rails.logger.info("Starting #{name}")
    return_value = block.call
    stop = Time.new
    Rails.logger.info("Finished #{name} - elapsed time is #{stop-start} secs.")
    return_value
  end
end