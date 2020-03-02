class ChangeUserInviteBooleanToInteger < ActiveRecord::Migration[5.2]
  # This migration is created to address the following Deprecation Warning
  # the instructions say to create a rake task, but a migration will ensure this
  # is run for everyone along with the configuration change
  # The only boolean field that was found is in UserInvite, and that functionality
  # is not being used.
  # Additionally, we only use SQLite3 for dev and test environments, so this should
  # not affect our higher environments.

      # DEPRECATION WARNING: Leaving `ActiveRecord::ConnectionAdapters::SQLite3Adapter.represent_boolean_as_integer`
      # set to false is deprecated. SQLite databases have used 't' and 'f' to serialize
      # boolean values and must have old data converted to 1 and 0 (its native boolean
      # serialization) before setting this flag to true. Conversion can be accomplished
      # by setting up a rake task which runs
      #
      #   ExampleModel.where("boolean_column = 't'").update_all(boolean_column: 1)
      #   ExampleModel.where("boolean_column = 'f'").update_all(boolean_column: 0)
      #
      # for all models and all boolean columns, after which the flag must be set to
      # true by adding the following to your application.rb file:
      #
      #   Rails.application.config.active_record.sqlite3.represent_boolean_as_integer = true
      #  (called from <top (required)> at /Users/chuang14/projects/mmt/config/environment.rb:5)
      # DEPRECATION WARNING: Leaving `ActiveRecord::ConnectionAdapters::SQLite3Adapter.represent_boolean_as_integer`
      # set to false is deprecated. SQLite databases have used 't' and 'f' to serialize
      # boolean values and must have old data converted to 1 and 0 (its native boolean
      # serialization) before setting this flag to true. Conversion can be accomplished
      # by setting up a rake task which runs
      #
      #   ExampleModel.where("boolean_column = 't'").update_all(boolean_column: 1)
      #   ExampleModel.where("boolean_column = 'f'").update_all(boolean_column: 0)
      #
      # for all models and all boolean columns, after which the flag must be set to
      # true by adding the following to your application.rb file:
      #
      #   Rails.application.config.active_record.sqlite3.represent_boolean_as_integer = true
      #  (called from <top (required)> at /Users/chuang14/projects/mmt/config/environment.rb:5)

  def up
    if Rails.env.development? || Rails.env.test?
      UserInvite.where("active = 't'").update_all(active: 1)
      UserInvite.where("active = 'f'").update_all(active: 0)
    end
  end

  def down
    if Rails.env.development? || Rails.env.test?
      UserInvite.where("active = 1").update_all(active: 't')
      UserInvite.where("active = 0").update_all(active: 'f')
    end
  end
end
