require File.join(File.dirname(__FILE__),"config.rb")

catalog CATALOG_NAME,
  :description => CATALOG_SERVICE_CATALOG_NAME,
  :web_server_url => WEB_SERVER,
  :display_page => DISPLAY_PAGE,
  :assignee_group => "0;",
  :management_group => MANAGEMENT_GROUP do
  category "Example Templates",
    :active,
    :description => "Included in this catalog is a sample template to get you started"
  category "Example Templates :: Example Templates Subcategory",
    :active,
    :description => "Included in this catalog is a sample template to get you started"
  logout_action :go_to_template,
     :template_name => STANDARD_AUTHENTICATION_FORM,
     :catalog_name => CATALOG_NAME
 end