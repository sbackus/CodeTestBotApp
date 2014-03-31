source 'https://rubygems.org'

ruby '2.1.1'

# Rails
gem 'rails', '4.1.0.rc1'
gem 'rails_12factor', group: :production
gem 'ember-rails'

# Database
gem 'sqlite3'

# Assets
gem 'foundation-rails'
gem 'jquery-rails'
gem 'sass-rails', '~> 4.0.2'
gem 'uglifier', '>= 1.3.0'

gem 'figaro', github: 'laserlemon/figaro'
gem 'jbuilder', '~> 2.0.5' # TODO: Do we need JBuilder in the App project?

group :doc do
  gem 'sdoc', '~> 0.4.0'
end

group :test, :development do
  gem 'teaspoon', :git => 'https://github.com/modeset/teaspoon.git'
end

group :development do
  gem 'spring'
end

group :test do

end