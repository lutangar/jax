require 'spec_helper'

# Tests Rails app mounted by the command `jax server`. See Jax::Rails::Application.
# The app does nothing except mount Jax::Engine at "/".

describe "Jax::Rails::Application" do
  def app
    Jax::Rails::Application
  end
  
  it "should mount Jax dev suite at root" do
    get '/'
    follow_redirect! if last_response.redirect?
    last_response.body.should match(/Jax Development Suite/)
    last_response.should be_ok
  end
  
  it "should include Jax spec helpers in jasmine" do
    get '/jasmine/'
    last_response.body.should match(/jax_spec_environment_helper\.js/)
    last_response.should be_ok
  end
end
