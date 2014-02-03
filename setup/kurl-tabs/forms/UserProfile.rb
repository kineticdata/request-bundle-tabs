require File.join(File.dirname(__FILE__),"../config.rb")

service_item "UserProfile" do
  catalog CATALOG_NAME
  categories ""
  type "Request"
  description "Update Personal Information"
  display_page DISPLAY_PAGE
  display_name "#{DISPLAY_NAME_FOR_URL}-UserProfile"
  web_server WEB_SERVER
  page "Initial Page",
    :contents,
    :horizontal_buttons,
    :submit_button_value => "Submit" do
    section  "User Information",
      :style_class => " border rounded "
    text "Section Title", "User Information",
      :style_class => " sectionHeader "
    question "Requester First Name", "First Name", :free_text,
      :required,
      :advance_default,
      :editor_label => "Req First Name",
      :answer_mapping => "First Name",
      :default_form => "KS_SAMPLE_People",
      :default_field => "First Name",
      :default_qual => "'AR Login'=$\\USER$",
      :size => "20",
      :rows => "1",
      :max => "50",
      :required_text => "Requester First Name"
    question "Requester Last Name", "Last Name", :free_text,
      :required,
      :advance_default,
      :editor_label => "Req Last Name",
      :answer_mapping => "Last Name",
      :default_form => "KS_SAMPLE_People",
      :default_field => "Last Name",
      :default_qual => "'AR Login'=$\\USER$",
      :size => "20",
      :rows => "1",
      :max => "100",
      :required_text => "Requester Last Name"
    question "Requester Email Address", "Email", :email,
      :required,
      :advance_default,
      :editor_label => "Req Email Address",
      :answer_mapping => "Contact Info Value",
      :default_form => "KS_SAMPLE_People",
      :default_field => "Email",
      :default_qual => "'AR Login'=$\\USER$",
      :size => "20",
      :required_text => "Requester Email",
      :pattern_label => "Standard Email Address",
      :pattern => "^[\\w-\\.]+\\@[\\w\\.-]+\\.[a-zA-Z]{2,4}$",
      :validation_text => "Requester Email Address (Standard Email Address)",
      :style_class => " email ",
      :field_map_number => "1"
    question "Address", "Address", :free_text,
      :advance_default,
      :default_form => "KS_SAMPLE_People",
      :default_field => "AddrLine1",
      :default_qual => "'AR Login'=$\\USER$",
      :size => "20",
      :rows => "1",
      :field_map_number => "2"
    question "City", "City", :free_text,
      :advance_default,
      :default_form => "KS_SAMPLE_People",
      :default_field => "City",
      :default_qual => "'AR Login'=$\\USER$",
      :size => "20",
      :rows => "1",
      :field_map_number => "3"
    question "State", "State", :free_text,
      :advance_default,
      :default_form => "KS_SAMPLE_People",
      :default_field => "State/Prov",
      :default_qual => "'AR Login'=$\\USER$",
      :size => "20",
      :rows => "1",
      :field_map_number => "4"
    question "Zip", "Zip", :free_text,
      :advance_default,
      :default_form => "KS_SAMPLE_People",
      :default_field => "Postal Code",
      :default_qual => "'AR Login'=$\\USER$",
      :size => "20",
      :rows => "1",
      :field_map_number => "5"
  end
  page "Confirmation Page",
    :confirmation,
    :vertical_buttons,
    :display_page => CONFIRMATION_PAGE do
    section  "Details"
  end
  task_tree "An automated create",
    :type => "Complete",
    :xml => "<taskTree schema_version=\"1.0\" version=\"\" builder_version=\"1.0.0\">\n                    <name>Standard incident process</name>\n                    <author/>\n                    <notes/>\n                    <lastID>3</lastID>\n                    <request>\n                      <task name=\"Create IT Incident\" id=\"sithco_incident_create_deferred_v1_1\" definition_id=\"sithco_incident_create_deferred_v1\" x=\"220\" y=\"280\">\n                        <version>1</version>\n                        <configured>true</configured>\n                        <defers>true</defers>\n                        <deferrable>true</deferrable>\n                        <visible>true</visible>\n                        <parameters>\n                          <parameter id=\"ar_login\" tooltip=\"Ar Login\" label=\"AR Login\" required=\"false\" dependsOnId=\"\" dependsOnValue=\"\" menu=\"\">&lt;%=@dataset['Submitter']%&gt;</parameter>\n                          <parameter id=\"first_name\" tooltip=\"First Name\" label=\"First Name\" required=\"false\" dependsOnId=\"\" dependsOnValue=\"\" menu=\"\">&lt;%=@answers['Req First Name']%&gt;</parameter>\n                          <parameter id=\"last_name\" tooltip=\"Last Name\" label=\"Last Name\" required=\"false\" dependsOnId=\"\" dependsOnValue=\"\" menu=\"\">&lt;%=@answers['Req Last Name']%&gt;</parameter>\n                          <parameter id=\"email\" tooltip=\"Email Address\" label=\"Email\" required=\"false\" dependsOnId=\"\" dependsOnValue=\"\" menu=\"\">&lt;%=@answers['Req Email Address']%&gt;</parameter>\n                          <parameter id=\"phone\" tooltip=\"Telephone Number\" label=\"Phone Number\" required=\"false\" dependsOnId=\"\" dependsOnValue=\"\" menu=\"\"/>\n                          <parameter id=\"summary\" tooltip=\"Summary\" label=\"Summary\" required=\"false\" dependsOnId=\"\" dependsOnValue=\"\" menu=\"\">Person Update</parameter>\n                          <parameter id=\"description\" tooltip=\"Description\" label=\"Description\" required=\"false\" dependsOnId=\"\" dependsOnValue=\"\" menu=\"\">Justification: &lt;%=@answers['Business justification']%&gt;</parameter>\n                        </parameters>\n                        <messages>\n                          <message type=\"Create\">Created IT Ticket #&lt;%=@results['Create IT Incident']['Entry Id']%&gt;</message>\n                          <message type=\"Update\">There has been an update to IT Ticket #&lt;%=@results['Create IT Incident']['Entry Id']%&gt;</message>\n                          <message type=\"Complete\">Completed IT Ticket #&lt;%=@results['Create IT Incident']['Entry Id']%&gt;</message>\n                        </messages>\n                        <dependents>\n                          <task type=\"Complete\" label=\"\" value=\"\">kinetic_submission_update_v1_3</task>\n                        </dependents>\n                      </task>\n                      <task name=\"Request Complete\" id=\"kinetic_submission_update_v1_3\" definition_id=\"kinetic_submission_update_v1\" x=\"320\" y=\"510\">\n                        <version>1</version>\n                        <configured>true</configured>\n                        <defers>false</defers>\n                        <deferrable>false</deferrable>\n                        <visible>false</visible>\n                        <parameters>\n                          <parameter id=\"ValidationStatus\" tooltip=\"Validation status for the original request: Completed or Rejected for example.\" label=\"Validation Status\" required=\"true\" dependsOnId=\"\" dependsOnValue=\"\" menu=\"\">Completed</parameter>\n                          <parameter id=\"RequestStatus\" tooltip=\"Value for the 'Request Status' field\" label=\"Request Status\" required=\"true\" dependsOnId=\"\" dependsOnValue=\"\" menu=\"Open,Closed\">Closed</parameter>\n                        </parameters>\n                        <messages>\n                          <message type=\"Create\"/>\n                          <message type=\"Update\"/>\n                          <message type=\"Complete\"/>\n                        </messages>\n                        <dependents/>\n                      </task>\n                      <task name=\"Mark Request In progress\" id=\"kinetic_submission_update_v1_2\" definition_id=\"kinetic_submission_update_v1\" x=\"50\" y=\"150\">\n                        <version>1</version>\n                        <configured>true</configured>\n                        <defers>false</defers>\n                        <deferrable>false</deferrable>\n                        <visible>false</visible>\n                        <parameters>\n                          <parameter id=\"ValidationStatus\" tooltip=\"Validation status for the original request: Completed or Rejected for example.\" label=\"Validation Status\" required=\"true\" dependsOnId=\"\" dependsOnValue=\"\" menu=\"\">In progress</parameter>\n                          <parameter id=\"RequestStatus\" tooltip=\"Value for the 'Request Status' field\" label=\"Request Status\" required=\"true\" dependsOnId=\"\" dependsOnValue=\"\" menu=\"Open,Closed\">Open</parameter>\n                        </parameters>\n                        <messages>\n                          <message type=\"Create\"/>\n                          <message type=\"Update\"/>\n                          <message type=\"Complete\"/>\n                        </messages>\n                        <dependents/>\n                      </task>\n                      <task name=\"Start\" id=\"start\" definition_id=\"system_start_v1\" x=\"180\" y=\"10\">\n                        <version>1</version>\n                        <configured>true</configured>\n                        <defers>false</defers>\n                        <deferrable>false</deferrable>\n                        <visible>false</visible>\n                        <parameters/>\n                        <messages/>\n                        <dependents>\n                          <task type=\"Complete\" label=\"\" value=\"\">sithco_incident_create_deferred_v1_1</task>\n                          <task type=\"Complete\" label=\"\" value=\"\">kinetic_submission_update_v1_2</task>\n                        </dependents>\n                      </task>\n                    </request>\n                  </taskTree>",
    :description => "Kinetic Task Process Tree",
    :notes => "A new task process"
end