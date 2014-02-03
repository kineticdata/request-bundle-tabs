require File.join(File.dirname(__FILE__),"../config.rb")

service_item "Submission Activity" do
  catalog CATALOG_NAME
  categories ""
  type "Portal"
  description "Submission Activity Page"
  display_page SUBMISSIONS_ACTIVITY_PAGE
  display_name "#{DISPLAY_NAME_FOR_URL}-SubmissionsActivity"
  web_server WEB_SERVER
  authentication :default
  form_type :launcher
  page "Initial Page",
    :contents,
    :horizontal_buttons,
    :submit_button_value => "Submit" do
  end
end
