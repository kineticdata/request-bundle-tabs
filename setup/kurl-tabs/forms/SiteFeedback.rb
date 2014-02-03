require File.join(File.dirname(__FILE__),"../config.rb")

service_item "Site Feedback" do
  catalog CATALOG_NAME
  categories ""
  type "Portal"
  description nil
  display_page DISPLAY_PAGE
  display_name "#{DISPLAY_NAME_FOR_URL}-Feedback"
  web_server WEB_SERVER
  authentication :default
  allow_anonymous true
  page "Initial Page",
    :contents,
    :vertical_buttons,
    :submit_button_value => "Submit" do
    section  "Information",
      :style_class => " border rounded "
    text "Site Feedback", "Site Feedback",
      :style_class => " sectionHeader "
    text "Site Feedback Description", "Use the form below to send us your comments, report any problems you experienced finding information on our website or to request to add a new service.\n"
    section  "Questions",
      :style_class => " border rounded "
    question "Feedback Selection", "What would you like to do:", :list,
      :list_box,
      :horizontal,
      :required,
      :choice_list => "FeedbackSelection",
      :required_text => "What would you like to do Required!",
      :field_map_number => "6" do
      choice "Send comments"
      choice "Report problem"
      choice "Add new service"
    end
    question "Description", "Description:", :free_text,
      :required,
      :size => "50",
      :rows => "10",
      :required_text => "Description Required!",
      :field_map_number => "5"
    section  "Submitter",
      :removed
    text "Submitter Header", "Submitter Information",
      :style_class => " primaryColorHeader "
    question "Requester First Name", "Requester First Name", :free_text,
      :required,
      :advance_default,
      :editor_label => "Req First Name",
      :default_form => "CTM:People",
      :default_field => "First Name",
      :default_qual => "$\\USER$= 'Remedy Login ID'",
      :size => "20",
      :rows => "1",
      :max => "50",
      :required_text => "Requester First Name",
      :field_map_number => "1"
    question "Requester Last Name", "Requester Last Name", :free_text,
      :required,
      :advance_default,
      :editor_label => "Req Last Name",
      :default_form => "CTM:People",
      :default_field => "Last Name",
      :default_qual => "$\\USER$= 'Remedy Login ID'",
      :size => "20",
      :rows => "1",
      :max => "100",
      :required_text => "Requester Last Name",
      :field_map_number => "2"
    question "Requester People Number", "Requester People Number", :free_text,
      :advance_default,
      :editor_label => "Req People #",
      :default_form => "CTM:People",
      :default_field => "Person ID",
      :default_qual => "$\\USER$= 'Remedy Login ID'",
      :size => "20",
      :rows => "1",
      :max => "20",
      :field_map_number => "3"
    question "Requester Email Address", "Requester Email", :email,
      :required,
      :advance_default,
      :editor_label => "Req Email Address",
      :default_form => "CTM:People",
      :default_field => "Internet E-mail",
      :default_qual => "$\\USER$= 'Remedy Login ID'",
      :size => "20",
      :required_text => "Requester Email",
      :pattern_label => "Standard Email Address",
      :pattern => "^[\\w-\\.]+\\@[\\w\\.-]+\\.[a-zA-Z]{2,4}$",
      :validation_text => "Requester Email Address (Standard Email Address)",
      :field_map_number => "4"
    question "Req Login ID", "Requester Login ID", :free_text,
      :advance_default,
      :default_form => "CTM:People",
      :default_field => "Remedy Login ID",
      :default_qual => "$\\USER$= 'Remedy Login ID'",
      :size => "20",
      :rows => "1",
      :field_map_number => "7"
  end
  page "Confirmation Page",
    :confirmation,
    :vertical_buttons,
    :display_page => CONFIRMATION_PAGE do
    section  "Details"
  end
end
