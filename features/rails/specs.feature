@rails
Feature: Rails Specs

  Scenario: JavaScript spec in Rails
    Given file "spec/javascripts/script.js" contains "1"
    When I visit "/__spec__/script.js"
    Then I should see "1"

  Scenario: CoffeeScript spec in Rails
    Given file "spec/javascripts/script.js.coffee" contains "2"
    When I visit "/__spec__/script.js"
    Then I should see "2"

  Scenario: List JS Specs
    # This is used when building the list of specs to include in the suite.
    Given file "spec/javascripts/script_spec.js" contains "1"
    When I visit "/jasmine/"
    Then I should see a "script" element with attribute "src" equal to "/__spec__/script_spec.js?body=true"

  Scenario: List CS Specs
    # This is used when building the list of specs to include in the suite.
    Given file "spec/javascripts/script_spec.js.coffee" contains "2"
    When I visit "/jasmine/"
    Then I should see a "script" element with attribute "src" equal to "/__spec__/script_spec.js?body=true"

  @allow-rescue
  Scenario: CS spec failing to compile
    Given file "spec/javascripts/script_spec.js.coffee" contains "this is invalid!"
    When I visit "/__spec__/script_spec.js"
    Then I should see "Error"
    
    When I visit "/__spec__/script_spec.js"
    Then I should not see "has already been required"