require File.join(File.dirname(__FILE__),"../config.rb")

service_item "About" do
  catalog CATALOG_NAME
  categories ""
  type "Portal"
  description "Dynamic about page which allows for editting content"
  display_page ABOUT_PAGE
  display_name "#{DISPLAY_NAME_FOR_URL}-About"
  web_server WEB_SERVER
  authentication :default
  form_type :launcher
  allow_anonymous true
  page "About Page",
    :contents,
    :horizontal_buttons,
    :submit_button_value => "Submit" do
    section  "About"
    text "Title", "<header>\n<h2>\nWelcome to IT Services Online\n</h2>\n<hr class=\"soften\">\n</header>"
    text "Information", "<p>\nThis is an example about page, which is being rendered with content managed through a service item in Kinetic Request.\n</p>"
  end
end