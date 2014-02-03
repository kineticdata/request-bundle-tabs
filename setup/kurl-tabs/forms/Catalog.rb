require File.join(File.dirname(__FILE__),"../config.rb")

service_item "Catalog" do
  catalog CATALOG_NAME
  categories ""
  type "Portal"
  description "Catalog Portal Page"
  display_page CATALOG_PAGE
  display_name "#{DISPLAY_NAME_FOR_URL}-Catalog"
  web_server WEB_SERVER
  authentication :default
  allow_anonymous true
  form_type :launcher
  page "Initial Page",
    :contents,
    :horizontal_buttons,
    :submit_button_value => "Submit" do
  end
end