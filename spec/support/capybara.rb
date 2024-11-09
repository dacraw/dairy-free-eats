require 'capybara/rspec'

ENV['HEADLESS'] ? Capybara.default_driver = :selenium_chrome_headless : Capybara.default_driver = :selenium_chrome
