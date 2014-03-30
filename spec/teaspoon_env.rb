# This file allows you to override various Teaspoon configuration directives when running from the command line. It is not
# required from within the Rails environment, so overriding directives that have been defined within the initializer
# is not possible.
#
# Set RAILS_ROOT and load the environment.
ENV["RAILS_ROOT"] = File.expand_path("../../", __FILE__)
require File.expand_path("../../config/environment", __FILE__)

Teaspoon.configure do |config|

  config.suite do |suite|
    suite.use_framework :mocha
    suite.no_coverage = [%r{/lib/ruby/gems/}, %r{/vendor/assets/}, %r{/support/}, %r{/(.+)_helper.},
                         %r{.rvm/}, %r{app/assets/javascripts/templates}]
  end

  config.coverage :CI do |coverage|
    coverage.reports = ['lcov', 'text-summary']
    coverage.output_path = 'coverage'
  end

  config.use_coverage = 'CI'
end
